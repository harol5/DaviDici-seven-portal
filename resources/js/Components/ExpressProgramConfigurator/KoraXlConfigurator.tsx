import {useMemo, useReducer, useState} from "react";
import type {Composition} from "../../Models/Composition";
import type {
    Option,
    OtherItems,
    ShoppingCartComposition,
    ShoppingCartCompositionProduct,
} from "../../Models/ExpressProgramModels";
import type {CurrentConfiguration, Vanity, VanityOptions,} from "../../Models/KoraXlConfigTypes";
import {getConfigTitle, getSkuAndPrice, isAlphanumericWithSpaces, scrollToView,} from "../../utils/helperFunc";
import {router} from "@inertiajs/react";
import {ProductInventory} from "../../Models/Product";
import classes from "../../../css/product-configurator.module.css";
import ConfigurationName from "./ConfigurationName";
import Options from "./Options";
import useMirrorOptions from "../../Hooks/useMirrorOptions";
import {MirrorCategory} from "../../Models/MirrorConfigTypes";
import {ItemFoxPro, Model} from "../../Models/ModelConfigTypes";
import ItemPropertiesAccordion from "./ItemPropertiesAccordion";
import MirrorConfigurator from "./MirrorConfigurator";
import useAccordionState from "../../Hooks/useAccordionState";
import ConfigurationBreakdown from "./ConfigurationBreakdown";
import useImagesComposition from "../../Hooks/useImagesComposition";
import ImageSlider from "./ImageSlider";
import {generateShoppingCartCompositionProductObjs} from "../../utils/shoppingCartUtils";
import useExtraProductsExpressProgram from "../../Hooks/useExtraProductsExpressProgram.tsx";
import MultiItemSelector from "./MultiItemSelector.tsx";
import {ExtraItems} from "../../Models/ExtraItemsHookModels.ts";
import {handlePrint} from "../../utils/expressProgramUtils.ts";

interface KoraXlConfiguratorProps {
    composition: Composition;
    onAddToCart: (shoppingCartComposition: ShoppingCartComposition) => void;
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

        return all;
    }, []);

    // |===== TALL UNIT =====|
    const tallUnitOptions: Option[] | null = useMemo(() => {
        const all: Option[] = [];
        const {tallUnitsLinenClosets} = composition.otherProductsAvailable;
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
        isMirrorCabinetConfigValid,
    } = useMirrorOptions(composition.otherProductsAvailable.mirrors);

    const handleSwitchCrrMirrorCategory = (mirrorCategory: MirrorCategory) => {
        updateCurrentMirrorCategory(mirrorCategory);
    };

    // |===== ACCORDION =====|
    const {accordionState, handleAccordionState, handleOrderedAccordion} =
        useAccordionState();

    const accordionsOrder = useMemo(() => {
        let arr: string[] = ["vanity", "washbasin"];
        tallUnitOptions ? arr.push("tallUnit") : null;
        composition.otherProductsAvailable.mirrors.length > 0
            ? arr.push("mirror")
            : null;

        return arr;
    }, []);

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

        const washbasinSkuAndPrice = getSkuAndPrice(
            composition.model as Model,
            "washbasin",
            {},
            composition.washbasins,
            composition.washbasins[0].uscode
        );

        const currentProducts: ProductInventory[] = [];
        vanitySkuAndPrice.product !== null &&
        currentProducts.push(vanitySkuAndPrice.product);
        washbasinSkuAndPrice.product !== null &&
        currentProducts.push(washbasinSkuAndPrice.product);

        return {
            label: "",
            vanity,
            vanitySku: vanitySkuAndPrice.sku,
            vanityPrice: vanitySkuAndPrice.price,
            washbasin: washbasinSkuAndPrice.sku,
            washbasinPrice: washbasinSkuAndPrice.price,
            isDoubleSink: composition.name.includes("DOUBLE"),
            tallUnit: "",
            tallUnitPrice: 0,
            currentProducts,
        };
    }, []);

    const reducer = (
        state: CurrentConfiguration,
        action: { type: string; payload: string | number | ProductInventory[] }
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

            case "reset-washbasin":
                return {
                    ...state,
                    washbasin: "",
                    washbasinPrice: 0,
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

            case "update-current-products":
                return {
                    ...state,
                    currentProducts: action.payload as ProductInventory[],
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

    // |===== EXTRA PRODUCTS =====|
    const {
        extraItems,
        extraItemsCurrentProducts,
        handleAddExtraProduct,
        setCurrentDisplayItem,
        removeConfiguration,
        handleOptionSelected: handleExtraItemOptionSelected,
        updateExtraItemsStateOnMainConfigChanges,
        clearExtraProduct,
        getExtraItemsProductsGrandTotal,
        resetExtraItems,
        validateExtraItemsConfig,
        getFormattedExtraItemsSkus,
        getExtraItemsCurrentProductsAsArray
    } = useExtraProductsExpressProgram(
        "KORA XL",
        initialConfiguration,
        {
            vanity: {
                options: vanityOptions,
                config: {
                    vanityObj: currentConfiguration.vanity,
                    vanitySku: currentConfiguration.vanitySku,
                    vanityPrice: currentConfiguration.vanityPrice
                },
            },
            washbasin: {
                options: washbasinOptions,
                config: {
                    washbasinSku: currentConfiguration.washbasin,
                    washbasinPrice: currentConfiguration.washbasinPrice,
                }
            },
            tallUnit: {
                options: tallUnitOptions,
                config: {
                    tallUnitObj: null,
                    tallUnitSku: currentConfiguration.tallUnit,
                    tallUnitPrice: currentConfiguration.tallUnitPrice
                }
            },
        }
    );


    // |===== GRAND TOTAL =====|
    const grandTotal = useMemo(() => {
        const {vanityPrice, washbasinPrice, isDoubleSink, tallUnitPrice} =
            currentConfiguration;

        const {mirrorCabinetPrice, ledMirrorPrice, openCompMirrorPrice} =
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

            return finalVanityPrice +
                washbasinPrice +
                tallUnitPrice +
                mirrorCabinetPrice +
                ledMirrorPrice +
                openCompMirrorPrice +
                getExtraItemsProductsGrandTotal();
        }
    }, [currentConfiguration, currentMirrorsConfiguration, extraItemsCurrentProducts]);

    // |===== COMPOSITION NAME =====| (repeated logic)
    const [isMissingLabel, setIsMissingLabel] = useState(false);
    const [isInvalidLabel, setIsInvalidLabel] = useState(false);

    // |===== HELPER FUNC =====|
    const updateCurrentProducts = (
        item: ItemFoxPro,
        action: "update" | "remove",
        product?: ProductInventory
    ) => {
        const updatedCurrentProducts = structuredClone(
            currentConfiguration.currentProducts
        );
        const index = updatedCurrentProducts.findIndex(
            (product) => product.item === item
        );

        if (action === "update" && product) {
            if (index !== -1) updatedCurrentProducts[index] = product;
            else updatedCurrentProducts.push(product);
        }

        if (action === "remove" && index !== -1) {
            updatedCurrentProducts.splice(index, 1);
        }

        dispatch({
            type: `update-current-products`,
            payload: updatedCurrentProducts,
        });
    };

    // |===== COMPOSITION IMAGES =====|
    const imageUrls = useImagesComposition({
        model: composition.model as Model,
        vanitySku: currentConfiguration.vanitySku,
        isDoubleSink: currentConfiguration.isDoubleSink,
        sinkPosition: composition.sinkPosition,
        hasSideUnit: false,
        sideUnitSku: "",
        isDoubleSideUnit: false,
        currentProducts: currentConfiguration.currentProducts,
        currentMirrors: currentMirrorsConfiguration.currentProducts,
    });

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

            const {sku, price, product} = getSkuAndPrice(
                composition.model as Model,
                item,
                vanityCurrentConfiguration,
                composition.vanities
            );

            dispatch({type: `set-${item}-sku`, payload: sku});
            dispatch({
                type: `set-${item}-price`,
                payload: price,
            });
            dispatch({type: `set-${item}-${property}`, payload: `${option}`});
            setVanityOptions(copyOptions);

            if (product) {
                updateCurrentProducts("VANITY", "update", product);
            }
        }

        if (item === "washbasin") {
            const {sku, price, product} = getSkuAndPrice(
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

            if (product) {
                updateCurrentProducts("WASHBASIN/SINK", "update", product);
            }
        }

        if (item === "tallUnit") {
            const {sku, price, product} = getSkuAndPrice(
                composition.model as Model,
                item,
                {},
                composition.otherProductsAvailable.tallUnitsLinenClosets,
                option
            );

            const extraItemUpdatedConfigObj = {
                tallUnitObj: null,
                tallUnitSku: sku,
                tallUnitPrice: price,
            }

            if (extraItems.tallUnit.currentlyDisplay !== -1) {
                handleExtraItemOptionSelected(
                    item,
                    extraItems.tallUnit.currentlyDisplay,
                    extraItemUpdatedConfigObj,
                    tallUnitOptions,
                    price > 0,
                    product
                );
            }else {
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

                if (product) {
                    updateCurrentProducts(
                        "TALL UNIT/LINEN CLOSET",
                        "update",
                        product
                    );
                }

                updateExtraItemsStateOnMainConfigChanges(item,tallUnitOptions,extraItemUpdatedConfigObj);
            }
        }

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

        dispatch({type: "set-label", payload: name});
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

        const {isExtraItemsConfigValid,messages} = validateExtraItemsConfig();
        if (!isExtraItemsConfigValid){
            alert(messages.join("\n"));
            return false;
        }

        return true;
    };

    const handleOrderNow = () => {
        if (!isValidConfiguration()) return;

        const {
            label,
            isDoubleSink,
            currentProducts
        } = currentConfiguration;

        const allFormattedSkus: string[] = [];

        for (const product of currentProducts) {
            if (product.item === "VANITY") {
                allFormattedSkus.push(
                    `${product.uscode}!!${composition.model}${isDoubleSink ? "--2" : "--1"
                    }##${label}`
                );
            } else {
                allFormattedSkus.push(`${product.uscode}!!${composition.model}--1##${label}`)
            }
        }

        getFormattedMirrorSkus(composition.model, label, allFormattedSkus);
        getFormattedExtraItemsSkus(allFormattedSkus,composition.model,label);
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
        dispatch({type: "reset-configurator", payload: ""});
        dispatch({
            type: `update-current-products`,
            payload: initialConfiguration.currentProducts,
        });
        resetExtraItems();
    };

    const handleClearItem = (item: string) => {
        if (extraItems[item as keyof typeof extraItems].currentlyDisplay !== -1){
            clearExtraProduct(item as keyof ExtraItems,extraItems[item as keyof typeof extraItems].currentlyDisplay);
            return;
        }

        switch (item) {
            case "washbasin":
                updateCurrentProducts("WASHBASIN/SINK", "remove");
                dispatch({type: "reset-washbasin", payload: ""});
                break;

            case "tallUnit":
                updateCurrentProducts("TALL UNIT/LINEN CLOSET", "remove");
                setTallUnitStatus({
                    isTallUnitSelected: false,
                    isTallUnitValid: false,
                });
                dispatch({type: "reset-tallUnit", payload: ""});
                updateExtraItemsStateOnMainConfigChanges(item);
                break;

            default:
                throw new Error("case condition not found");
        }
    };

    const handleAddToCart = () => {
        if (!isValidConfiguration()) return;

        const {
            label,
            isDoubleSink,
        } = currentConfiguration;

        const shoppingCartObj: ShoppingCartComposition = {
            info: composition,
            description: composition.name,
            configuration: currentConfiguration,
            label,
            images: imageUrls,
            sideUnits: [] as ShoppingCartCompositionProduct[],
            otherProducts: {
                wallUnit: [] as ShoppingCartCompositionProduct[],
                tallUnit: [] as ShoppingCartCompositionProduct[],
                accessory: [] as ShoppingCartCompositionProduct[],
                mirror: [] as ShoppingCartCompositionProduct[],
                vanity: [] as ShoppingCartCompositionProduct[],
                washbasin: [] as ShoppingCartCompositionProduct[],
                sideUnit: [] as ShoppingCartCompositionProduct[],
            } as OtherItems,
            isDoubleSink,
            isDoubleSideUnit: false,
            grandTotal,
        };

        const allConfigs = {
            modelConfig: currentConfiguration,
            mirrorConfig: currentMirrorsConfiguration,
            extraItemsConfig: {
                currentProducts: getExtraItemsCurrentProductsAsArray(),
            }
        };

        generateShoppingCartCompositionProductObjs(allConfigs, shoppingCartObj, null, false, isDoubleSink);
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
                    <h1>{getConfigTitle(composition, currentConfiguration)}</h1>
                    <div className={classes.buttonsWrapper}>
                        <button
                            className={classes.resetButton}
                            onClick={() => {
                                if (!isValidConfiguration()) return;
                                handlePrint(
                                    getConfigTitle(composition,currentConfiguration),
                                    currentConfiguration.label,
                                    imageUrls,
                                    composition.compositionImage,
                                    currentConfiguration.currentProducts.concat(
                                        currentMirrorsConfiguration.currentProducts,
                                        getExtraItemsCurrentProductsAsArray()
                                    ),
                                    currentConfiguration.isDoubleSink,
                                    false,
                                    grandTotal,
                                )}
                            }
                        >
                            PRINT
                        </button>
                        <button
                            className={classes.resetButton}
                            onClick={handleResetConfigurator}
                        >
                            RESET
                        </button>
                    </div>
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
                        mirrorProductsConfigurator={
                            currentMirrorsConfiguration.currentProducts
                        }
                        extraItemsProducts={getExtraItemsCurrentProductsAsArray()}
                        isDoubleSink={currentConfiguration.isDoubleSink}
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
                    buttons={"next"}
                    accordionsOrder={accordionsOrder}
                    onNavigation={handleOrderedAccordion}
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
                    buttons={"next, clear and previous"}
                    accordionsOrder={accordionsOrder}
                    onNavigation={handleOrderedAccordion}
                    onClear={handleClearItem}
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
                        headerTitle="TALL UNIT"
                        item="tallUnit"
                        isOpen={accordionState.tallUnit}
                        onClick={handleAccordionState}
                        buttons={"next, clear and previous"}
                        accordionsOrder={accordionsOrder}
                        onNavigation={handleOrderedAccordion}
                        onClear={handleClearItem}
                    >
                        <MultiItemSelector
                            item={"tallUnit"}
                            initialOptions={tallUnitOptions as Option[]}
                            extraItems={extraItems}
                            handleAddExtraProduct={handleAddExtraProduct}
                            setCurrentDisplayItem={setCurrentDisplayItem}
                            removeConfiguration={removeConfiguration}
                        />
                        <Options
                            item="tallUnit"
                            property="type"
                            title="SELECT TALL UNIT"
                            options={extraItems.tallUnit.currentOptions}
                            crrOptionSelected={extraItems.tallUnit.currentConfig.tallUnitSku}
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
                        accordionsOrder={accordionsOrder}
                        handleSwitchCrrMirrorCategory={
                            handleSwitchCrrMirrorCategory
                        }
                        clearMirrorCategory={clearMirrorCategory}
                        handleOptionSelected={handleOptionSelected}
                        handleAccordionState={handleAccordionState}
                        handleOrderedAccordion={handleOrderedAccordion}
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
                        disabled={!grandTotal}
                        onClick={handleOrderNow}
                    >
                        ORDER NOW
                    </button>
                    <button
                        disabled={!grandTotal}
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
