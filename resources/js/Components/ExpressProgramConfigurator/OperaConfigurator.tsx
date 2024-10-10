import { Composition } from "../../Models/Composition";
import classes from "../../../css/product-configurator.module.css";
import { useMemo, useReducer, useState } from "react";
import type {
    Option,
    ShoppingCartProduct as shoppingCartProductModel,
} from "../../Models/ExpressProgramModels";
import Options from "./Options";
import ConfigurationName from "./ConfigurationName";
import {
    getSkuAndPrice,
    isAlphanumericWithSpaces,
    scrollToView,
} from "../../utils/helperFunc";
import { ProductInventory } from "../../Models/Product";
import type {
    Vanity,
    VanityOptions,
    SideUnit,
    SideUnitOptions,
    WallUnit,
    WallUnitOptions,
    DrawerBase,
    DrawerBaseOptions,
    CurrentConfiguration,
} from "../../Models/OperaConfigTypes";
import useMirrorOptions from "../../Hooks/useMirrorOptions";
import { MirrorCategory } from "../../Models/MirrorConfigTypes";
import { ItemFoxPro, Model } from "../../Models/ModelConfigTypes";
import MirrorConfigurator from "./MirrorConfigurator";
import ItemPropertiesAccordion from "./ItemPropertiesAccordion";
import { router } from "@inertiajs/react";
import useAccordionState from "../../Hooks/useAccordionState";
import ConfigurationBreakdown from "./ConfigurationBreakdown";

interface OperaConfiguratorProps {
    composition: Composition;
    onAddToCart: (shoppingCartProduct: shoppingCartProductModel) => void;
}

function OperaConfigurator({
    composition,
    onAddToCart,
}: OperaConfiguratorProps) {
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

    // |===== SIDE UNIT =====|
    const initialSideUnitOptions: SideUnitOptions | null = useMemo(() => {
        if (composition.sideUnits.length === 0) return null;

        let baseSku: string = "";
        let size: string = "";
        const typeOptionsMap = new Map();
        const finishOptionsMap = new Map();

        composition.sideUnits.forEach((sideUnit, index) => {
            const codes = sideUnit.uscode.split("-");
            // the following logic is only for OPERA because each model has a different sku number order.
            // EX:      73    -   SO   -  012  -  M98
            //       base sku    type     size   finish

            // only get base sku from first vanity.
            if (index === 0) {
                baseSku = `${codes[0]}`;
                size = `${codes[2]}`;
            }

            if (!typeOptionsMap.has(`${codes[1]}`)) {
                const typeOfSideUnit =
                    codes[1] === "SO"
                        ? "SIDE OPEN CABINET"
                        : "SIDE BASE 1 DOOR CABINET";

                typeOptionsMap.set(`${codes[1]}`, {
                    code: codes[1],
                    imgUrl: `https://${location.hostname}/images/express-program/${composition.model}/options/${typeOfSideUnit}.webp`,
                    title: typeOfSideUnit,
                    validSkus: [],
                    isDisabled: false,
                });
            }
            typeOptionsMap.get(`${codes[1]}`).validSkus.push(sideUnit.uscode);

            if (!finishOptionsMap.has(`${codes[3]}`))
                finishOptionsMap.set(`${codes[3]}`, {
                    code: codes[3],
                    imgUrl: `https://portal.davidici.com/images/express-program/finishes/${sideUnit.finish}.jpg`,
                    title: sideUnit.finish,
                    validSkus: [],
                    isDisabled: false,
                });

            finishOptionsMap.get(`${codes[3]}`).validSkus.push(sideUnit.uscode);
        });

        return {
            baseSku,
            typeOptions: Object.values(Object.fromEntries(typeOptionsMap)),
            size,
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
        const typeOptionsMap = new Map<string, Option>();
        const sizeOptionsMap = new Map<string, Option>();
        const finishOptionsMap = new Map<string, Option>();

        wallUnits.forEach((wallUnit) => {
            // the following logic is only for OPERA because each model has a different sku number order.
            // EX:    73    -  WU  -  012  -  M54
            //     base sku    type   size    finish
            const codes = wallUnit.uscode.split("-");

            if (!baseSku) baseSku = codes[0];

            if (!typeOptionsMap.has(codes[1])) {
                const title = codes[1] === "WU" ? "REGULAR" : "OPEN SHELVES";
                typeOptionsMap.set(codes[1], {
                    code: codes[1],
                    imgUrl: `https://${location.hostname}/images/express-program/OPERA/options/wall-unit-${title}.webp`,
                    title,
                    validSkus: [],
                    isDisabled: false,
                });
            }
            typeOptionsMap.get(codes[1])?.validSkus.push(wallUnit.uscode);

            if (!sizeOptionsMap.has(codes[2])) {
                sizeOptionsMap.set(codes[2], {
                    code: codes[2],
                    imgUrl: `https://${location.hostname}/images/express-program/OPERA/options/wall-unit-${codes[2]}.webp`,
                    title: codes[2],
                    validSkus: [],
                    isDisabled: false,
                });
            }
            sizeOptionsMap.get(codes[2])?.validSkus.push(wallUnit.uscode);

            if (!finishOptionsMap.has(codes[3])) {
                finishOptionsMap.set(codes[3], {
                    code: codes[3],
                    imgUrl: `https://${location.hostname}/images/express-program/finishes/${wallUnit.finish}.jpg`,
                    title: wallUnit.finish,
                    validSkus: [],
                    isDisabled: false,
                });
            }
            finishOptionsMap.get(codes[3])?.validSkus.push(wallUnit.uscode);
        });

        return {
            baseSku,
            typeOptions: Object.values(Object.fromEntries(typeOptionsMap)),
            sizeOptions: Object.values(Object.fromEntries(sizeOptionsMap)),
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
    const tallUnitOptions: Option[] | null = useMemo(() => {
        const all: Option[] = [];
        const { tallUnitsLinenClosets } = composition.otherProductsAvailable;
        if (tallUnitsLinenClosets.length === 0) return null;

        tallUnitsLinenClosets.forEach((tallUnit) => {
            all.push({
                code: tallUnit.uscode,
                imgUrl: `https://${location.hostname}/images/express-program/OPERA/options/${tallUnit.uscode}.webp`,
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

    // |===== DRAWER BASE =====|
    const initialDrawerBaseOptions: DrawerBaseOptions | null = useMemo(() => {
        const { drawersVanities } = composition.otherProductsAvailable;
        if (drawersVanities.length === 0) return null;

        let baseSku: string = "";
        let type: string = "";
        const sizeOptionsMap = new Map<string, Option>();
        const finishOptionsMap = new Map<string, Option>();

        drawersVanities.forEach((drawerBase) => {
            const codes = drawerBase.uscode.split("-");
            // the following logic is only for OPERA because each model has a different sku number order.
            // EX:   73    -     VD     -   036   -  M51
            //    base sku      type        size   finish

            if (!baseSku) baseSku = codes[0];
            if (!type) type = codes[1];

            if (!sizeOptionsMap.has(codes[2])) {
                sizeOptionsMap.set(codes[2], {
                    code: codes[2],
                    imgUrl: `https://${location.hostname}/images/express-program/OPERA/options/${drawerBase.size}.webp`,
                    title: `${drawerBase.size}`,
                    validSkus: [],
                    isDisabled: false,
                });
            }
            sizeOptionsMap.get(codes[2])?.validSkus.push(drawerBase.uscode);

            if (!finishOptionsMap.has(codes[3]))
                finishOptionsMap.set(codes[3], {
                    code: codes[3],
                    imgUrl: `https://portal.davidici.com/images/express-program/finishes/${drawerBase.finish}.jpg`,
                    title: drawerBase.finish,
                    validSkus: [],
                    isDisabled: false,
                });
            finishOptionsMap.get(codes[3])?.validSkus.push(drawerBase.uscode);
        });

        return {
            baseSku,
            type,
            sizeOptions: Object.values(Object.fromEntries(sizeOptionsMap)),
            finishOptions: Object.values(Object.fromEntries(finishOptionsMap)),
        };
    }, []);

    const [drawerBaseOptions, setDrawerBaseOptions] = useState(
        initialDrawerBaseOptions
    );

    const [drawerBaseStatus, setDrawerBaseStatus] = useState({
        isDrawerBaseSelected: false,
        isDrawerBaseValid: false,
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

        const sideUnit: SideUnit | null = sideUnitOptions
            ? {
                  baseSku: sideUnitOptions.baseSku,
                  type:
                      sideUnitOptions.typeOptions.length === 1
                          ? sideUnitOptions.typeOptions[0].code
                          : "",
                  size: sideUnitOptions.size,
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

        const drawerBase: DrawerBase | null = drawerBaseOptions
            ? {
                  baseSku: drawerBaseOptions.baseSku,
                  type: drawerBaseOptions.type,
                  size: "",
                  finish: "",
              }
            : null;

        const wallUnit: WallUnit | null = wallUnitOptions
            ? {
                  baseSku: wallUnitOptions.baseSku,
                  type: "",
                  size: "",
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
            washbasin: washbasinSkuAndPrice.sku,
            washbasinPrice: washbasinSkuAndPrice.price,
            isDoubleSink: composition.name.includes("DOUBLE"),
            sideUnit,
            sideUnitSku: sideUnitSkuAndPrice ? sideUnitSkuAndPrice.sku : "",
            sideUnitPrice: sideUnitSkuAndPrice ? sideUnitSkuAndPrice.price : 0,
            isDoubleSideUnit: composition.name.includes("(12+24+12)"),
            wallUnit,
            wallUnitSku: "",
            wallUnitPrice: 0,
            tallUnit: "",
            tallUnitPrice: 0,
            drawerBase,
            drawerBaseSku: "",
            drawerBasePrice: 0,
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

            case "set-sideUnit-type":
                return {
                    ...state,
                    sideUnit: {
                        ...state.sideUnit,
                        type: action.payload,
                    } as SideUnit,
                };

            case "set-sideUnit-finish":
                return {
                    ...state,
                    sideUnit: {
                        ...state.sideUnit,
                        finish: action.payload,
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

            case "set-wallUnit-type":
                return {
                    ...state,
                    wallUnit: {
                        ...state.wallUnit,
                        type: action.payload,
                    } as WallUnit,
                };

            case "set-wallUnit-size":
                return {
                    ...state,
                    wallUnit: {
                        ...state.wallUnit,
                        size: action.payload,
                    } as WallUnit,
                };

            case "set-wallUnit-finish":
                return {
                    ...state,
                    wallUnit: {
                        ...state.wallUnit,
                        finish: action.payload,
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
                    wallUnitSku: initialConfiguration.wallUnitSku as string,
                    wallUnitPrice: initialConfiguration.wallUnitPrice as number,
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

            case "set-drawerBase-size":
                return {
                    ...state,
                    drawerBase: {
                        ...state.drawerBase,
                        size: action.payload,
                    } as DrawerBase,
                };

            case "set-drawerBase-finish":
                return {
                    ...state,
                    drawerBase: {
                        ...state.drawerBase,
                        finish: action.payload,
                    } as DrawerBase,
                };

            case "set-drawerBase-sku":
                return {
                    ...state,
                    drawerBaseSku: action.payload as string,
                };

            case "set-drawerBase-price":
                return {
                    ...state,
                    drawerBasePrice: action.payload as number,
                };

            case "reset-drawerBase":
                return {
                    ...state,
                    drawerBase: {
                        ...(initialConfiguration.drawerBase as DrawerBase),
                    },
                    drawerBaseSku: initialConfiguration.drawerBaseSku as string,
                    drawerBasePrice:
                        initialConfiguration.drawerBasePrice as number,
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
            drawerBasePrice,
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
                drawerBasePrice;

            return grandTotal;
        }
    }, [currentConfiguration, currentMirrorsConfiguration]);

    // |===== COMPOSITION NAME =====| (repeated logic)
    const [isMissingLabel, setIsMissingLabel] = useState(false);
    const [isInvalidLabel, setIsInvalidLabel] = useState(false);

    // |===== ACCORDION =====|
    const { accordionState, handleAccordionState, handleOrderedAccordion } =
        useAccordionState();

    const accordionsOrder = useMemo(() => {
        let arr: string[] = ["vanity"];
        sideUnitOptions ? arr.push("sideUnit") : null;
        arr.push("washbasin");
        wallUnitOptions ? arr.push("wallUnit") : null;
        tallUnitOptions ? arr.push("tallUnit") : null;
        composition.otherProductsAvailable.mirrors.length > 0
            ? arr.push("mirror")
            : null;

        return arr;
    }, []);

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

            for (const typeOption of copyOptions.typeOptions) {
                if (property === "type") break;
                for (let i = 0; i < typeOption.validSkus.length; i++) {
                    const validSku = typeOption.validSkus[i];
                    if (validSku.includes(option)) {
                        typeOption.isDisabled = false;
                        break;
                    }

                    if (i === typeOption.validSkus.length - 1)
                        typeOption.isDisabled = true;
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

            for (const typeOption of copyOptions.typeOptions) {
                if (property === "type") break;
                for (let i = 0; i < typeOption.validSkus.length; i++) {
                    const validSku = typeOption.validSkus[i];
                    if (validSku.includes(option)) {
                        typeOption.isDisabled = false;
                        break;
                    }

                    if (i === typeOption.validSkus.length - 1)
                        typeOption.isDisabled = true;
                }
            }

            for (const sizeOption of copyOptions.sizeOptions) {
                if (property === "size") break;
                for (let i = 0; i < sizeOption.validSkus.length; i++) {
                    const validSku = sizeOption.validSkus[i];
                    if (validSku.includes(option)) {
                        sizeOption.isDisabled = false;
                        break;
                    }

                    if (i === sizeOption.validSkus.length - 1)
                        sizeOption.isDisabled = true;
                }
            }

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
            const { sku, price, product } = getSkuAndPrice(
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

            if (product) {
                updateCurrentProducts(
                    "TALL UNIT/LINEN CLOSET",
                    "update",
                    product
                );
            }
        }

        if (item === "drawerBase") {
            const copyOptions = structuredClone(
                drawerBaseOptions
            ) as DrawerBaseOptions;

            for (const sizeOption of copyOptions.sizeOptions) {
                if (property === "size") break;
                for (let i = 0; i < sizeOption.validSkus.length; i++) {
                    const validSku = sizeOption.validSkus[i];
                    if (validSku.includes(option)) {
                        sizeOption.isDisabled = false;
                        break;
                    }

                    if (i === sizeOption.validSkus.length - 1)
                        sizeOption.isDisabled = true;
                }
            }

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

            const drawerBaseCurrentConfiguration = structuredClone(
                currentConfiguration.drawerBase
            ) as DrawerBase;

            drawerBaseCurrentConfiguration[
                property as keyof typeof drawerBaseCurrentConfiguration
            ] = option;

            const { sku, price, product } = getSkuAndPrice(
                composition.model as Model,
                item,
                drawerBaseCurrentConfiguration,
                composition.otherProductsAvailable.drawersVanities
            );

            dispatch({ type: `set-${item}-sku`, payload: sku });
            dispatch({
                type: `set-${item}-price`,
                payload: price,
            });
            dispatch({ type: `set-${item}-${property}`, payload: `${option}` });
            setDrawerBaseOptions(copyOptions);

            setDrawerBaseStatus((prev) => ({
                ...prev,
                isDrawerBaseValid: price > 0,
            }));

            !drawerBaseStatus.isDrawerBaseSelected &&
                setDrawerBaseStatus((prev) => ({
                    ...prev,
                    isDrawerBaseSelected: true,
                }));

            if (product) {
                updateCurrentProducts("DRAWER/VANITY", "update", product);
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
            drawerBaseStatus.isDrawerBaseSelected &&
            !drawerBaseStatus.isDrawerBaseValid
        ) {
            alert(
                "Looks like you forgot to select all available DRAWER BASE OPTIONS. Either clear the tal unit section or select the missing option(s)."
            );
            scrollToView("drawerBase");
            return false;
        }

        if (
            tallUnitStatus.isTallUnitSelected &&
            !tallUnitStatus.isTallUnitValid
        ) {
            alert(
                "Looks like you forgot to select all available TALL UNIT OPTIONS. Either clear the tal unit section or select the missing option(s)."
            );
            scrollToView("tallUnit");
            return false;
        }

        if (!isMirrorCabinetConfigValid()) {
            alert(
                "Looks like you forgot to select all available MIRROR CABINET OPTIONS. Either clear the mirror cabinet section or select the missing option(s)."
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
            sideUnitSku,
            washbasin: washbasinSku,
            wallUnitSku,
            tallUnit: tallUnitSku,
            drawerBaseSku,
            label,
            isDoubleSink,
            isDoubleSideUnit,
        } = currentConfiguration;

        const allFormattedSkus: string[] = [];

        const vanityFormattedSku = `${vanitySku}!!${composition.model}--${
            isDoubleSink ? "2" : "1"
        }##${label}`;
        allFormattedSkus.push(vanityFormattedSku);

        const sideUnitFormattedSku = sideUnitSku
            ? `${sideUnitSku}!!${composition.model}--${
                  isDoubleSideUnit ? "2" : "1"
              }##${label}`
            : "";
        sideUnitFormattedSku && allFormattedSkus.push(sideUnitFormattedSku);

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

        const drawerBaseFormattedSku = drawerBaseSku
            ? `${drawerBaseSku}!!${composition.model}--1##${label}`
            : "";
        drawerBaseFormattedSku && allFormattedSkus.push(drawerBaseFormattedSku);

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
        setTallUnitStatus({
            isTallUnitSelected: false,
            isTallUnitValid: false,
        });
        setDrawerBaseOptions(initialDrawerBaseOptions);
        setDrawerBaseStatus({
            isDrawerBaseSelected: false,
            isDrawerBaseValid: false,
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
                setTallUnitStatus({
                    isTallUnitSelected: false,
                    isTallUnitValid: false,
                });
                dispatch({ type: "reset-tallUnit", payload: "" });
                break;

            case "drawerBase":
                updateCurrentProducts("DRAWER/VANITY", "remove");
                setDrawerBaseOptions(initialDrawerBaseOptions);
                setDrawerBaseStatus({
                    isDrawerBaseSelected: false,
                    isDrawerBaseValid: false,
                });
                dispatch({ type: "reset-drawerBase", payload: "" });
                break;

            default:
                throw new Error("case condition not found");
        }
    };

    const handleAddToCart = () => {
        if (!isValidConfiguration()) return;

        const {
            vanitySku,
            sideUnitSku,
            washbasin: washbasinSku,
            tallUnit: tallUnitSku,
            label,
            isDoubleSink,
            isDoubleSideUnit,
            drawerBaseSku,
            wallUnitSku,
        } = currentConfiguration;

        const otherProducts = {
            wallUnit: [] as ProductInventory[],
            tallUnit: [] as ProductInventory[],
            accessory: [] as ProductInventory[],
            drawerBase: [] as ProductInventory[],
            mirror: [] as ProductInventory[],
        };

        const vanityObj = composition.vanities.find(
            (vanity) => vanity.uscode === vanitySku
        );

        const sideUnitsObj = composition.sideUnits.filter(
            (sideUnit) => sideUnit.uscode === sideUnitSku
        );

        const washbasinObj = composition.washbasins.find(
            (washbasin) => washbasin.uscode === washbasinSku
        );

        const drawerBaseObj =
            composition.otherProductsAvailable.drawersVanities.find(
                (drawerBase) => {
                    drawerBase.uscode === drawerBaseSku;
                }
            );
        drawerBaseObj && otherProducts.drawerBase.push(drawerBaseObj);

        const wallUnitObj = composition.otherProductsAvailable.wallUnits.find(
            (wallUnit) => wallUnit.uscode === wallUnitSku
        );
        wallUnitObj && otherProducts.wallUnit.push(wallUnitObj);

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
            label: label,
            vanity: vanityObj!,
            sideUnits: sideUnitsObj,
            washbasin: washbasinObj!,
            otherProducts,
            isDoubleSink: isDoubleSink,
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
                            property="type"
                            title="SELECT TYPE"
                            options={sideUnitOptions.typeOptions}
                            crrOptionSelected={
                                currentConfiguration.sideUnit?.type as string
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                        <Options
                            item="sideUnit"
                            property="finish"
                            title="SELECT FINISH"
                            options={sideUnitOptions.finishOptions}
                            crrOptionSelected={
                                currentConfiguration.sideUnit?.finish as string
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
                        <Options
                            item="wallUnit"
                            property="type"
                            title="SELECT TYPE"
                            options={wallUnitOptions.typeOptions}
                            crrOptionSelected={
                                currentConfiguration.wallUnit?.type!
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                        <Options
                            item="wallUnit"
                            property="size"
                            title="SELECT SIZE"
                            options={wallUnitOptions.sizeOptions}
                            crrOptionSelected={
                                currentConfiguration.wallUnit?.size!
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                        <Options
                            item="wallUnit"
                            property="finish"
                            title="SELECT FINISH"
                            options={wallUnitOptions.finishOptions}
                            crrOptionSelected={
                                currentConfiguration.wallUnit?.finish!
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                    </ItemPropertiesAccordion>
                )}

                {tallUnitOptions && (
                    <ItemPropertiesAccordion
                        headerTitle="TALL UNIT 12X63"
                        item="tallUnit"
                        isOpen={accordionState.tallUnit}
                        onClick={handleAccordionState}
                        buttons={"next, clear and previous"}
                        accordionsOrder={accordionsOrder}
                        onNavigation={handleOrderedAccordion}
                        onClear={handleClearItem}
                    >
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

                {drawerBaseOptions && (
                    <ItemPropertiesAccordion
                        headerTitle="DRAWER BASE"
                        item="drawerBase"
                        isOpen={accordionState.drawerBase}
                        onClick={handleAccordionState}
                        buttons={"next, clear and previous"}
                        accordionsOrder={accordionsOrder}
                        onNavigation={handleOrderedAccordion}
                        onClear={handleClearItem}
                    >
                        <Options
                            item="drawerBase"
                            property="size"
                            title="SELECT SIZE"
                            options={drawerBaseOptions.sizeOptions}
                            crrOptionSelected={
                                currentConfiguration.wallUnit?.size!
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                        <Options
                            item="drawerBase"
                            property="finish"
                            title="SELECT FINISH"
                            options={drawerBaseOptions.finishOptions}
                            crrOptionSelected={
                                currentConfiguration.wallUnit?.finish!
                            }
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

export default OperaConfigurator;
