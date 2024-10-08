import { useMemo, useReducer, useState } from "react";
import type { Composition } from "../../Models/Composition";
import type {
    Option,
    ShoppingCartProduct as shoppingCartProductModel,
} from "../../Models/ExpressProgramModels";
import type {
    Vanity,
    VanityOptions,
    CurrentConfiguration,
} from "../../Models/KoraXlConfigTypes";
import {
    getSkuAndPrice,
    isAlphanumericWithSpaces,
    scrollToView,
} from "../../utils/helperFunc";
import { router } from "@inertiajs/react";
import { ProductInventory } from "../../Models/Product";
import classes from "../../../css/product-configurator.module.css";
import ConfigurationName from "./ConfigurationName";
import Options from "./Options";
import useMirrorOptions from "../../Hooks/useMirrorOptions";
import { MirrorCategory } from "../../Models/MirrorConfigTypes";
import { Item, Model } from "../../Models/ModelConfigTypes";
import ItemPropertiesAccordion from "./ItemPropertiesAccordion";
import MirrorConfigurator from "./MirrorConfigurator";
import useAccordionState from "../../Hooks/useAccordionState";

interface KoraXlConfiguratorProps {
    composition: Composition;
    onAddToCart: (shoppingCartProduct: shoppingCartProductModel) => void;
}

function KoraXlConfigurator({
    composition,
    onAddToCart,
}: KoraXlConfiguratorProps) {
    // |===== VANITY =====|
    const initialVanityOptions: VanityOptions = useMemo(() => {
        let baseSku: string = "";
        const finishOptionsMap = new Map();

        composition.vanities.forEach((vanity, index) => {
            const codes = vanity.uscode.split("-");
            // the following logic is only for KORA, KORA XL and OPERA because each model has a different sku number order.
            // EX: 56 - VB - 024  - M23
            //        base sku     finish

            // only get base sku from first vanity.
            if (index === 0) {
                baseSku = `${codes[0]}-${codes[1]}-${codes[2]}`;
            }

            let finishLabel = vanity.finish;
            if (vanity.finish.includes("MATT LACQ. ")) {
                finishLabel = finishLabel.replace("MATT LACQ. ", "");
            }

            if (!finishOptionsMap.has(`${codes[3]}`))
                finishOptionsMap.set(`${codes[3]}`, {
                    code: codes[3],
                    imgUrl: `https://portal.davidici.com/images/express-program/finishes/${vanity.finish}.jpg`,
                    title: finishLabel,
                    validSkus: [],
                    isDisabled: false,
                });

            finishOptionsMap.get(`${codes[3]}`).validSkus.push(vanity.uscode);
        });

        return {
            baseSku,
            finishOptions: Object.values(Object.fromEntries(finishOptionsMap)),
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

    // |===== TALL UNIT =====|
    const tallUnitOptions: Option[] | null = useMemo(() => {
        const all: Option[] = [];
        const { tallUnitsLinenClosets } = composition.otherProductsAvailable;
        if (tallUnitsLinenClosets.length === 0) return null;

        tallUnitsLinenClosets.forEach((tallUnit) => {
            all.push({
                code: tallUnit.uscode,
                imgUrl: `https://${location.hostname}/images/express-program/KORA XL/${tallUnit.uscode}.webp`,
                title: tallUnit.descw,
                validSkus: [tallUnit.uscode],
                isDisabled: false,
            });
        });

        return all;
    }, []);

    const [tallUnitStatus, setTallUnitStatus] = useState({
        isTallUnitSelected: false,
        isTallUnitValid: false,
    });

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

    // |===== ACCORDION =====|
    const { accordionState, handleAccordionState, handleOrderedAccordion } =
        useAccordionState();

    const accordionsOrder = ["vanity", "washbasin", "tallUnit", "mirror"];

    // |===== INITIAL CONFIG =====|
    const initialConfiguration: CurrentConfiguration = useMemo(() => {
        const vanity: Vanity = {
            baseSku: vanityOptions.baseSku,
            finish: vanityOptions.finishOptions[0].code,
        };

        const vanitySkuAndPrice = getSkuAndPrice(
            composition.model as Model,
            "vanity",
            vanity,
            composition.vanities
        );

        const washbasinPrice = composition.washbasins[0].sprice
            ? composition.washbasins[0].sprice
            : composition.washbasins[0].msrp;

        return {
            label: "",
            vanity,
            vanitySku: vanitySkuAndPrice.sku,
            vanityPrice: vanitySkuAndPrice.price,
            washbasin: composition.washbasins[0].uscode,
            washbasinPrice,
            isDoubleSink: composition.name.includes("DOUBLE"),
            tallUnit: "",
            tallUnitPrice: 0,
        };
    }, []);

    const reducer = (
        state: CurrentConfiguration,
        action: { type: string; payload: string | number }
    ) => {
        switch (action.type) {
            case "set-vanity-finish":
                return {
                    ...state,
                    vanity: {
                        ...state.vanity,
                        finish: action.payload,
                    } as Vanity,
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

            case "set-tallUnit-type":
                return {
                    ...state,
                    tallUnit: action.payload as string,
                };

            case "set-tallUnit-price":
                return {
                    ...state,
                    tallUnitPrice: action.payload as number,
                };

            case "reset-tallUnit":
                return {
                    ...state,
                    tallUnit: initialConfiguration.tallUnit as string,
                    tallUnitPrice: initialConfiguration.tallUnitPrice as number,
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
        const { vanityPrice, washbasinPrice, isDoubleSink, tallUnitPrice } =
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
                tallUnitPrice +
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

            for (const finishOption of copyOptions.finishOptions) {
                if (property === "finish") break;
                for (let i = 0; i < finishOption.validSkus.length; i++) {
                    const validSku = finishOption.validSkus[i];
                    if (validSku.includes(option)) {
                        finishOption.isDisabled = false;
                        break;
                    }

                    if (i === finishOption.validSkus.length - 1)
                        finishOption.isDisabled = true;
                }
            }

            const vanityCurrentConfiguration = structuredClone(
                currentConfiguration.vanity
            );

            vanityCurrentConfiguration[
                property as keyof typeof vanityCurrentConfiguration
            ] = option;

            const { sku, price } = getSkuAndPrice(
                composition.model as Model,
                item,
                vanityCurrentConfiguration,
                composition.vanities
            );

            dispatch({ type: `set-${item}-sku`, payload: sku });
            dispatch({
                type: `set-${item}-price`,
                payload: price,
            });
            dispatch({ type: `set-${item}-${property}`, payload: `${option}` });
            setVanityOptions(copyOptions);

            const lastIndex = accordionsOrder.length - 1;
            const itemIndex = accordionsOrder.indexOf(item);
            if (itemIndex !== lastIndex && price > 0) {
                const nextItem = accordionsOrder[itemIndex + 1] as Item;
                handleOrderedAccordion(item, nextItem);
            }
        }

        if (item === "washbasin") {
            const { sku, price } = getSkuAndPrice(
                composition.model as Model,
                item,
                {},
                composition.washbasins,
                option
            );

            dispatch({
                type: `set-${item}-${property}`,
                payload: sku,
            });
            dispatch({
                type: `set-${item}-price`,
                payload: price,
            });

            const lastIndex = accordionsOrder.length - 1;
            const itemIndex = accordionsOrder.indexOf(item);
            if (itemIndex !== lastIndex) {
                const nextItem = accordionsOrder[itemIndex + 1] as Item;
                handleOrderedAccordion(item, nextItem);
            }
        }

        if (item === "tallUnit") {
            const { sku, price } = getSkuAndPrice(
                composition.model as Model,
                item,
                {},
                composition.otherProductsAvailable.tallUnitsLinenClosets,
                option
            );

            dispatch({
                type: `set-${item}-${property}`,
                payload: sku,
            });

            dispatch({
                type: `set-${item}-price`,
                payload: price,
            });

            setTallUnitStatus((prev) => ({
                ...prev,
                isTallUnitValid: price > 0,
                isTallUnitSelected: true,
            }));

            const lastIndex = accordionsOrder.length - 1;
            const itemIndex = accordionsOrder.indexOf(item);
            if (itemIndex !== lastIndex && price > 0) {
                const nextItem = accordionsOrder[itemIndex + 1] as Item;
                handleOrderedAccordion(item, nextItem);
            }
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
            scrollToView("compositionNameWrapper");
            return false;
        }

        if (
            tallUnitStatus.isTallUnitSelected &&
            !tallUnitStatus.isTallUnitValid
        ) {
            alert(
                "Looks like you forgot to select all available TALL UNIT OPTIONS. Either clear the tal unit section or select the missing option(s). "
            );
            scrollToView("tallUnit");
            return false;
        }

        if (!isMirrorCabinetConfigValid()) {
            alert(
                "Looks like you forgot to select all available MIRROR CABINET OPTIONS. Either clear the mirror cabinet section or select the missing option(s). "
            );
            scrollToView("mirror");
            return false;
        }

        return true;
    };

    const handleOrderNow = () => {
        if (!isValidConfiguration()) return;

        const {
            label,
            vanitySku,
            washbasin: washbasinSku,
            isDoubleSink,
            tallUnit: tallUnitSku,
        } = currentConfiguration;

        const allFormattedSkus: string[] = [];

        const vanityFormattedSku = `${vanitySku}!!${composition.model}--${
            isDoubleSink ? "2" : "1"
        }##${label}`;
        allFormattedSkus.push(vanityFormattedSku);

        const washbasinFormattedSku = washbasinSku
            ? `${washbasinSku}!!${composition.model}--1##${label}`
            : "";
        washbasinFormattedSku && allFormattedSkus.push(washbasinFormattedSku);

        const tallUnitFormattedSku = tallUnitSku
            ? `${tallUnitSku}!!${composition.model}--1##${label}`
            : "";
        tallUnitFormattedSku && allFormattedSkus.push(tallUnitFormattedSku);

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
        setTallUnitStatus({
            isTallUnitSelected: false,
            isTallUnitValid: false,
        });
        resetMirrorConfigurator();
        dispatch({ type: "reset-configurator", payload: "" });
    };

    const handleClearItem = (item: string) => {
        switch (item) {
            case "tallUnit":
                setTallUnitStatus({
                    isTallUnitSelected: false,
                    isTallUnitValid: false,
                });
                dispatch({ type: "reset-tallUnit", payload: "" });
                break;

            default:
                throw new Error("case condition not found");
        }
    };

    const handleAddToCart = () => {
        if (!isValidConfiguration()) return;

        const {
            label,
            vanitySku,
            washbasin: washbasinSku,
            isDoubleSink,
            tallUnit: tallUnitSku,
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

        const tallUnitObj =
            composition.otherProductsAvailable.tallUnitsLinenClosets.find(
                (tallUnit) => tallUnit.uscode === tallUnitSku
            );
        tallUnitObj && otherProducts.tallUnit.push(tallUnitObj);

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

                <ItemPropertiesAccordion
                    headerTitle="VANITY"
                    item="vanity"
                    isOpen={accordionState.vanity}
                    onClick={handleAccordionState}
                >
                    <Options
                        item="vanity"
                        property="finish"
                        title="SELECT VANITY FINISH"
                        options={vanityOptions.finishOptions}
                        crrOptionSelected={currentConfiguration.vanity.finish}
                        onOptionSelected={handleOptionSelected}
                    />
                </ItemPropertiesAccordion>

                <ItemPropertiesAccordion
                    headerTitle="WASHBASIN"
                    item="washbasin"
                    isOpen={accordionState.washbasin}
                    onClick={handleAccordionState}
                >
                    <Options
                        item="washbasin"
                        property="type"
                        title="SELECT WASHBASIN"
                        options={washbasinOptions}
                        crrOptionSelected={currentConfiguration.washbasin}
                        onOptionSelected={handleOptionSelected}
                    />
                </ItemPropertiesAccordion>

                {tallUnitOptions && (
                    <ItemPropertiesAccordion
                        headerTitle="TALL UNIT 12"
                        item="tallUnit"
                        isOpen={accordionState.tallUnit}
                        onClick={handleAccordionState}
                    >
                        <button
                            className={classes.clearButton}
                            onClick={() => handleClearItem("tallUnit")}
                        >
                            CLEAR
                        </button>
                        <Options
                            item="tallUnit"
                            property="type"
                            title="SELECT TALL UNIT"
                            options={tallUnitOptions}
                            crrOptionSelected={currentConfiguration.tallUnit}
                            onOptionSelected={handleOptionSelected}
                        />
                    </ItemPropertiesAccordion>
                )}

                {composition.otherProductsAvailable.mirrors.length > 0 && (
                    <MirrorConfigurator
                        mirrorCabinetOptions={mirrorCabinetOptions}
                        ledMirrorOptions={ledMirrorOptions}
                        openCompMirrorOptions={openCompMirrorOptions}
                        crrMirrorCategory={crrMirrorCategory}
                        currentMirrorsConfiguration={
                            currentMirrorsConfiguration
                        }
                        accordionState={accordionState}
                        handleSwitchCrrMirrorCategory={
                            handleSwitchCrrMirrorCategory
                        }
                        clearMirrorCategory={clearMirrorCategory}
                        handleOptionSelected={handleOptionSelected}
                        handleAccordionState={handleAccordionState}
                    ></MirrorConfigurator>
                )}

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
                        disabled={!grandTotal ? true : false}
                        onClick={handleOrderNow}
                    >
                        ORDER NOW
                    </button>
                    <button
                        disabled={!grandTotal ? true : false}
                        onClick={handleAddToCart}
                    >
                        ADD TO CART
                    </button>
                </div>
            </section>
        </div>
    );
}

export default KoraXlConfigurator;
