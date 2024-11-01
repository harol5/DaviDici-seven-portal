import { Composition } from "../../Models/Composition";
import classes from "../../../css/product-configurator.module.css";
import { useMemo, useReducer, useState } from "react";
import type {
    Option,
    ShoppingCartProduct as shoppingCartProductModel,
} from "../../Models/ExpressProgramModels";
import Options from "./Options";
import ConfigurationName from "./ConfigurationName";
import { router } from "@inertiajs/react";
import {
    getSkuAndPrice,
    isAlphanumericWithSpaces,
} from "../../utils/helperFunc";
import { ProductInventory } from "../../Models/Product";
import { Model } from "../../Models/ModelConfigTypes";
import useImagesComposition from "../../Hooks/useImagesComposition";
import ImageSlider from "./ImageSlider";
import ConfigurationBreakdown from "./ConfigurationBreakdown";
import ItemPropertiesAccordion from "./ItemPropertiesAccordion";
import useAccordionState from "../../Hooks/useAccordionState";

/**
 * TODO;
 * 2. add other products options.
 */

interface OtherModelsConfiguratorProps {
    composition: Composition;
    onAddToCart: (shoppingCartProduct: shoppingCartProductModel) => void;
}

interface CurrentConfiguration {
    vanity: string;
    vanityPrice: number;
    label: string;
    currentProducts: ProductInventory[];
}

function OtherModelsConfigurator({
    composition,
    onAddToCart,
}: OtherModelsConfiguratorProps) {
    // iterate over vanitites array and analize sku in order to get the valid options to get final sku. -------------|
    const initialVanityOptions = useMemo(() => {
        const all: Option[] = [];
        composition.vanities.forEach((vanity) => {
            all.push({
                code: vanity.uscode,
                imgUrl: `https://${location.hostname}/images/express-program/${composition.model}/${vanity.uscode}.webp`,
                title: vanity.descw,
                validSkus: [vanity.uscode],
                isDisabled: false,
            });
        });
        return all;
    }, []);

    const [vanityOptions, setVanityOptions] = useState(initialVanityOptions);

    // create objetct that will hold current configuration. if only one option, make it default. --------------|
    const initialConfiguration: CurrentConfiguration = useMemo(() => {
        const skuAndPrice = getSkuAndPrice(
            composition.model as Model,
            "vanity",
            {},
            composition.vanities,
            vanityOptions[0].code
        );
        const currentProducts: ProductInventory[] = [];
        skuAndPrice.product !== null &&
            currentProducts.push(skuAndPrice.product);

        return {
            label: "",
            vanity: skuAndPrice.sku,
            vanityPrice: skuAndPrice.price,
            currentProducts,
        };
    }, []);

    const reducer = (
        state: CurrentConfiguration,
        action: { type: string; payload: string | number }
    ) => {
        switch (action.type) {
            case "set-vanity-type":
                return {
                    ...state,
                    vanity: action.payload as string,
                };

            case "set-vanity-price":
                return {
                    ...state,
                    vanityPrice: action.payload as number,
                };

            case "reset-configurator":
                return {
                    ...initialConfiguration,
                };

            case "set-label":
                return {
                    ...state,
                    label: action.payload as string,
                };

            default:
                throw new Error();
        }
    };

    const [currentConfiguration, dispatch] = useReducer(
        reducer,
        initialConfiguration
    );

    // |===== COMPOSITION IMAGES =====|
    const imageUrls = useImagesComposition({
        model: composition.model as Model,
        vanitySku: currentConfiguration.vanity,
        isDoubleSink: false,
        sinkPosition: composition.sinkPosition,
        hasSideUnit: false,
        sideUnitSku: "",
        isDoubleSideUnit: false,
        currentProducts: currentConfiguration.currentProducts,
        currentMirrors: [],
    });

    // |===== ACCORDION =====|
    const { accordionState, handleAccordionState, handleOrderedAccordion } =
        useAccordionState();

    const accordionsOrder = useMemo(() => {
        let arr: string[] = ["vanity"];
        return arr;
    }, []);

    // |====== Events ======|
    const handleOptionSelected = (
        item: string,
        property: string,
        option: string
    ) => {
        if (item === "vanity") {
            const skuAndPrice = getSkuAndPrice(
                composition.model as Model,
                item,
                {},
                composition.vanities,
                option
            );

            dispatch({
                type: `set-${item}-type`,
                payload: skuAndPrice.sku,
            });
            dispatch({
                type: `set-${item}-price`,
                payload: skuAndPrice.price,
            });
        }
    };

    // Manage label (repeated logic)
    const [isMissingLabel, setIsMissingLabel] = useState(false);
    const [isInvalidLabel, setIsInvalidLabel] = useState(false);
    const handleConfigurationLabel = (name: string) => {
        if (!name) {
            setIsMissingLabel(true);
        }

        if (name && !isAlphanumericWithSpaces(name)) {
            setIsInvalidLabel(true);
            return;
        }

        if (name && isAlphanumericWithSpaces(name)) {
            setIsMissingLabel(false);
            setIsInvalidLabel(false);
        }

        dispatch({ type: "set-label", payload: name });
    };

    // Manage grand total.
    const grandTotal = useMemo(() => {
        const { vanityPrice } = currentConfiguration;

        /**
         * in order to allow the user to order or add product to
         * the shopping cart, they must select the mandatory options.
         *
         * for only vanities, user must select all the options that
         * allow the program to generate a valid sku number
         *
         * if the product includes a side unit, user also must select
         * all the options that allow the program to generate the sku for the side unit.
         *
         * following if statement checks that all the conditions mentioned
         * above are meet.
         */

        if (vanityPrice === 0) return 0;
        else {
            const grandTotal = vanityPrice;

            return grandTotal;
        }
    }, [currentConfiguration]);

    const isValidConfiguration = () => {
        if (!currentConfiguration.label) {
            alert("Looks like COMPOSITION NAME is missing!!");
            setIsMissingLabel(true);
            return false;
        }

        return true;
    };

    // Manage order now.
    const handleOrderNow = () => {
        if (!isValidConfiguration()) return;

        const { vanity: vanitySku, label } = currentConfiguration;

        const allFormattedSkus: string[] = [];

        const vanityFormattedSku = `${vanitySku}!!${composition.model}--1##${label}`;
        allFormattedSkus.push(vanityFormattedSku);

        router.get("/orders/create-so-num", {
            SKU: allFormattedSkus.join("~"),
        });
    };

    const handleResetConfigurator = () => {
        setVanityOptions(initialVanityOptions);
        dispatch({ type: "reset-configurator", payload: "" });
    };

    // Creates object for shopping cart.
    const handleAddToCart = () => {
        if (!isValidConfiguration()) return;

        const { vanity: vanitySku, label } = currentConfiguration;

        const otherProducts = {
            wallUnit: [] as ProductInventory[],
            tallUnit: [] as ProductInventory[],
            accessory: [] as ProductInventory[],
            mirror: [] as ProductInventory[],
        };

        const vanityObj = composition.vanities.find(
            (vanity) => vanity.uscode === vanitySku
        );

        const shoppingCartObj: shoppingCartProductModel = {
            composition: composition,
            description: composition.name,
            configuration: currentConfiguration,
            label,
            vanity: vanityObj!,
            sideUnits: [],
            washbasin: null,
            otherProducts,
            isDoubleSink: false,
            isDoubleSideunit: false,
            quantity: 1,
            grandTotal: grandTotal,
        };

        console.log("=== handleAddToCart ===");
        console.log(shoppingCartObj);

        onAddToCart(shoppingCartObj);
    };

    return (
        <div className={classes.compositionConfiguratorWrapper}>
            <section className={classes.leftSideConfiguratorWrapper}>
                <section className={classes.backButtonAndNameWrapper}>
                    <span
                        className={classes.backButtonWrapper}
                        onClick={() => history.back()}
                    >
                        <img
                            src="https://portal.davidici.com/images/back-triangle.svg"
                            alt="golden triangle"
                        />
                        <p>BACK</p>
                    </span>
                    <h1>{composition.name}</h1>
                    <button
                        className={classes.resetButton}
                        onClick={() => print()}
                    >
                        PRINT
                    </button>
                    <button
                        className={classes.resetButton}
                        onClick={handleResetConfigurator}
                    >
                        RESET
                    </button>
                </section>
                <section className={classes.compositionImageWrapper}>
                    <ImageSlider
                        imageUrls={imageUrls}
                        defaultImage={composition.compositionImage}
                    />
                    <ConfigurationBreakdown
                        productsConfigurator={
                            currentConfiguration.currentProducts
                        }
                        mirrorProductsConfigurator={[]}
                        isDoubleSink={false}
                        isDoubleSideUnit={false}
                    />
                </section>
            </section>
            <section className={classes.rightSideConfiguratorWrapper}>
                <ConfigurationName
                    crrName={currentConfiguration.label}
                    onChange={handleConfigurationLabel}
                    isMissingLabel={isMissingLabel}
                    isInvalidLabel={isInvalidLabel}
                />
                <ItemPropertiesAccordion
                    headerTitle="VANITY"
                    item="vanity"
                    isOpen={accordionState.vanity}
                    onClick={handleAccordionState}
                    buttons={"none"}
                    accordionsOrder={accordionsOrder}
                    onNavigation={handleOrderedAccordion}
                >
                    <Options
                        item="vanity"
                        property="type"
                        title="SELECT VANITY"
                        options={vanityOptions}
                        crrOptionSelected={currentConfiguration.vanity}
                        onOptionSelected={handleOptionSelected}
                    />
                </ItemPropertiesAccordion>

                <div className={classes.grandTotalAndOrderNowButtonWrapper}>
                    <div className={classes.grandTotalWrapper}>
                        <h1 className={classes.label}>Grand Total:</h1>
                        <span className={classes.amount}>${grandTotal}</span>
                    </div>
                    <a
                        className={classes.specsLink}
                        href={`https://www.davidici.com/${composition.model
                            .toLocaleLowerCase()
                            .replace(" ", "-")}-specs/`}
                        target="_blank"
                    >
                        SPECS
                    </a>
                    <button
                        disabled={grandTotal === 0}
                        onClick={handleOrderNow}
                    >
                        ORDER NOW
                    </button>
                    <button
                        disabled={grandTotal === 0}
                        onClick={handleAddToCart}
                    >
                        ADD TO CART
                    </button>
                </div>
            </section>
        </div>
    );
}

export default OtherModelsConfigurator;
