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
import {
    CurrentConfiguration,
    Vanity,
    VanityOptions,
} from "../../Models/EloraConfigTypes";
import { Model } from "../../Models/ModelConfigTypes";
import ItemPropertiesAccordion from "./ItemPropertiesAccordion";
import useMirrorOptions from "../../Hooks/useMirrorOptions";
import { MirrorCategory } from "../../Models/MirrorConfigTypes";
import MirrorConfigurator from "./MirrorConfigurator";

/**
 * TODO;
 * 2. add other products options.
 */

interface EloraConfiguratorProps {
    composition: Composition;
    onAddToCart: (shoppingCartProduct: shoppingCartProductModel) => void;
}

function EloraConfigurator({
    composition,
    onAddToCart,
}: EloraConfiguratorProps) {
    // |===== VANITY =====|
    const initialVanityOptions: VanityOptions = useMemo(() => {
        let baseSku: string = "";
        const mattFinishOptionsMap = new Map();
        const glassFinishOptionsMap = new Map();

        composition.vanities.forEach((vanity, index) => {
            const codes = vanity.uscode.split("-");
            // the following logic is only for NEW YORK because each model has a different sku number order.
            // EX: 71 - VB -  024  -  M03  -  V03
            //        base-sku       matt    glass

            // only get base sku from first vanity.
            if (index === 0) {
                baseSku = `${codes[0]}-${codes[1]}-${codes[2]}`;
            }

            let finishImageName = vanity.finish;
            let finishLabel = vanity.finish;

            if (vanity.finish.includes("/")) {
                finishImageName = finishImageName.replace("/", "-");
                finishLabel = finishLabel
                    .split("/")[0]
                    .replace("MATT LACQ. ", "");
            }

            if (!mattFinishOptionsMap.has(`${codes[3]}`))
                mattFinishOptionsMap.set(`${codes[3]}`, {
                    code: codes[3],
                    imgUrl: `https://portal.davidici.com/images/express-program/finishes/${finishImageName}.jpg`,
                    title: finishLabel,
                    validSkus: [],
                    isDisabled: false,
                });

            mattFinishOptionsMap
                .get(`${codes[3]}`)
                .validSkus.push(vanity.uscode);

            if (!glassFinishOptionsMap.has(`${codes[4]}`))
                glassFinishOptionsMap.set(`${codes[4]}`, {
                    code: codes[4],
                    imgUrl: `https://portal.davidici.com/images/express-program/finishes/${finishImageName}.jpg`,
                    title: finishLabel,
                    validSkus: [],
                    isDisabled: false,
                });

            glassFinishOptionsMap
                .get(`${codes[4]}`)
                .validSkus.push(vanity.uscode);
        });

        return {
            baseSku,
            mattFinishOptions: Object.values(
                Object.fromEntries(mattFinishOptionsMap)
            ),
            glassFinishOptions: Object.values(
                Object.fromEntries(glassFinishOptionsMap)
            ),
        };
    }, []);

    const [vanityOptions, setVanityOptions] = useState(initialVanityOptions);

    // |===== WASHBASIN =====| (repeated logic)
    const washbasinOptions: Option[] = useMemo(() => {
        const all: Option[] = [];
        composition.washbasins.forEach((washbasin) => {
            all.push({
                code: washbasin.uscode,
                imgUrl: `https://${location.hostname}/images/express-program/washbasins/${washbasin.uscode}.webp`,
                title: washbasin.descw,
                validSkus: [washbasin.uscode],
                isDisabled: false,
            });
        });

        // adds option to remove washbasin.
        all.push({
            code: "",
            imgUrl: `https://portal.davidici.com/images/express-program/washbasins/no-sink.webp`,
            title: "NO WASHBASIN",
            validSkus: [""],
            isDisabled: false,
        });

        return all;
    }, []);

    // |====== MIRRORS LOGIC -> get all mirror options ======|
    const {
        mirrorCabinetOptions,
        ledMirrorOptions,
        openCompMirrorOptions,
        crrMirrorCategory,
        currentMirrorsConfiguration,
        handleSwitchCrrMirrorCategory: updateCurrentMirrorCategory,
        handleMirrorOptionSelected: updateMirrorOptions,
        handleResetMirrorConfigurator: resetMirrorConfigurator,
        handleClearMirrorCategory: clearMirrorCategory,
        getFormattedMirrorSkus,
        getMirrorProductObj,
        isMirrorCabinetConfigValid,
    } = useMirrorOptions(composition.otherProductsAvailable.mirrors);

    const handleSwitchCrrMirrorCategory = (mirrorCategory: MirrorCategory) => {
        updateCurrentMirrorCategory(mirrorCategory);
    };

    // |===== INITIAL CONFIG =====|
    const initialConfiguration: CurrentConfiguration = useMemo(() => {
        const vanity: Vanity = {
            baseSku: vanityOptions.baseSku,
            mattFinish:
                vanityOptions.mattFinishOptions.length === 1
                    ? vanityOptions.mattFinishOptions[0].code
                    : "",
            glassFinish:
                vanityOptions.glassFinishOptions.length === 1
                    ? vanityOptions.glassFinishOptions[0].code
                    : "",
        };

        const vanitySkuAndPrice = getSkuAndPrice(
            composition.model as Model,
            "vanity",
            vanity,
            composition.vanities
        );

        return {
            label: "",
            vanity,
            vanitySku: vanitySkuAndPrice.sku,
            vanityPrice: vanitySkuAndPrice.price,
            washbasin: composition.washbasins[0].uscode,
            washbasinPrice: composition.washbasins[0].msrp,
            isDoubleSink: composition.name.includes("DOUBLE"),
        };
    }, []);

    const reducer = (
        state: CurrentConfiguration,
        action: { type: string; payload: string | number }
    ) => {
        switch (action.type) {
            case "set-vanity-mattFinish":
                return {
                    ...state,
                    vanity: {
                        ...state.vanity,
                        mattFinish: action.payload as string,
                    },
                };

            case "set-vanity-glassFinish":
                return {
                    ...state,
                    vanity: {
                        ...state.vanity,
                        glassFinish: action.payload as string,
                    },
                };

            case "set-vanity-sku":
                return {
                    ...state,
                    vanitySku: action.payload as string,
                };

            case "set-vanity-price":
                return {
                    ...state,
                    vanityPrice: action.payload as number,
                };

            case "set-washbasin-type":
                return {
                    ...state,
                    washbasin: action.payload as string,
                };

            case "set-washbasin-price":
                return {
                    ...state,
                    washbasinPrice: action.payload as number,
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

    // |===== GRAND TOTAL =====|
    const grandTotal = useMemo(() => {
        const { vanityPrice, washbasinPrice, isDoubleSink } =
            currentConfiguration;

        const { mirrorCabinetPrice, ledMirrorPrice, openCompMirrorPrice } =
            currentMirrorsConfiguration;

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
            const finalVanityPrice = isDoubleSink
                ? vanityPrice * 2
                : vanityPrice;

            const grandTotal =
                finalVanityPrice +
                washbasinPrice +
                mirrorCabinetPrice +
                ledMirrorPrice +
                openCompMirrorPrice;

            return grandTotal;
        }
    }, [currentConfiguration, currentMirrorsConfiguration]);

    // |===== COMPOSITION NAME =====| (repeated logic)
    const [isMissingLabel, setIsMissingLabel] = useState(false);
    const [isInvalidLabel, setIsInvalidLabel] = useState(false);

    // |===== EVENT HANDLERS =====|
    const handleOptionSelected = (
        item: string,
        property: string,
        option: string
    ) => {
        if (item === "vanity") {
            const copyOptions = structuredClone(vanityOptions);

            // Checks if any matt option should be disabled.
            for (const mattFinishOption of copyOptions.mattFinishOptions) {
                if (property === "mattFinish") break;
                for (let i = 0; i < mattFinishOption.validSkus.length; i++) {
                    const validSku = mattFinishOption.validSkus[i];
                    if (validSku.includes(option)) {
                        mattFinishOption.isDisabled = false;
                        break;
                    }

                    if (i === mattFinishOption.validSkus.length - 1)
                        mattFinishOption.isDisabled = true;
                }
            }

            // Checks if any glass option should be disabled.
            for (const glassFinishOption of copyOptions.glassFinishOptions) {
                if (property === "glassFinish") break;
                for (let i = 0; i < glassFinishOption.validSkus.length; i++) {
                    const validSku = glassFinishOption.validSkus[i];
                    if (validSku.includes(option)) {
                        glassFinishOption.isDisabled = false;
                        break;
                    }

                    if (i === glassFinishOption.validSkus.length - 1)
                        glassFinishOption.isDisabled = true;
                }
            }

            const vanityCurrentConfiguration = structuredClone(
                currentConfiguration.vanity
            );

            vanityCurrentConfiguration[
                property as keyof typeof vanityCurrentConfiguration
            ] = option;

            const skuAndPrice = getSkuAndPrice(
                composition.model as Model,
                item,
                vanityCurrentConfiguration,
                composition.vanities
            );

            dispatch({ type: `set-${item}-sku`, payload: skuAndPrice.sku });
            dispatch({
                type: `set-${item}-price`,
                payload: skuAndPrice.price,
            });
            dispatch({ type: `set-${item}-${property}`, payload: `${option}` });

            setVanityOptions(copyOptions);
        }

        if (item === "washbasin") {
            const skuAndPrice = getSkuAndPrice(
                composition.model as Model,
                item,
                {},
                composition.washbasins,
                option
            );

            dispatch({
                type: `set-${item}-${property}`,
                payload: skuAndPrice.sku,
            });
            dispatch({
                type: `set-${item}-price`,
                payload: skuAndPrice.price,
            });
        }

        // |===vvvvvv SAME MIRROR LOGIC FOR ALL MODELS VVVVV===|
        updateMirrorOptions(
            item,
            property,
            option,
            composition.otherProductsAvailable.mirrors
        );
    };

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

    const isValidConfiguration = () => {
        if (!currentConfiguration.label) {
            alert("Looks like COMPOSITION NAME is missing!!");
            setIsMissingLabel(true);
            return false;
        }

        if (!isMirrorCabinetConfigValid()) {
            alert(
                "Looks like you forgot to select all available MIRROR CABINET OPTIONS. Either clear the mirror cabinet section or select the missing option(s). "
            );
            return false;
        }

        return true;
    };

    const handleOrderNow = () => {
        if (!isValidConfiguration()) return;

        const {
            vanitySku,
            washbasin: washbasinSku,
            label,
            isDoubleSink,
        } = currentConfiguration;

        const allFormattedSkus: string[] = [];

        const vanityFormattedSku = `${vanitySku}!!${composition.model}${
            isDoubleSink ? "--2" : "--1"
        }##${label}`;
        allFormattedSkus.push(vanityFormattedSku);

        const washbasinFormattedSku = washbasinSku
            ? `${washbasinSku}!!${composition.model}--1##${label}`
            : "";
        washbasinFormattedSku && allFormattedSkus.push(washbasinFormattedSku);

        // ========= VVVV MIRROR (REPEATED LOGIC) ==========VVVVV
        getFormattedMirrorSkus(
            composition.model,
            currentConfiguration.label,
            allFormattedSkus
        );

        router.get("/orders/create-so-num", {
            SKU: allFormattedSkus.join("~"),
        });
    };

    const handleResetConfigurator = () => {
        setVanityOptions(initialVanityOptions);
        resetMirrorConfigurator();
        dispatch({ type: "reset-configurator", payload: "" });
    };

    const handleAddToCart = () => {
        if (!isValidConfiguration()) return;

        const {
            vanitySku,
            washbasin: washbasinSku,
            label,
            isDoubleSink,
        } = currentConfiguration;

        const otherProducts = {
            wallUnit: [] as ProductInventory[],
            tallUnit: [] as ProductInventory[],
            accessory: [] as ProductInventory[],
            mirror: [] as ProductInventory[],
        };

        const vanityObj = composition.vanities.find(
            (vanity) => vanity.uscode === vanitySku
        );
        const washbasinObj = composition.washbasins.find(
            (washbasin) => washbasin.uscode === washbasinSku
        );

        getMirrorProductObj(
            composition.otherProductsAvailable.mirrors,
            otherProducts
        );

        const shoppingCartObj: shoppingCartProductModel = {
            composition: composition,
            description: composition.name,
            configuration: currentConfiguration,
            label,
            vanity: vanityObj!,
            sideUnits: [],
            washbasin: washbasinObj!,
            otherProducts,
            isDoubleSink,
            isDoubleSideunit: false,
            quantity: 1,
            grandTotal: grandTotal,
        };

        onAddToCart(shoppingCartObj);
    };

    console.log("=== elora confg render ===");
    console.log("composition:", composition);
    console.log("current config:", currentConfiguration);
    console.log("current mirror config:", currentMirrorsConfiguration);
    console.log("grand total:", grandTotal);

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
                        onClick={handleResetConfigurator}
                    >
                        RESET
                    </button>
                </section>
                <section className={classes.compositionImageWrapper}>
                    <img
                        src={composition.compositionImage}
                        alt="product image"
                        onError={(e) => {
                            (e.target as HTMLImageElement).onerror = null;
                            (e.target as HTMLImageElement).src =
                                "https://portal.davidici.com/images/express-program/not-image.jpg";
                        }}
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
                <ItemPropertiesAccordion headerTitle="VANITY">
                    <Options
                        item="vanity"
                        property="mattFinish"
                        title="SELECT MATT FINISH"
                        options={vanityOptions.mattFinishOptions}
                        crrOptionSelected={
                            currentConfiguration.vanity.mattFinish
                        }
                        onOptionSelected={handleOptionSelected}
                    />
                    <Options
                        item="vanity"
                        property="glassFinish"
                        title="SELECT GLASS FINISH"
                        options={vanityOptions.glassFinishOptions}
                        crrOptionSelected={
                            currentConfiguration.vanity.glassFinish
                        }
                        onOptionSelected={handleOptionSelected}
                    />
                </ItemPropertiesAccordion>

                <ItemPropertiesAccordion headerTitle="WASHBASIN">
                    <Options
                        item="washbasin"
                        property="type"
                        title="SELECT WASHBASIN"
                        options={washbasinOptions}
                        crrOptionSelected={currentConfiguration.washbasin}
                        onOptionSelected={handleOptionSelected}
                    />
                </ItemPropertiesAccordion>

                <MirrorConfigurator
                    mirrorCabinetOptions={mirrorCabinetOptions}
                    ledMirrorOptions={ledMirrorOptions}
                    openCompMirrorOptions={openCompMirrorOptions}
                    crrMirrorCategory={crrMirrorCategory}
                    currentMirrorsConfiguration={currentMirrorsConfiguration}
                    handleSwitchCrrMirrorCategory={
                        handleSwitchCrrMirrorCategory
                    }
                    clearMirrorCategory={clearMirrorCategory}
                    handleOptionSelected={handleOptionSelected}
                ></MirrorConfigurator>

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

export default EloraConfigurator;
