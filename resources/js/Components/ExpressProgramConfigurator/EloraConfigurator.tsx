import { Composition } from "../../Models/Composition";
import classes from "../../../css/product-configurator.module.css";
import { useMemo, useReducer, useState } from "react";
import type {
    Option,
    OtherItems,
    ShoppingCartComposition,
    ShoppingCartCompositionProduct,    
} from "../../Models/ExpressProgramModels";
import Options from "./Options";
import ConfigurationName from "./ConfigurationName";
import { router } from "@inertiajs/react";
import {
    getSkuAndPrice,
    isAlphanumericWithSpaces,
    scrollToView,
} from "../../utils/helperFunc";
import { ProductInventory } from "../../Models/Product";
import {
    CurrentConfiguration,
    TallUnit,
    TallUnitOptions,
    Vanity,
    VanityOptions,
    WallUnit,
    WallUnitOptions,
} from "../../Models/EloraConfigTypes";
import { ItemFoxPro, Model } from "../../Models/ModelConfigTypes";
import ItemPropertiesAccordion from "./ItemPropertiesAccordion";
import useMirrorOptions from "../../Hooks/useMirrorOptions";
import { MirrorCategory } from "../../Models/MirrorConfigTypes";
import MirrorConfigurator from "./MirrorConfigurator";
import useAccordionState from "../../Hooks/useAccordionState";
import ConfigurationBreakdown from "./ConfigurationBreakdown";
import useImagesComposition from "../../Hooks/useImagesComposition";
import ImageSlider from "./ImageSlider";
import { generateShoppingCartCompositionProductObjs } from "../../utils/shoppingCartUtils";

/**
 * TODO;
 * 2. add other products options.
 */

interface EloraConfiguratorProps {
    composition: Composition;
    onAddToCart: (shoppingCartComposition: ShoppingCartComposition) => void;
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
        return all;
    }, []);

    // |===== WALL UNIT =====|
    const initialWallUnitOptions: WallUnitOptions | null = useMemo(() => {
        const { wallUnits } = composition.otherProductsAvailable;

        if (wallUnits.length === 0) return null;

        let baseSku: string = "";
        const mattFinishOptionsMap = new Map();
        const glassFinishOptionsMap = new Map();

        wallUnits.forEach((wallUnit) => {
            const codes = wallUnit.uscode.split("-");
            // the following logic is only for ELORA because each model has a different sku number order.
            // EX: 71-WU-012     -    M23  -   V23
            //     base-sku          matt    glass

            // only get base sku from first wallUnit.
            if (!baseSku) {
                baseSku = `${codes[0]}-${codes[1]}-${codes[2]}`;
            }

            let finishImageName = wallUnit.finish;
            let finishLabel = wallUnit.finish;

            if (wallUnit.finish.includes("/")) {
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
                .validSkus.push(wallUnit.uscode);

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
                .validSkus.push(wallUnit.uscode);
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

    const [wallUnitOptions, setWallUnitOptions] = useState(
        initialWallUnitOptions
    );

    const [wallUnitStatus, setWallUnitStatus] = useState({
        isWallUnitSelected: false,
        isWallUnitValid: false,
    });

    // |===== TALL UNIT =====|
    const initialTallUnitOptions: TallUnitOptions | null = useMemo(() => {
        const { tallUnitsLinenClosets } = composition.otherProductsAvailable;

        if (tallUnitsLinenClosets.length === 0) return null;

        let baseSku: string = "";
        const mattFinishOptionsMap = new Map();
        const glassFinishOptionsMap = new Map();

        tallUnitsLinenClosets.forEach((tallUnit) => {
            const codes = tallUnit.uscode.split("-");
            // the following logic is only for ELORA because each model has a different sku number order.
            // EX: 71-WU-012     -    M23  -   V23
            //     base-sku          matt    glass

            // only get base sku from first tallUnit.
            if (!baseSku) {
                baseSku = `${codes[0]}-${codes[1]}-${codes[2]}`;
            }

            let finishImageName = tallUnit.finish;
            let finishLabel = tallUnit.finish;

            if (tallUnit.finish.includes("/")) {
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
                .validSkus.push(tallUnit.uscode);

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
                .validSkus.push(tallUnit.uscode);
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

    const [tallUnitOptions, setTallUnitOptions] = useState(
        initialTallUnitOptions
    );

    const [tallUnitStatus, setTallUnitStatus] = useState({
        isTallUnitSelected: false,
        isTallUnitValid: false,
    });

    // |===== ACCESSORIES =====|
    const accessoryOptions: Option[] | null = useMemo(() => {
        const { accessories } = composition.otherProductsAvailable;
        if (accessories.length === 0) return null;

        const options: Option[] = [];
        accessories.forEach((accessory) => {
            options.push({
                code: accessory.uscode,
                imgUrl: `https://${location.hostname}/images/express-program/ELORA/${accessory.uscode}.webp`,
                title: accessory.descw,
                validSkus: [accessory.uscode],
                isDisabled: false,
            });
        });
        return options;
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

    // |===== ACCORDION =====|
    const { accordionState, handleAccordionState, handleOrderedAccordion } =
        useAccordionState();

    const accordionsOrder = useMemo(() => {
        let arr: string[] = ["vanity"];
        arr.push("washbasin");
        wallUnitOptions ? arr.push("wallUnit") : null;
        tallUnitOptions ? arr.push("tallUnit") : null;
        accessoryOptions ? arr.push("accessory") : null;
        composition.otherProductsAvailable.mirrors.length > 0
            ? arr.push("mirror")
            : null;

        return arr;
    }, []);

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

        const wallUnit: WallUnit | null = wallUnitOptions
            ? {
                  baseSku: wallUnitOptions.baseSku,
                  mattFinish: "",
                  glassFinish: "",
              }
            : null;

        const tallUnit: TallUnit | null = tallUnitOptions
            ? {
                  baseSku: tallUnitOptions.baseSku,
                  mattFinish: "",
                  glassFinish: "",
              }
            : null;

        return {
            label: "",
            vanity,
            vanitySku: vanitySkuAndPrice.sku,
            vanityPrice: vanitySkuAndPrice.price,
            washbasin: washbasinSkuAndPrice.sku,
            washbasinPrice: washbasinSkuAndPrice.price,
            isDoubleSink: composition.name.includes("DOUBLE"),
            wallUnit,
            wallUnitSku: "",
            wallUnitPrice: 0,
            tallUnit,
            tallUnitSku: "",
            tallUnitPrice: 0,
            accessory: "",
            accessoryPrice: 0,
            currentProducts,
        };
    }, []);

    const reducer = (
        state: CurrentConfiguration,
        action: { type: string; payload: string | number | ProductInventory[] }
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

            case "reset-vanity":
                return {
                    ...state,
                    vanity: {
                        ...(initialConfiguration.vanity as Vanity),
                    },
                    vanitySku: initialConfiguration.vanitySku,
                    vanityPrice: initialConfiguration.vanityPrice,
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

            case "set-wallUnit-mattFinish":
                return {
                    ...state,
                    wallUnit: {
                        ...state.wallUnit,
                        mattFinish: action.payload as string,
                    } as WallUnit,
                };

            case "set-wallUnit-glassFinish":
                return {
                    ...state,
                    wallUnit: {
                        ...state.wallUnit,
                        glassFinish: action.payload as string,
                    } as WallUnit,
                };

            case "set-wallUnit-sku":
                return {
                    ...state,
                    wallUnitSku: action.payload as string,
                };

            case "set-wallUnit-price":
                return {
                    ...state,
                    wallUnitPrice: action.payload as number,
                };

            case "reset-wallUnit":
                return {
                    ...state,
                    wallUnit: {
                        ...(initialConfiguration.wallUnit as WallUnit),
                    },
                    wallUnitSku: initialConfiguration.wallUnitSku,
                    wallUnitPrice: initialConfiguration.wallUnitPrice,
                };

            case "set-tallUnit-mattFinish":
                return {
                    ...state,
                    tallUnit: {
                        ...state.tallUnit,
                        mattFinish: action.payload as string,
                    } as TallUnit,
                };

            case "set-tallUnit-glassFinish":
                return {
                    ...state,
                    tallUnit: {
                        ...state.tallUnit,
                        glassFinish: action.payload as string,
                    } as TallUnit,
                };

            case "set-tallUnit-sku":
                return {
                    ...state,
                    tallUnitSku: action.payload as string,
                };

            case "set-tallUnit-price":
                return {
                    ...state,
                    tallUnitPrice: action.payload as number,
                };

            case "reset-tallUnit":
                return {
                    ...state,
                    tallUnit: {
                        ...(initialConfiguration.tallUnit as TallUnit),
                    },
                    tallUnitSku: initialConfiguration.tallUnitSku,
                    tallUnitPrice: initialConfiguration.tallUnitPrice,
                };

            case "set-accessory-type":
                return {
                    ...state,
                    accessory: action.payload as string,
                };

            case "set-accessory-price":
                return {
                    ...state,
                    accessoryPrice: action.payload as number,
                };

            case "reset-accessory":
                return {
                    ...state,
                    accessory: initialConfiguration.accessory,
                    accessoryPrice: initialConfiguration.accessoryPrice,
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

    // |===== GRAND TOTAL =====|
    const grandTotal = useMemo(() => {
        const {
            vanityPrice,
            washbasinPrice,
            isDoubleSink,
            wallUnitPrice,
            tallUnitPrice,
            accessoryPrice,
        } = currentConfiguration;

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
                wallUnitPrice +
                tallUnitPrice +
                mirrorCabinetPrice +
                ledMirrorPrice +
                openCompMirrorPrice +
                accessoryPrice;

            return grandTotal;
        }
    }, [currentConfiguration, currentMirrorsConfiguration]);

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

            const { sku, price, product } = getSkuAndPrice(
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

            if (product) {
                updateCurrentProducts("VANITY", "update", product);
            }
        }

        if (item === "washbasin") {
            const { sku, price, product } = getSkuAndPrice(
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

        if (item === "wallUnit") {
            const copyOptions = structuredClone(
                wallUnitOptions
            ) as WallUnitOptions;

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

            const wallUnitCurrentConfiguration = structuredClone(
                currentConfiguration.wallUnit
            ) as WallUnit;

            wallUnitCurrentConfiguration[
                property as keyof typeof wallUnitCurrentConfiguration
            ] = option;

            const { sku, price, product } = getSkuAndPrice(
                composition.model as Model,
                item,
                wallUnitCurrentConfiguration,
                composition.otherProductsAvailable.wallUnits
            );

            const { isWallUnitSelected } = wallUnitStatus;

            dispatch({ type: `set-${item}-sku`, payload: sku });
            dispatch({
                type: `set-${item}-price`,
                payload: price,
            });
            dispatch({ type: `set-${item}-${property}`, payload: `${option}` });
            setWallUnitOptions(copyOptions);

            setWallUnitStatus((prev) => ({
                ...prev,
                isWallUnitValid: price > 0,
            }));

            !isWallUnitSelected &&
                setWallUnitStatus((prev) => ({
                    ...prev,
                    isWallUnitSelected: true,
                }));

            if (product) {
                updateCurrentProducts("WALL UNIT", "update", product);
            }
        }

        if (item === "tallUnit") {
            const copyOptions = structuredClone(
                tallUnitOptions
            ) as TallUnitOptions;

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

            const tallUnitCurrentConfiguration = structuredClone(
                currentConfiguration.tallUnit
            ) as TallUnit;

            tallUnitCurrentConfiguration[
                property as keyof typeof tallUnitCurrentConfiguration
            ] = option;

            const { sku, price, product } = getSkuAndPrice(
                composition.model as Model,
                item,
                tallUnitCurrentConfiguration,
                composition.otherProductsAvailable.tallUnitsLinenClosets
            );

            const { isTallUnitSelected } = tallUnitStatus;

            dispatch({ type: `set-${item}-sku`, payload: sku });
            dispatch({
                type: `set-${item}-price`,
                payload: price,
            });
            dispatch({ type: `set-${item}-${property}`, payload: `${option}` });
            setTallUnitOptions(copyOptions);

            setTallUnitStatus((prev) => ({
                ...prev,
                isTallUnitValid: price > 0,
            }));
            !isTallUnitSelected &&
                setTallUnitStatus((prev) => ({
                    ...prev,
                    isTallUnitSelected: true,
                }));

            if (product) {
                updateCurrentProducts(
                    "TALL UNIT/LINEN CLOSET",
                    "update",
                    product
                );
            }
        }

        if (item === "accessory") {
            const { sku, price, product } = getSkuAndPrice(
                composition.model as Model,
                item,
                {},
                composition.otherProductsAvailable.accessories,
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
                updateCurrentProducts("ACCESSORY", "update", product);
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
            wallUnitStatus.isWallUnitSelected &&
            !wallUnitStatus.isWallUnitValid
        ) {
            alert(
                "Looks like you forgot to select all available WALL UNIT OPTIONS. Either clear the wall unit section or select the missing option(s). "
            );
            scrollToView("wallUnit");
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
            vanitySku,
            washbasin: washbasinSku,
            label,
            isDoubleSink,
            wallUnitSku,
            tallUnitSku,
            accessory: accessorySku,
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

        const wallUnitFormattedSku = wallUnitSku
            ? `${wallUnitSku}!!${composition.model}--1##${label}`
            : "";
        wallUnitFormattedSku && allFormattedSkus.push(wallUnitFormattedSku);

        const tallUnitFormattedSku = tallUnitSku
            ? `${tallUnitSku}!!${composition.model}--1##${label}`
            : "";
        tallUnitFormattedSku && allFormattedSkus.push(tallUnitFormattedSku);

        const accessoryFormattedSku = accessorySku
            ? `${accessorySku}!!${composition.model}--1##${label}`
            : "";
        accessoryFormattedSku && allFormattedSkus.push(accessoryFormattedSku);

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
        setTallUnitOptions(initialTallUnitOptions);
        setTallUnitStatus({
            isTallUnitSelected: false,
            isTallUnitValid: false,
        });
        setWallUnitOptions(initialWallUnitOptions);
        setWallUnitStatus({
            isWallUnitSelected: false,
            isWallUnitValid: false,
        });
        resetMirrorConfigurator();
        dispatch({ type: "reset-configurator", payload: "" });
        dispatch({
            type: `update-current-products`,
            payload: initialConfiguration.currentProducts,
        });
    };

    const handleClearItem = (item: string) => {
        switch (item) {
            case "vanity":
                updateCurrentProducts("VANITY", "remove");
                setVanityOptions(initialVanityOptions);
                dispatch({ type: "reset-vanity", payload: "" });
                break;

            case "washbasin":
                updateCurrentProducts("WASHBASIN/SINK", "remove");
                dispatch({ type: "reset-washbasin", payload: "" });
                break;

            case "wallUnit":
                updateCurrentProducts("WALL UNIT", "remove");
                setWallUnitOptions(initialWallUnitOptions);
                setWallUnitStatus({
                    isWallUnitSelected: false,
                    isWallUnitValid: false,
                });
                dispatch({ type: "reset-wallUnit", payload: "" });
                break;

            case "tallUnit":
                updateCurrentProducts("TALL UNIT/LINEN CLOSET", "remove");
                setTallUnitOptions(initialTallUnitOptions);
                setTallUnitStatus({
                    isTallUnitSelected: false,
                    isTallUnitValid: false,
                });
                dispatch({ type: "reset-tallUnit", payload: "" });
                break;

            case "accessory":
                updateCurrentProducts("ACCESSORY", "remove");
                dispatch({ type: "reset-accessory", payload: "" });
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
            } as OtherItems,
            isDoubleSink,
            isDoubleSideUnit: false,
            grandTotal,
        };

        const allConfigs = {
            modelConfig: currentConfiguration,
            mirrorConfig: currentMirrorsConfiguration,
        };

        generateShoppingCartCompositionProductObjs(allConfigs,shoppingCartObj,null,false,isDoubleSink);        
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
                    <div className={classes.buttonsWrapper}>
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
                    buttons={"next and clear"}
                    accordionsOrder={accordionsOrder}
                    onNavigation={handleOrderedAccordion}
                    onClear={handleClearItem}
                >
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

                {wallUnitOptions && (
                    <ItemPropertiesAccordion
                        headerTitle={`WALL UNIT 12X31`}
                        item="wallUnit"
                        isOpen={accordionState.wallUnit}
                        onClick={handleAccordionState}
                        buttons={"next, clear and previous"}
                        accordionsOrder={accordionsOrder}
                        onNavigation={handleOrderedAccordion}
                        onClear={handleClearItem}
                    >
                        <img
                            className="w-[40%] mx-auto mt-4"
                            src={`https://${location.hostname}/images/express-program/ELORA/wall-unit.webp`}
                            alt="image of wall unit"
                        />
                        <Options
                            item="wallUnit"
                            property="mattFinish"
                            title="SELECT MATT FINISH"
                            options={wallUnitOptions.mattFinishOptions}
                            crrOptionSelected={
                                currentConfiguration.wallUnit?.mattFinish!
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                        <Options
                            item="wallUnit"
                            property="glassFinish"
                            title="SELECT GLASS FINISH"
                            options={wallUnitOptions.glassFinishOptions}
                            crrOptionSelected={
                                currentConfiguration.wallUnit?.glassFinish!
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                    </ItemPropertiesAccordion>
                )}

                {tallUnitOptions && (
                    <ItemPropertiesAccordion
                        headerTitle={`TALL UNIT 12X63`}
                        item="tallUnit"
                        isOpen={accordionState.tallUnit}
                        onClick={handleAccordionState}
                        buttons={"next, clear and previous"}
                        accordionsOrder={accordionsOrder}
                        onNavigation={handleOrderedAccordion}
                        onClear={handleClearItem}
                    >
                        <img
                            className="w-[40%] mx-auto mt-4"
                            src={`https://${location.hostname}/images/express-program/ELORA/tall-unit.webp`}
                            alt="image of wall unit"
                        />
                        <Options
                            item="tallUnit"
                            property="mattFinish"
                            title="SELECT MATT FINISH"
                            options={tallUnitOptions.mattFinishOptions}
                            crrOptionSelected={
                                currentConfiguration.tallUnit?.mattFinish!
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                        <Options
                            item="tallUnit"
                            property="glassFinish"
                            title="SELECT GLASS FINISH"
                            options={tallUnitOptions.glassFinishOptions}
                            crrOptionSelected={
                                currentConfiguration.tallUnit?.glassFinish!
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                    </ItemPropertiesAccordion>
                )}

                {accessoryOptions && (
                    <ItemPropertiesAccordion
                        headerTitle="ACCESSORIES"
                        item="accessory"
                        isOpen={accordionState.accessory}
                        onClick={handleAccordionState}
                        buttons={"next, clear and previous"}
                        accordionsOrder={accordionsOrder}
                        onNavigation={handleOrderedAccordion}
                        onClear={handleClearItem}
                    >
                        <Options
                            item="accessory"
                            property="type"
                            title="SELECT ACCESSORY"
                            options={accessoryOptions}
                            crrOptionSelected={currentConfiguration.accessory}
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
