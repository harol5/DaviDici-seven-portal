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
    isAlphanumericWithSpaces,
    getSkuAndPrice,
    scrollToView,
} from "../../utils/helperFunc";
import { ProductInventory } from "../../Models/Product";
import {
    CurrentConfiguration,
    Vanity,
    SideUnit,
    VanityOptions,
    SideUnitOptions,
    WallUnitOptions,
    TallUnitOptions,
    WallUnit,
    TallUnit,
} from "../../Models/NewYorkConfigTypes";
import useMirrorOptions from "../../Hooks/useMirrorOptions";
import { MirrorCategory } from "../../Models/MirrorConfigTypes";
import ItemPropertiesAccordion from "./ItemPropertiesAccordion";
import { ItemFoxPro, Model } from "../../Models/ModelConfigTypes";
import MirrorConfigurator from "./MirrorConfigurator";
import useAccordionState from "../../Hooks/useAccordionState";
import ConfigurationBreakdown from "./ConfigurationBreakdown";
import useImagesComposition from "../../Hooks/useImagesComposition";
import ImageSlider from "./ImageSlider";

/**
 * TODO;
 * 2. add other products options.
 */

interface NewYorkConfiguratorProps {
    composition: Composition;
    onAddToCart: (shoppingCartProduct: shoppingCartProductModel) => void;
}

function NewYorkConfigurator({
    composition,
    onAddToCart,
}: NewYorkConfiguratorProps) {
    // |===== VANITY =====|
    const initialVanityOptions: VanityOptions = useMemo(() => {
        let baseSku: string = "";
        const handleOptionsMap = new Map();
        const finishOptionsMap = new Map();

        composition.vanities.forEach((vanity, index) => {
            const codes = vanity.uscode.split("-");
            // the following logic is only for NEW YORK because each model has a different sku number order.
            // EX: 65 - 036 -  VBB   -  BI
            //     base-sku   handle  finish

            // only get base sku from first vanity.
            if (index === 0) {
                baseSku = `${codes[0]}-${codes[1]}`;
            }

            if (!handleOptionsMap.has(`${codes[2]}`))
                handleOptionsMap.set(`${codes[2]}`, {
                    code: codes[2],
                    imgUrl: `https://portal.davidici.com/images/express-program/NEW YORK/options/${
                        codes[2] === "VBB" ? "BLACK HANDLE" : "CHROMED HANDLE"
                    }.webp`,
                    title:
                        codes[2] === "VBB" ? "BLACK HANDLE" : "CHROMED HANDLE",
                    validSkus: [],
                    isDisabled: false,
                });

            handleOptionsMap.get(`${codes[2]}`).validSkus.push(vanity.uscode);

            if (!finishOptionsMap.has(`${codes[3]}`))
                finishOptionsMap.set(`${codes[3]}`, {
                    code: codes[3],
                    imgUrl: `https://portal.davidici.com/images/express-program/finishes/${vanity.finish}.jpg`,
                    title: vanity.finish,
                    validSkus: [],
                    isDisabled: false,
                });

            finishOptionsMap.get(`${codes[3]}`).validSkus.push(vanity.uscode);
        });

        return {
            baseSku,
            handleOptions: Object.values(Object.fromEntries(handleOptionsMap)),
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

    // |===== SIDE UNIT =====|
    const initialSideUnitOptions: SideUnitOptions | null = useMemo(() => {
        if (composition.sideUnits.length === 0) return null;

        let baseSku: string = "";
        let position: string = "";
        const handleOptionsMap = new Map();
        const finishOptionsMap = new Map();

        composition.sideUnits.forEach((sideUnit, index) => {
            const codes = sideUnit.uscode.split("-");
            // the following logic is only for NEW YORK because each model has a different sku number order.
            // EX:   65 - 012  -  SCB   -    LX   -    BI
            //       base sku    handle   position   finish

            // only get base sku from first vanity.
            if (index === 0) {
                baseSku = `${codes[0]}-${codes[1]}`;
                position = `${codes[3]}`;
            }

            if (!handleOptionsMap.has(`${codes[2]}`)) {
                handleOptionsMap.set(`${codes[2]}`, {
                    code: codes[2],
                    imgUrl: `https://portal.davidici.com/images/express-program/NEW YORK/options/${
                        codes[2] === "SCB" ? "BLACK HANDLE" : "CHROMED HANDLE"
                    }.webp`,
                    title:
                        codes[2] === "SCB" ? "BLACK HANDLE" : "CHROMED HANDLE",
                    validSkus: [],
                    isDisabled: false,
                });
            }
            handleOptionsMap.get(`${codes[2]}`).validSkus.push(sideUnit.uscode);

            if (!finishOptionsMap.has(`${codes[4]}`))
                finishOptionsMap.set(`${codes[4]}`, {
                    code: codes[4],
                    imgUrl: `https://portal.davidici.com/images/express-program/finishes/${sideUnit.finish}.jpg`,
                    title: sideUnit.finish,
                    validSkus: [],
                    isDisabled: false,
                });

            finishOptionsMap.get(`${codes[4]}`).validSkus.push(sideUnit.uscode);
        });

        return {
            baseSku,
            handleOptions: Object.values(Object.fromEntries(handleOptionsMap)),
            position,
            finishOptions: Object.values(Object.fromEntries(finishOptionsMap)),
        };
    }, []);

    const [sideUnitOptions, setSideUnitOptions] = useState(
        initialSideUnitOptions
    );

    // |===== WALL UNIT =====|
    const initialWallUnitOptions: WallUnitOptions | null = useMemo(() => {
        const { wallUnits } = composition.otherProductsAvailable;

        if (wallUnits.length === 0) return null;

        let baseSku: string = "";
        const handleOptionsMap = new Map();
        const finishOptionsMap = new Map();

        wallUnits.forEach((wallUnit) => {
            // the following logic is only for NEW YORK because each model has a different sku number order.
            // EX:   65 - 012  -   WUB     -    BI
            //       base sku    handle      finish

            const codes = wallUnit.uscode.split("-");

            if (!baseSku) {
                baseSku = `${codes[0]}-${codes[1]}`;
            }

            if (!handleOptionsMap.has(`${codes[2]}`)) {
                handleOptionsMap.set(`${codes[2]}`, {
                    code: codes[2],
                    imgUrl: `https://portal.davidici.com/images/express-program/NEW YORK/options/${
                        codes[2] === "WUB" ? "BLACK HANDLE" : "CHROMED HANDLE"
                    }.webp`,
                    title:
                        codes[2] === "WUB" ? "BLACK HANDLE" : "CHROMED HANDLE",
                    validSkus: [],
                    isDisabled: false,
                });
            }
            handleOptionsMap.get(`${codes[2]}`).validSkus.push(wallUnit.uscode);

            if (!finishOptionsMap.has(`${codes[3]}`)) {
                finishOptionsMap.set(`${codes[3]}`, {
                    code: codes[3],
                    imgUrl: `https://portal.davidici.com/images/express-program/finishes/${wallUnit.finish}.jpg`,
                    title: wallUnit.finish,
                    validSkus: [],
                    isDisabled: false,
                });
            }
            finishOptionsMap.get(`${codes[3]}`).validSkus.push(wallUnit.uscode);
        });

        return {
            baseSku,
            handleOptions: Object.values(Object.fromEntries(handleOptionsMap)),
            finishOptions: Object.values(Object.fromEntries(finishOptionsMap)),
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
        const handleOptionsMap = new Map();
        const finishOptionsMap = new Map();

        tallUnitsLinenClosets.forEach((tallUnit) => {
            // the following logic is only for NEW YORK because each model has a different sku number order.
            // EX:   65 - 016  -   TUB     -    BI
            //       base sku    handle      finish

            const codes = tallUnit.uscode.split("-");

            if (!baseSku) {
                baseSku = `${codes[0]}-${codes[1]}`;
            }

            if (!handleOptionsMap.has(`${codes[2]}`)) {
                handleOptionsMap.set(`${codes[2]}`, {
                    code: codes[2],
                    imgUrl: `https://portal.davidici.com/images/express-program/NEW YORK/options/${
                        codes[2] === "TUB" ? "BLACK HANDLE" : "CHROMED HANDLE"
                    }.webp`,
                    title:
                        codes[2] === "TUB" ? "BLACK HANDLE" : "CHROMED HANDLE",
                    validSkus: [],
                    isDisabled: false,
                });
            }
            handleOptionsMap.get(`${codes[2]}`).validSkus.push(tallUnit.uscode);

            if (!finishOptionsMap.has(`${codes[3]}`)) {
                finishOptionsMap.set(`${codes[3]}`, {
                    code: codes[3],
                    imgUrl: `https://portal.davidici.com/images/express-program/finishes/${tallUnit.finish}.jpg`,
                    title: tallUnit.finish,
                    validSkus: [],
                    isDisabled: false,
                });
            }
            finishOptionsMap.get(`${codes[3]}`).validSkus.push(tallUnit.uscode);
        });

        return {
            baseSku,
            handleOptions: Object.values(Object.fromEntries(handleOptionsMap)),
            finishOptions: Object.values(Object.fromEntries(finishOptionsMap)),
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
                imgUrl: `https://${location.hostname}/images/express-program/NEW YORK/options/${accessory.uscode}.webp`,
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
        sideUnitOptions ? arr.push("sideUnit") : null;
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
            handle:
                vanityOptions.handleOptions.length === 1
                    ? vanityOptions.handleOptions[0].code
                    : "",
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

        const sideUnit: SideUnit | null = sideUnitOptions
            ? {
                  baseSku: sideUnitOptions.baseSku,
                  handle:
                      sideUnitOptions.handleOptions.length === 1
                          ? sideUnitOptions.handleOptions[0].code
                          : "",
                  position: sideUnitOptions.position,
                  finish:
                      sideUnitOptions.finishOptions.length === 1
                          ? sideUnitOptions.finishOptions[0].code
                          : "",
              }
            : null;

        let sideUnitSkuAndPrice =
            sideUnit &&
            getSkuAndPrice(
                composition.model as Model,
                "sideUnit",
                sideUnit,
                composition.vanities
            );

        const wallUnit: WallUnit | null = wallUnitOptions
            ? {
                  baseSku: wallUnitOptions.baseSku,
                  handle: "",
                  finish: "",
              }
            : null;

        const tallUnit: TallUnit | null = tallUnitOptions
            ? {
                  baseSku: tallUnitOptions.baseSku,
                  handle: "",
                  finish: "",
              }
            : null;

        const currentProducts: ProductInventory[] = [];
        vanitySkuAndPrice.product !== null &&
            currentProducts.push(vanitySkuAndPrice.product);
        washbasinSkuAndPrice.product !== null &&
            currentProducts.push(washbasinSkuAndPrice.product);
        if (sideUnitSkuAndPrice && sideUnitSkuAndPrice.product) {
            currentProducts.push(sideUnitSkuAndPrice.product);
        }

        return {
            label: "",
            vanity,
            vanitySku: vanitySkuAndPrice.sku,
            vanityPrice: vanitySkuAndPrice.price,
            isDoubleSink: composition.name.includes("DOUBLE"),
            isDoubleSideUnit: composition.name.includes("(12+24+12)"),
            sideUnit,
            sideUnitSku: sideUnitSkuAndPrice ? sideUnitSkuAndPrice.sku : "",
            sideUnitPrice: sideUnitSkuAndPrice ? sideUnitSkuAndPrice.price : 0,
            washbasin: washbasinSkuAndPrice.sku,
            washbasinPrice: washbasinSkuAndPrice.price,
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
            case "set-vanity-handle":
                return {
                    ...state,
                    vanity: {
                        ...state.vanity,
                        handle: action.payload as string,
                    },
                };

            case "set-vanity-finish":
                return {
                    ...state,
                    vanity: {
                        ...state.vanity,
                        finish: action.payload as string,
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

            case "reset-washbasin":
                return {
                    ...state,
                    washbasin: "",
                    washbasinPrice: 0,
                };

            case "set-sideUnit-handle":
                return {
                    ...state,
                    sideUnit: {
                        ...state.sideUnit,
                        handle: action.payload as string,
                    } as SideUnit,
                };

            case "set-sideUnit-finish":
                return {
                    ...state,
                    sideUnit: {
                        ...state.sideUnit,
                        finish: action.payload as string,
                    } as SideUnit,
                };

            case "set-sideUnit-sku":
                return {
                    ...state,
                    sideUnitSku: action.payload as string,
                };

            case "set-sideUnit-price":
                return {
                    ...state,
                    sideUnitPrice: action.payload as number,
                };

            case "set-wallUnit-handle":
                return {
                    ...state,
                    wallUnit: {
                        ...state.wallUnit,
                        handle: action.payload as string,
                    } as WallUnit,
                };

            case "set-wallUnit-finish":
                return {
                    ...state,
                    wallUnit: {
                        ...state.wallUnit,
                        finish: action.payload as string,
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

            case "set-tallUnit-handle":
                return {
                    ...state,
                    tallUnit: {
                        ...state.tallUnit,
                        handle: action.payload as string,
                    } as TallUnit,
                };

            case "set-tallUnit-finish":
                return {
                    ...state,
                    tallUnit: {
                        ...state.tallUnit,
                        finish: action.payload as string,
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
            isDoubleSideUnit,
            sideUnit,
            sideUnitPrice,
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

        if (vanityPrice === 0 || (sideUnit && sideUnitPrice === 0)) return 0;
        else {
            const finalVanityPrice = isDoubleSink
                ? vanityPrice * 2
                : vanityPrice;

            const finalSideUnitPrice = isDoubleSideUnit
                ? sideUnitPrice * 2
                : sideUnitPrice;

            const grandTotal =
                finalVanityPrice +
                washbasinPrice +
                finalSideUnitPrice +
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
        hasSideUnit: sideUnitOptions ? true : false,
        sideUnitSku: currentConfiguration.sideUnitSku,
        isDoubleSideUnit: currentConfiguration.isDoubleSideUnit,
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

            // Checks if any handle option should be disabled.
            for (const handleOption of copyOptions.handleOptions) {
                if (property === "handle") break;
                for (let i = 0; i < handleOption.validSkus.length; i++) {
                    const validSku = handleOption.validSkus[i];
                    if (validSku.includes(option)) {
                        handleOption.isDisabled = false;
                        break;
                    }

                    if (i === handleOption.validSkus.length - 1)
                        handleOption.isDisabled = true;
                }
            }

            // Checks if any finish option should be disabled.
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

        if (item === "sideUnit") {
            const copyOptions = structuredClone(
                sideUnitOptions
            ) as SideUnitOptions;

            // because this models dont have other option, this logic is useless but i lkept it for maybe future updates
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

            for (const handleOption of copyOptions.handleOptions) {
                if (property === "handle") break;
                for (let i = 0; i < handleOption.validSkus.length; i++) {
                    const validSku = handleOption.validSkus[i];
                    if (validSku.includes(option)) {
                        handleOption.isDisabled = false;
                        break;
                    }

                    if (i === handleOption.validSkus.length - 1)
                        handleOption.isDisabled = true;
                }
            }

            const sideUnitCurrentConfiguration = structuredClone(
                currentConfiguration.sideUnit
            ) as SideUnit;

            sideUnitCurrentConfiguration[
                property as keyof typeof sideUnitCurrentConfiguration
            ] = option;

            const { sku, price, product } = getSkuAndPrice(
                composition.model as Model,
                item,
                sideUnitCurrentConfiguration,
                composition.sideUnits
            );

            dispatch({ type: `set-${item}-sku`, payload: sku });
            dispatch({
                type: `set-${item}-price`,
                payload: price,
            });
            dispatch({ type: `set-${item}-${property}`, payload: `${option}` });
            setSideUnitOptions(copyOptions);

            if (product) {
                updateCurrentProducts("SIDE UNIT", "update", product);
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

            // Checks if any handle option should be disabled.
            for (const handleOption of copyOptions.handleOptions) {
                if (property === "handle") break;
                for (let i = 0; i < handleOption.validSkus.length; i++) {
                    const validSku = handleOption.validSkus[i];
                    if (validSku.includes(option)) {
                        handleOption.isDisabled = false;
                        break;
                    }

                    if (i === handleOption.validSkus.length - 1)
                        handleOption.isDisabled = true;
                }
            }

            // Checks if any finish option should be disabled.
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

            const wallUnitCurrentConfig = structuredClone(
                currentConfiguration.wallUnit
            ) as WallUnit;
            wallUnitCurrentConfig[
                property as keyof typeof wallUnitCurrentConfig
            ] = option;

            const { sku, price, product } = getSkuAndPrice(
                composition.model as Model,
                item,
                wallUnitCurrentConfig,
                composition.otherProductsAvailable.wallUnits
            );

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

            !wallUnitStatus.isWallUnitSelected &&
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

            // Checks if any handle option should be disabled.
            for (const handleOption of copyOptions.handleOptions) {
                if (property === "handle") break;
                for (let i = 0; i < handleOption.validSkus.length; i++) {
                    const validSku = handleOption.validSkus[i];
                    if (validSku.includes(option)) {
                        handleOption.isDisabled = false;
                        break;
                    }

                    if (i === handleOption.validSkus.length - 1)
                        handleOption.isDisabled = true;
                }
            }

            // Checks if any finish option should be disabled.
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

            const tallUnitCurrentConfig = structuredClone(
                currentConfiguration.tallUnit
            ) as TallUnit;

            tallUnitCurrentConfig[
                property as keyof typeof tallUnitCurrentConfig
            ] = option;

            const { sku, price, product } = getSkuAndPrice(
                composition.model as Model,
                item,
                tallUnitCurrentConfig,
                composition.otherProductsAvailable.tallUnitsLinenClosets
            );

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

            !tallUnitStatus.isTallUnitSelected &&
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
            sideUnit,
            sideUnitSku,
            washbasin: washbasinSku,
            wallUnitSku,
            tallUnitSku,
            accessory: accessorySku,
            label,
            isDoubleSink,
            isDoubleSideUnit,
        } = currentConfiguration;

        const getSecondSideUnit = () => {
            const rightSideUnitCodes = structuredClone(sideUnit);
            rightSideUnitCodes!.position = "RX";
            return `${Object.values(rightSideUnitCodes!).join("-")}!!${
                composition.model
            }--1##${label}`;
        };

        const allFormattedSkus: string[] = [];

        const vanityFormattedSku = `${vanitySku}!!${composition.model}${
            isDoubleSink ? "--2" : "--1"
        }##${label}`;
        allFormattedSkus.push(vanityFormattedSku);

        const sideUnitFormattedSku = sideUnitSku
            ? `${sideUnitSku}!!${composition.model}--1##${label}`
            : "";
        sideUnitFormattedSku && allFormattedSkus.push(sideUnitFormattedSku);

        const secondSideUnitFormattedSku = isDoubleSideUnit
            ? getSecondSideUnit()
            : "";
        secondSideUnitFormattedSku &&
            allFormattedSkus.push(secondSideUnitFormattedSku);

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
        setSideUnitOptions(initialSideUnitOptions);
        setWallUnitOptions(initialWallUnitOptions);
        setWallUnitStatus({
            isWallUnitSelected: false,
            isWallUnitValid: false,
        });
        setTallUnitOptions(initialTallUnitOptions);
        setTallUnitStatus({
            isTallUnitSelected: false,
            isTallUnitValid: false,
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
            vanitySku,
            sideUnit,
            sideUnitSku,
            washbasin: washbasinSku,
            wallUnitSku,
            tallUnitSku,
            accessory: accessorySku,
            label,
            isDoubleSink,
            isDoubleSideUnit,
        } = currentConfiguration;

        const otherProducts = {
            wallUnit: [] as ProductInventory[],
            tallUnit: [] as ProductInventory[],
            accessory: [] as ProductInventory[],
            mirror: [] as ProductInventory[],
        };

        const getSecondSideUnit = () => {
            const rightSideUnitCodes = structuredClone(sideUnit);
            rightSideUnitCodes!.position = "RX";
            return `${Object.values(rightSideUnitCodes!).join("-")}`;
        };

        const secondSideUnitSku = isDoubleSideUnit ? getSecondSideUnit() : "";

        const vanityObj = composition.vanities.find(
            (vanity) => vanity.uscode === vanitySku
        );

        const sideUnitsObj = composition.sideUnits.filter(
            (sideUnit) =>
                sideUnit.uscode === sideUnitSku ||
                sideUnit.uscode === secondSideUnitSku
        );

        const washbasinObj = composition.washbasins.find(
            (washbasin) => washbasin.uscode === washbasinSku
        );

        const wallUnitObj = composition.otherProductsAvailable.wallUnits.find(
            (wallUnit) => wallUnit.uscode === wallUnitSku
        );
        wallUnitObj && otherProducts.wallUnit.push(wallUnitObj);

        const tallUnitObj =
            composition.otherProductsAvailable.tallUnitsLinenClosets.find(
                (tallUnit) => tallUnit.uscode === tallUnitSku
            );
        tallUnitObj && otherProducts.tallUnit.push(tallUnitObj);

        const accessoryObj =
            composition.otherProductsAvailable.accessories.find(
                (accessory) => accessory.uscode === accessorySku
            );
        accessoryObj && otherProducts.accessory.push(accessoryObj);

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
            sideUnits: sideUnitsObj,
            washbasin: washbasinObj!,
            otherProducts,
            isDoubleSink,
            isDoubleSideunit: isDoubleSideUnit,
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
                        mirrorProductsConfigurator={
                            currentMirrorsConfiguration.currentProducts
                        }
                        isDoubleSink={currentConfiguration.isDoubleSink}
                        isDoubleSideUnit={currentConfiguration.isDoubleSideUnit}
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
                        title="SELECT FINISH"
                        options={vanityOptions.finishOptions}
                        crrOptionSelected={currentConfiguration.vanity.finish}
                        onOptionSelected={handleOptionSelected}
                    />
                    <Options
                        item="vanity"
                        property="handle"
                        title="SELECT HANDLES"
                        options={vanityOptions.handleOptions}
                        crrOptionSelected={currentConfiguration.vanity.handle}
                        onOptionSelected={handleOptionSelected}
                    />
                </ItemPropertiesAccordion>

                {sideUnitOptions && (
                    <ItemPropertiesAccordion
                        headerTitle="SIDE UNIT"
                        item="sideUnit"
                        isOpen={accordionState.sideUnit}
                        onClick={handleAccordionState}
                        buttons={"next and previous"}
                        accordionsOrder={accordionsOrder}
                        onNavigation={handleOrderedAccordion}
                    >
                        <Options
                            item="sideUnit"
                            property="handle"
                            title="SELECT HANDLE"
                            options={sideUnitOptions.handleOptions}
                            crrOptionSelected={
                                currentConfiguration.sideUnit?.handle!
                            }
                            onOptionSelected={handleOptionSelected}
                        />

                        <Options
                            item="sideUnit"
                            property="finish"
                            title="SELECT FINISH"
                            options={sideUnitOptions.finishOptions}
                            crrOptionSelected={
                                currentConfiguration.sideUnit?.finish!
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                    </ItemPropertiesAccordion>
                )}

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
                        headerTitle="WALL UNIT"
                        item="wallUnit"
                        isOpen={accordionState.wallUnit}
                        onClick={handleAccordionState}
                        buttons={"next, clear and previous"}
                        accordionsOrder={accordionsOrder}
                        onNavigation={handleOrderedAccordion}
                        onClear={handleClearItem}
                    >
                        <img
                            className="w-[40%] mx-auto mt-0"
                            src={`https://${location.hostname}/images/express-program/NEW YORK/options/wall-unit.webp`}
                            alt="image of wall unit"
                        />
                        <Options
                            item="wallUnit"
                            property="handle"
                            title="SELECT HANDLE"
                            options={wallUnitOptions?.handleOptions}
                            crrOptionSelected={
                                currentConfiguration.wallUnit?.handle!
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                        <Options
                            item="wallUnit"
                            property="finish"
                            title="SELECT FINISH"
                            options={wallUnitOptions?.finishOptions}
                            crrOptionSelected={
                                currentConfiguration.wallUnit?.finish!
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                    </ItemPropertiesAccordion>
                )}

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
                        <img
                            className="w-[25%] mx-auto mt-4"
                            src={`https://${location.hostname}/images/express-program/NEW YORK/options/tall-unit.webp`}
                            alt="image of tall unit"
                        />
                        <Options
                            item="tallUnit"
                            property="handle"
                            title="SELECT HANDLE"
                            options={tallUnitOptions?.handleOptions}
                            crrOptionSelected={
                                currentConfiguration.tallUnit?.handle!
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                        <Options
                            item="tallUnit"
                            property="finish"
                            title="SELECT FINISH"
                            options={tallUnitOptions?.finishOptions}
                            crrOptionSelected={
                                currentConfiguration.tallUnit?.finish!
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

export default NewYorkConfigurator;
