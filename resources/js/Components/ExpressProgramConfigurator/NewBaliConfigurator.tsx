import { Composition } from "../../Models/Composition";
import classes from "../../../css/product-configurator.module.css";
import { useMemo, useReducer, useState } from "react";
import type {
    Option,
    OtherItems,
    ShoppingCartComposition,
    ShoppingCartCompositionProduct
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
    CurrentConfiguration,
    Vanity,
    VanityOptions,
    SideUnit,
    SideUnitOptions,
    DrawerBase,
    DrawerBaseOptions,
    WallUnit,
    WallUnitOptions,
} from "../../Models/NewBaliConfigTypes";
import { ItemFoxPro, Model } from "../../Models/ModelConfigTypes";
import ItemPropertiesAccordion from "./ItemPropertiesAccordion";
import useMirrorOptions from "../../Hooks/useMirrorOptions";
import { MirrorCategory } from "../../Models/MirrorConfigTypes";
import MirrorConfigurator from "./MirrorConfigurator";
import { router } from "@inertiajs/react";
import useAccordionState from "../../Hooks/useAccordionState";
import ConfigurationBreakdown from "./ConfigurationBreakdown";
import useImagesComposition from "../../Hooks/useImagesComposition";
import ImageSlider from "./ImageSlider";
import { generateShoppingCartCompositionProductObjs } from "../../utils/shoppingCartUtils";

interface NewBaliConfiguratorProps {
    composition: Composition;
    onAddToCart: (shoppingCartComposition: ShoppingCartComposition) => void;
}

function NewBaliConfigurator({
    composition,
    onAddToCart,
}: NewBaliConfiguratorProps) {
    // |===== VANITY =====|
    const initialVanityOptions: VanityOptions = useMemo(() => {
        let baseSku: string = "";
        const drawerOptionsMap = new Map();
        const vanityBaseOptionsMap = new Map();
        const finishOptionsMap = new Map();

        composition.vanities.forEach((vanity, index) => {
            const codes = vanity.uscode.split("-");
            // the following logic is only for new bali because each model has a different sku number order.
            // EX:   63   -   024D  -    VB   -    BI
            //    base sku  drawers  vanity base  finish

            // only get base sku from first vanity.
            if (index === 0) {
                baseSku = `${codes[0]}`;
            }

            if (!drawerOptionsMap.has(`${codes[1]}`)) {
                const numOfDrawers = codes[1].includes("D")
                    ? "2 DRAWERS"
                    : "1 DRAWER";

                drawerOptionsMap.set(`${codes[1]}`, {
                    code: codes[1],
                    imgUrl: `https://${location.hostname}/images/express-program/${composition.model}/options/${numOfDrawers}.webp`,
                    title: numOfDrawers,
                    validSkus: [],
                    isDisabled: false,
                });
            }

            drawerOptionsMap.get(`${codes[1]}`).validSkus.push(vanity.uscode);

            if (!vanityBaseOptionsMap.has(`${codes[2]}`))
                vanityBaseOptionsMap.set(`${codes[2]}`, {
                    code: codes[2],
                    imgUrl: "https://portal.davidici.com/images/express-program/not-image.jpg",
                    title: "VANITY BASE",
                    validSkus: [],
                    isDisabled: false,
                });

            vanityBaseOptionsMap
                .get(`${codes[2]}`)
                .validSkus.push(vanity.uscode);

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
            drawerOptions: Object.values(Object.fromEntries(drawerOptionsMap)),
            vanityBaseOptions: Object.values(
                Object.fromEntries(vanityBaseOptionsMap)
            ),
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
    const sideUnitOptions: SideUnitOptions | null = useMemo(() => {
        if (composition.sideUnits.length === 0) return null;

        let baseSku: string = "";
        const finishOptionsMap = new Map();

        composition.sideUnits.forEach((sideUnit, index) => {
            const codes = sideUnit.uscode.split("-");
            // the following logic is only for margi because each model has a different sku number order.
            // EX:      73    -   SO   -  012  -  M98
            //       base sku    type     size   finish

            // only get base sku from first vanity.
            if (index === 0) {
                baseSku = `${codes[0]}-${codes[1]}-${codes[2]}`;
            }

            if (!finishOptionsMap.has(`${codes[3]}`))
                finishOptionsMap.set(`${codes[3]}`, {
                    code: codes[3],
                    imgUrl: `https://${location.hostname}/images/express-program/finishes/${sideUnit.finish}.jpg`,
                    title: sideUnit.finish,
                    validSkus: [],
                    isDisabled: false,
                });

            finishOptionsMap.get(`${codes[3]}`).validSkus.push(sideUnit.uscode);
        });

        return {
            baseSku,
            finishOptions: Object.values(Object.fromEntries(finishOptionsMap)),
        };
    }, []);

    // |===== DRAWER BASE =====|
    const initialDrawerBaseOptions: DrawerBaseOptions | null = useMemo(() => {
        const { drawersVanities } = composition.otherProductsAvailable;
        if (drawersVanities.length === 0) return null;

        let baseSku: string = "";
        const drawerOptionsMap = new Map();
        let staticVanityDrawerCode: string = "";
        const finishOptionsMap = new Map();

        drawersVanities.forEach((drawerBase) => {
            const codes = drawerBase.uscode.split("-");
            // the following logic is only for NEW BALI because each model has a different sku number order.
            // EX:   63    -     032D     -   VD   -  M51
            //    base sku   size/#-drawer   type   finish

            if (!baseSku) baseSku = `${codes[0]}`;

            if (!drawerOptionsMap.has(`${codes[1]}`)) {
                const numOfDrawers = codes[1].includes("D")
                    ? "2 DRAWERS"
                    : "1 DRAWER";

                drawerOptionsMap.set(`${codes[1]}`, {
                    code: codes[1],
                    imgUrl: `https://${location.hostname}/images/express-program/${composition.model}/options/${numOfDrawers}.webp`,
                    title: `${drawerBase.size}" ${numOfDrawers}`,
                    validSkus: [],
                    isDisabled: false,
                });
            }
            drawerOptionsMap
                .get(`${codes[1]}`)
                .validSkus.push(drawerBase.uscode);

            if (!staticVanityDrawerCode) staticVanityDrawerCode = `${codes[2]}`;

            if (!finishOptionsMap.has(`${codes[3]}`))
                finishOptionsMap.set(`${codes[3]}`, {
                    code: codes[3],
                    imgUrl: `https://portal.davidici.com/images/express-program/finishes/${drawerBase.finish}.jpg`,
                    title: drawerBase.finish,
                    validSkus: [],
                    isDisabled: false,
                });

            finishOptionsMap
                .get(`${codes[3]}`)
                .validSkus.push(drawerBase.uscode);
        });

        return {
            baseSku,
            drawerOptions: Object.values(Object.fromEntries(drawerOptionsMap)),
            staticVanityDrawerCode,
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

    // |===== WALL UNIT =====|
    const initialWallUnitOptions: WallUnitOptions | null = useMemo(() => {
        const { wallUnits } = composition.otherProductsAvailable;
        if (wallUnits.length === 0) return null;

        let baseSku: string = "";
        const sizeOptionsMap = new Map<string, Option>();
        const typeOptionsMap = new Map<string, Option>();
        const finishOptionsMap = new Map<string, Option>();

        wallUnits.forEach((wallUnit) => {
            // the following logic is only for NEW YORK because each model has a different sku number order.
            // EX:    63    -  036  -  WU  -  M51
            //     base sku    size   type   finish
            const codes = wallUnit.uscode.split("-");

            if (!baseSku) baseSku = codes[0];

            if (!sizeOptionsMap.has(codes[1])) {
                sizeOptionsMap.set(codes[1], {
                    code: codes[1],
                    imgUrl: `https://${location.hostname}/images/express-program/NEW BALI/options/${codes[1]}.webp`,
                    title: codes[1],
                    validSkus: [],
                    isDisabled: false,
                });
            }
            sizeOptionsMap.get(codes[1])?.validSkus.push(wallUnit.uscode);

            if (!typeOptionsMap.has(codes[2])) {
                const title = codes[2] === "WU" ? "REGULAR" : "OPEN SHELVES";
                typeOptionsMap.set(codes[2], {
                    code: codes[2],
                    imgUrl: `https://${location.hostname}/images/express-program/NEW BALI/options/wall-unit-${title}.webp`,
                    title,
                    validSkus: [],
                    isDisabled: false,
                });
            }
            typeOptionsMap.get(codes[2])?.validSkus.push(wallUnit.uscode);

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
            sizeOptions: Object.values(Object.fromEntries(sizeOptionsMap)),
            typeOptions: Object.values(Object.fromEntries(typeOptionsMap)),
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
    const { accordionState, handleAccordionState, handleOrderedAccordion } =
        useAccordionState();

    const accordionsOrder = useMemo(() => {
        let arr: string[] = ["vanity"];
        sideUnitOptions ? arr.push("sideUnit") : null;
        arr.push("washbasin");
        drawerBaseOptions ? arr.push("drawerBase") : null;
        wallUnitOptions ? arr.push("wallUnit") : null;
        composition.otherProductsAvailable.mirrors.length > 0
            ? arr.push("mirror")
            : null;

        return arr;
    }, []);

    // |===== INITIAL CONFIG =====|
    const initialConfiguration: CurrentConfiguration = useMemo(() => {
        const vanity: Vanity = {
            baseSku: vanityOptions.baseSku,
            drawer:
                vanityOptions.drawerOptions.length === 1
                    ? vanityOptions.drawerOptions[0].code
                    : "",
            vanityBase:
                vanityOptions.vanityBaseOptions.length === 1
                    ? vanityOptions.vanityBaseOptions[0].code
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
                  drawer: "",
                  staticVanityDrawerCode:
                      drawerBaseOptions.staticVanityDrawerCode,
                  finish: "",
              }
            : null;

        const wallUnit: WallUnit | null = wallUnitOptions
            ? {
                  baseSku: wallUnitOptions.baseSku,
                  size: "",
                  type: "",
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
            drawerBase,
            drawerBaseSku: "",
            drawerBasePrice: 0,
            wallUnit,
            wallUnitSku: "",
            wallUnitPrice: 0,
            currentProducts,
        };
    }, []);

    const reducer = (
        state: CurrentConfiguration,
        action: { type: string; payload: string | number | ProductInventory[] }
    ) => {
        switch (action.type) {
            case "set-vanity-drawer":
                return {
                    ...state,
                    vanity: {
                        ...state.vanity,
                        drawer: action.payload as string,
                    },
                };

            case "set-vanity-vanityBase":
                return {
                    ...state,
                    vanity: {
                        ...state.vanity,
                        vanityBase: action.payload as string,
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

            case "set-drawerBase-drawer":
                return {
                    ...state,
                    drawerBase: {
                        ...state.drawerBase,
                        drawer: action.payload,
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
                    drawerBaseSku: initialConfiguration.drawerBaseSku,
                    drawerBasePrice: initialConfiguration.drawerBasePrice,
                };

            case "set-wallUnit-size":
                return {
                    ...state,
                    wallUnit: {
                        ...state.wallUnit,
                        size: action.payload,
                    } as WallUnit,
                };

            case "set-wallUnit-type":
                return {
                    ...state,
                    wallUnit: {
                        ...state.wallUnit,
                        type: action.payload,
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
                    wallUnitSku: initialConfiguration.wallUnitSku,
                    wallUnitPrice: initialConfiguration.wallUnitPrice,
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
            sideUnit,
            sideUnitPrice,
            drawerBasePrice,
            wallUnitPrice,
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

            const grandTotal =
                finalVanityPrice +
                washbasinPrice +
                sideUnitPrice +
                drawerBasePrice +
                wallUnitPrice +
                mirrorCabinetPrice +
                ledMirrorPrice +
                openCompMirrorPrice;

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
        hasSideUnit: !!sideUnitOptions,
        sideUnitSku: currentConfiguration.sideUnitSku,
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

            for (const drawersOption of copyOptions.drawerOptions) {
                if (property === "drawer") break;
                for (let i = 0; i < drawersOption.validSkus.length; i++) {
                    const validSku = drawersOption.validSkus[i];
                    if (validSku.includes(option)) {
                        drawersOption.isDisabled = false;
                        break;
                    }

                    if (i === drawersOption.validSkus.length - 1)
                        drawersOption.isDisabled = true;
                }
            }

            for (const vanityBaseOption of copyOptions.vanityBaseOptions) {
                if (property === "handle") break;
                for (let i = 0; i < vanityBaseOption.validSkus.length; i++) {
                    const validSku = vanityBaseOption.validSkus[i];
                    if (validSku.includes(option)) {
                        vanityBaseOption.isDisabled = false;
                        break;
                    }

                    if (i === vanityBaseOption.validSkus.length - 1)
                        vanityBaseOption.isDisabled = true;
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

        if (item === "drawerBase") {
            const copyOptions = structuredClone(
                drawerBaseOptions
            ) as DrawerBaseOptions;

            for (const drawersOption of copyOptions.drawerOptions) {
                if (property === "drawer") break;
                for (let i = 0; i < drawersOption.validSkus.length; i++) {
                    const validSku = drawersOption.validSkus[i];
                    if (validSku.includes(option)) {
                        drawersOption.isDisabled = false;
                        break;
                    }

                    if (i === drawersOption.validSkus.length - 1)
                        drawersOption.isDisabled = true;
                }
            }

            for (const finishOption of copyOptions.finishOptions) {
                if (property === "finish") break;
                for (let i = 0; i < finishOption.validSkus.length; i++) {
                    const validSku = finishOption.validSkus[i];
                    if (validSku.includes(`-${option}-`)) {
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

        if (item === "wallUnit") {
            const copyOptions = structuredClone(
                wallUnitOptions
            ) as WallUnitOptions;

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
                "Looks like you forgot to select all available DRAWER BASE OPTIONS. Either clear the tal unit section or select the missing option(s). "
            );
            scrollToView("drawerBase");
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
            sideUnitSku,
            washbasin: washbasinSku,
            label,
            isDoubleSink,
            drawerBaseSku,
            wallUnitSku,
        } = currentConfiguration;

        const allFormattedSkus: string[] = [];

        const vanityFormattedSku = `${vanitySku}!!${composition.model}${
            isDoubleSink ? "--2" : "--1"
        }##${label}`;
        allFormattedSkus.push(vanityFormattedSku);

        const sideUnitFormattedSku = sideUnitSku
            ? `${sideUnitSku}!!${composition.model}--1##${label}`
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

        const drawerBaseFormattedSku = drawerBaseSku
            ? `${drawerBaseSku}!!${composition.model}--1##${label}`
            : "";
        drawerBaseFormattedSku && allFormattedSkus.push(drawerBaseFormattedSku);

        // ========= VVVV MIRROR (REPEATED LOGIC) ==========VVVVV
        getFormattedMirrorSkus(composition.model, label, allFormattedSkus);

        router.get("/orders/create-so-num", {
            SKU: allFormattedSkus.join("~"),
        });
    };

    const handleResetConfigurator = () => {
        setVanityOptions(initialVanityOptions);
        setDrawerBaseOptions(initialDrawerBaseOptions);
        setDrawerBaseStatus({
            isDrawerBaseSelected: false,
            isDrawerBaseValid: false,
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
                drawerBase: [] as ShoppingCartCompositionProduct[],
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
                        property="drawer"
                        title="SELECT DRAWERS"
                        options={vanityOptions.drawerOptions}
                        crrOptionSelected={currentConfiguration.vanity.drawer}
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
                            property="drawer"
                            title="SELECT SIZE/# DRAWERS"
                            options={drawerBaseOptions.drawerOptions}
                            crrOptionSelected={
                                currentConfiguration.drawerBase?.drawer!
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                        <Options
                            item="drawerBase"
                            property="finish"
                            title="SELECT FINISH"
                            options={drawerBaseOptions.finishOptions}
                            crrOptionSelected={
                                currentConfiguration.drawerBase?.finish!
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                    </ItemPropertiesAccordion>
                )}

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
                            property="size"
                            title="SELECT SIZE"
                            options={wallUnitOptions?.sizeOptions}
                            crrOptionSelected={
                                currentConfiguration.wallUnit?.size!
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                        <Options
                            item="wallUnit"
                            property="type"
                            title="SELECT TYPE"
                            options={wallUnitOptions?.typeOptions}
                            crrOptionSelected={
                                currentConfiguration.wallUnit?.type!
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

export default NewBaliConfigurator;
