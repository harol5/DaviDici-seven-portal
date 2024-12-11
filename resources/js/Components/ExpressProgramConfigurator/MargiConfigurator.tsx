import {Composition} from "../../Models/Composition";
import classes from "../../../css/product-configurator.module.css";
import {useMemo, useReducer, useState} from "react";
import type {
    Option,
    OtherItems,
    ShoppingCartComposition,
    ShoppingCartCompositionProduct,
} from "../../Models/ExpressProgramModels";
import Options from "./Options";
import ConfigurationName from "./ConfigurationName";
import {router} from "@inertiajs/react";
import {getSkuAndPrice, isAlphanumericWithSpaces, scrollToView,} from "../../utils/helperFunc";
import {ProductInventory} from "../../Models/Product";
import {
    CurrentConfiguration,
    OpenUnit,
    OpenUnitOptions,
    SideCabinet,
    SideCabinetOptions,
    Vanity,
    VanityOptions,
    WallUnit,
    WallUnitOptions,
} from "../../Models/MargiConfigTypes";
import useMirrorOptions from "../../Hooks/useMirrorOptions";
import ItemPropertiesAccordion from "./ItemPropertiesAccordion";
import type {MirrorCategory} from "../../Models/MirrorConfigTypes";
import {ItemFoxPro, Model} from "../../Models/ModelConfigTypes";
import MirrorConfigurator from "./MirrorConfigurator";
import useAccordionState from "../../Hooks/useAccordionState";
import ConfigurationBreakdown from "./ConfigurationBreakdown";
import {generateShoppingCartCompositionProductObjs} from "../../utils/shoppingCartUtils";
import useExtraProductsExpressProgram from "../../Hooks/useExtraProductsExpressProgram.tsx";
import MultiItemSelector from "./MultiItemSelector.tsx";
import {ExtraItems} from "../../Models/ExtraItemsHookModels.ts";


interface MargiConfiguratorProps {
    composition: Composition;
    onAddToCart: (shoppingCartComposition: ShoppingCartComposition) => void;
}

function MargiConfigurator({
                               composition,
                               onAddToCart,
                           }: MargiConfiguratorProps) {
    // |===== VANITY =====|
    const initialVanityOptions: VanityOptions = useMemo(() => {
        let baseSku: string = "";
        const drawerOptionsMap = new Map();
        const handleOptionsMap = new Map();
        const finishOptionsMap = new Map();

        composition.vanities.forEach((vanity, index) => {
            const codes = vanity.uscode.split("-");
            // the following logic is only for margi because each model has a different sku number order.
            //      0    1     2       3      4
            // EX: 68 - VB - 024D  -   F1   - M23
            //    base sku  drawers  handle  finish

            // only get base sku from first vanity.
            if (index === 0) {
                baseSku = `${codes[0]}-${codes[1]}`;
            }

            if (!drawerOptionsMap.has(`${codes[2]}`))
                drawerOptionsMap.set(`${codes[2]}`, {
                    code: codes[2],
                    imgUrl: `https://${
                        location.hostname
                    }/images/express-program/MARGI/options/${
                        codes[2].includes("D") ? "2 DRAWERS" : "1 DRAWER"
                    }.webp`,
                    title: codes[2].includes("D") ? "2 DRAWERS" : "1 DRAWER",
                    validSkus: [],
                    isDisabled: false,
                });

            drawerOptionsMap.get(`${codes[2]}`).validSkus.push(vanity.uscode);

            if (!handleOptionsMap.has(`${codes[3]}`))
                handleOptionsMap.set(`${codes[3]}`, {
                    code: codes[3],
                    imgUrl: `https://portal.davidici.com/images/express-program/MARGI/options/${
                        codes[3].includes("1")
                            ? "BLACK HANDLE"
                            : "POLISHED HANDLE"
                    }.webp`,
                    title: codes[3].includes("1")
                        ? "BLACK HANDLE"
                        : "POLISH HANLDE",
                    validSkus: [],
                    isDisabled: false,
                });

            handleOptionsMap.get(`${codes[3]}`).validSkus.push(vanity.uscode);

            let finishLabel = vanity.finish;

            if (vanity.finish.includes("MATT LACQ. ")) {
                finishLabel = finishLabel.replace("MATT LACQ. ", "");
            }

            if (!finishOptionsMap.has(`${codes[4]}`))
                finishOptionsMap.set(`${codes[4]}`, {
                    code: codes[4],
                    imgUrl: `https://portal.davidici.com/images/express-program/finishes/${vanity.finish}.jpg`,
                    title: finishLabel,
                    validSkus: [],
                    isDisabled: false,
                });

            finishOptionsMap.get(`${codes[4]}`).validSkus.push(vanity.uscode);
        });

        return {
            baseSku,
            drawerOptions: Object.values(Object.fromEntries(drawerOptionsMap)),
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
    const initialSideUnitOptions: SideCabinetOptions | OpenUnitOptions | null =
        useMemo(() => {
            if (composition.sideUnits.length === 0) return null;

            if (composition.sideUnits[0].descw.includes("16")) {
                let baseSku: string = "";
                const finishOptionsMap = new Map();
                const doorStyleAndHandleOptionsMap = new Map();

                composition.sideUnits.forEach((sideUnit, index) => {
                    const codes = sideUnit.uscode.split("-");
                    // the following logic is only for margi because each model has a different sku number order.
                    // EX: 68 - SC - 016 -   F1    -   M23
                    //       base sku    door-style   finish

                    // only get base sku from first vanity.
                    if (index === 0) {
                        baseSku = `${codes[0]}-${codes[1]}-${codes[2]}`;
                    }

                    if (!doorStyleAndHandleOptionsMap.has(`${codes[3]}`)) {
                        let doorStyle = codes[3].includes("F")
                            ? "FRAME"
                            : codes[3].includes("S")
                                ? "STRIPES"
                                : codes[3].includes("G")
                                    ? "GRID"
                                    : codes[3].includes("P")
                                        ? "PLAIN"
                                        : "";
                        let hanldeColor = codes[3].includes("1")
                            ? " W/ BLACK HANDLE"
                            : " W/ POLISH HANDLE";

                        doorStyleAndHandleOptionsMap.set(`${codes[3]}`, {
                            code: codes[3],
                            imgUrl: `https://${location.hostname}/images/express-program/${composition.model}/options/SIDE UNIT - ${doorStyle}.webp`,
                            title: doorStyle + hanldeColor,
                            validSkus: [],
                            isDisabled: false,
                        });
                    }
                    doorStyleAndHandleOptionsMap
                        .get(`${codes[3]}`)
                        .validSkus.push(sideUnit.uscode);

                    let finishLabel = sideUnit.finish;
                    if (sideUnit.finish.includes("MATT LACQ. ")) {
                        finishLabel = finishLabel.replace("MATT LACQ. ", "");
                    }

                    if (!finishOptionsMap.has(`${codes[4]}`))
                        finishOptionsMap.set(`${codes[4]}`, {
                            code: codes[4],
                            imgUrl: `https://portal.davidici.com/images/express-program/finishes/${sideUnit.finish}.jpg`,
                            title: finishLabel,
                            validSkus: [],
                            isDisabled: false,
                        });

                    finishOptionsMap
                        .get(`${codes[4]}`)
                        .validSkus.push(sideUnit.uscode);
                });

                return {
                    baseSku,
                    doorStyleAndHandleOptions: Object.values(
                        Object.fromEntries(doorStyleAndHandleOptionsMap)
                    ),
                    finishOptions: Object.values(
                        Object.fromEntries(finishOptionsMap)
                    ),
                };
            }

            if (composition.sideUnits[0].descw.includes("8")) {
                let baseSku: string = "";
                const finishOptionsMap = new Map();

                composition.sideUnits.forEach((sideUnit, index) => {
                    const codes = sideUnit.uscode.split("-");
                    // the following logic is only for margi because each model has a different sku number order.
                    // EX: 68 - SO - 08  - M23
                    //       base sku     finish

                    // only get base sku from first vanity.
                    if (index === 0) {
                        baseSku = `${codes[0]}-${codes[1]}-${codes[2]}`;
                    }

                    if (!finishOptionsMap.has(`${codes[3]}`))
                        finishOptionsMap.set(`${codes[3]}`, {
                            code: codes[3],
                            imgUrl: `https://portal.davidici.com/images/express-program/finishes/${sideUnit.finish}.jpg`,
                            title: sideUnit.finish,
                            validSkus: [],
                            isDisabled: false,
                        });

                    finishOptionsMap
                        .get(`${codes[3]}`)
                        .validSkus.push(sideUnit.uscode);
                });

                return {
                    baseSku,
                    finishOptions: Object.values(
                        Object.fromEntries(finishOptionsMap)
                    ),
                };
            }

            return null;
        }, []);

    const [sideUnitOptions, setSideUnitOptions] = useState(
        initialSideUnitOptions
    );

    // |===== WALL UNIT =====|
    const initialWallUnitOptions: WallUnitOptions | null = useMemo(() => {
        if (composition.otherProductsAvailable.wallUnits.length === 0)
            return null;

        //TODO: somehow i need to check what kind of keys the "otherProductsAvailable" has.
        const otherProducts = composition.otherProductsAvailable;

        let baseSku: string = "";
        const sizeOptionsMap = new Map();
        const doorStyleOptionsMap = new Map();
        const finishOptionsMap = new Map();

        for (let index = 0; index < otherProducts.wallUnits.length; index++) {
            const wallUnit = otherProducts.wallUnits[index];

            if (wallUnit.uscode === "21-P1-NE") continue;

            const codes = wallUnit.uscode.split("-");
            // the following logic is only for margi because each model has a different sku number order.
            // EX: 68 - WU  -   012    -   F     -    M23
            //    base sku     size    door/style    finish

            // only get base sku from first wall unit.
            if (!baseSku) {
                baseSku = `${codes[0]}-${codes[1]}`;
            }

            // == generate size options. ==
            if (!sizeOptionsMap.has(`${codes[2]}`)) {
                sizeOptionsMap.set(`${codes[2]}`, {
                    code: codes[2],
                    imgUrl: `https://${location.hostname}/images/express-program/MARGI/options/wall-unit-${codes[2]}.webp`,
                    title: `WALL UNIT ${codes[2]}"`,
                    validSkus: [],
                    isDisabled: false,
                });
            }

            sizeOptionsMap.get(`${codes[2]}`).validSkus.push(wallUnit.uscode);

            // == generate door style options. ==
            const doorStyle = codes[3];
            const doorStyleTitle =
                doorStyle === "F"
                    ? "FRAME"
                    : doorStyle === "S"
                        ? "STRIPES"
                        : doorStyle === "G"
                            ? "GRID"
                            : doorStyle === "P"
                                ? "PLAIN"
                                : "";
            if (!doorStyleOptionsMap.has(`${codes[3]}`)) {
                doorStyleOptionsMap.set(`${codes[3]}`, {
                    code: codes[3],
                    imgUrl: `https://${location.hostname}/images/express-program/MARGI/options/wall-unit-${doorStyleTitle}.webp`,
                    title: doorStyleTitle,
                    validSkus: [],
                    isDisabled: false,
                });
            }
            doorStyleOptionsMap
                .get(`${codes[3]}`)
                .validSkus.push(wallUnit.uscode);

            // == generate finish options. ==
            let finishTitle = wallUnit.finish;

            if (wallUnit.finish.includes("MATT LACQ. ")) {
                finishTitle = finishTitle.replace("MATT LACQ. ", "");
            }

            if (!finishOptionsMap.has(`${codes[4]}`)) {
                finishOptionsMap.set(`${codes[4]}`, {
                    code: codes[4],
                    imgUrl: `https://portal.davidici.com/images/express-program/finishes/${wallUnit.finish}.jpg`,
                    title: finishTitle,
                    validSkus: [],
                    isDisabled: false,
                });
            }
            finishOptionsMap.get(`${codes[4]}`).validSkus.push(wallUnit.uscode);
        }

        return {
            baseSku,
            sizeOptions: Object.values(Object.fromEntries(sizeOptionsMap)),
            doorStyleOptions: Object.values(
                Object.fromEntries(doorStyleOptionsMap)
            ),
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
    const {accordionState, handleAccordionState, handleOrderedAccordion} =
        useAccordionState();

    const accordionsOrder = useMemo(() => {
        let arr: string[] = ["vanity"];
        sideUnitOptions ? arr.push("sideUnit") : null;
        arr.push("washbasin");
        wallUnitOptions ? arr.push("wallUnit") : null;
        composition.otherProductsAvailable.mirrors.length > 0
            ? arr.push("mirror")
            : null;

        return arr;
    }, []);

    // |===== INITIAL CONFIG =====|
    const initialConfiguration: CurrentConfiguration = useMemo(() => {
        // --- VANITY---
        const vanity: Vanity = {
            baseSku: vanityOptions.baseSku,
            drawer:
                vanityOptions.drawerOptions.length === 1
                    ? vanityOptions.drawerOptions[0].code
                    : "",
            handle:
                vanityOptions.handleOptions.length === 1
                    ? vanityOptions.handleOptions[0].code
                    : "",
            finish: vanityOptions.finishOptions[0].code,
        };

        let vanitySkuAndPrice = getSkuAndPrice(
            composition.model as Model,
            "vanity",
            vanity,
            composition.vanities
        );

        // --- washbasin ---
        const washbasinSkuAndPrice = getSkuAndPrice(
            composition.model as Model,
            "washbasin",
            {},
            composition.washbasins,
            composition.washbasins[0].uscode
        );

        // --- SIDE UNIT---
        let sideUnit: OpenUnit | SideCabinet | null = null;
        let sideUnitType = "";
        let sideUnitSkuAndPrice = {
            sku: "",
            price: 0,
            product: null as ProductInventory | null,
        };

        if (sideUnitOptions) {
            if (composition.sideUnits[0].descw.includes("8")) {
                const margiOpenUnitOptions = sideUnitOptions as OpenUnitOptions;

                sideUnitType = "open unit";

                sideUnit = {
                    baseSku: margiOpenUnitOptions.baseSku,
                    finish:
                        margiOpenUnitOptions.finishOptions.length === 1
                            ? margiOpenUnitOptions.finishOptions[0].code
                            : "",
                };

                sideUnitSkuAndPrice = getSkuAndPrice(
                    composition.model as Model,
                    "openUnit",
                    sideUnit,
                    composition.sideUnits
                );
            }

            if (composition.sideUnits[0].descw.includes("16")) {
                const margiSideCabinetOptions =
                    sideUnitOptions as SideCabinetOptions;

                sideUnitType = "side cabinet";

                sideUnit = {
                    baseSku: margiSideCabinetOptions.baseSku,
                    doorStyleAndHandle:
                        margiSideCabinetOptions.doorStyleAndHandleOptions
                            .length === 1
                            ? margiSideCabinetOptions
                                .doorStyleAndHandleOptions[0].code
                            : "",
                    finish:
                        margiSideCabinetOptions.finishOptions.length === 1
                            ? margiSideCabinetOptions.finishOptions[0].code
                            : "",
                };

                sideUnitSkuAndPrice = getSkuAndPrice(
                    composition.model as Model,
                    "sideCabinet",
                    sideUnit,
                    composition.sideUnits
                );
            }
        }

        const currentProducts: ProductInventory[] = [];
        vanitySkuAndPrice.product !== null &&
        currentProducts.push(vanitySkuAndPrice.product);
        washbasinSkuAndPrice.product !== null &&
        currentProducts.push(washbasinSkuAndPrice.product);
        sideUnitSkuAndPrice.product !== null &&
        currentProducts.push(sideUnitSkuAndPrice.product);

        let wallUnit = null;
        if (wallUnitOptions) {
            const options = wallUnitOptions as WallUnitOptions;
            wallUnit = {
                baseSku: options.baseSku,
                size:
                    options.sizeOptions.length === 1
                        ? options.sizeOptions[0].code
                        : "",
                doorStyle:
                    options.doorStyleOptions.length === 1
                        ? options.doorStyleOptions[0].code
                        : "",
                finish:
                    options.finishOptions.length === 1
                        ? options.finishOptions[0].code
                        : "",
            };
        }

        return {
            vanity,
            vanitySku: vanitySkuAndPrice.sku,
            vanityPrice: vanitySkuAndPrice.price,
            isDoubleSink: composition.name.includes("DOUBLE"),
            sideUnit,
            sideUnitType,
            sideUnitSku: sideUnitSkuAndPrice.sku,
            sideUnitPrice: sideUnitSkuAndPrice.price,
            washbasin: washbasinSkuAndPrice.sku,
            washbasinPrice: washbasinSkuAndPrice.price,
            wallUnit,
            wallUnitSku: "",
            wallUnitPrice: 0,
            label: "",
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

            case "reset-vanity":
                return {
                    ...state,
                    vanity: {
                        ...initialConfiguration.vanity,
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

            case "set-sideUnit-finish":
                return {
                    ...state,
                    sideUnit: {
                        ...state.sideUnit,
                        finish: action.payload as string,
                    } as OpenUnit | SideCabinet,
                };

            case "set-sideUnit-doorStyleAndHandle":
                return {
                    ...state,
                    sideUnit: {
                        ...state.sideUnit,
                        doorStyleAndHandle: action.payload as string,
                    } as SideCabinet,
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

            case "set-wallUnit-size":
                return {
                    ...state,
                    wallUnit: {
                        ...state.wallUnit,
                        size: action.payload as string,
                    } as WallUnit,
                };

            case "set-wallUnit-doorStyle":
                return {
                    ...state,
                    wallUnit: {
                        ...state.wallUnit,
                        doorStyle: action.payload as string,
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
                throw new Error("case condition not found");
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
        updateOnMainConfigChanges,
        clearExtraProduct,
        getExtraItemsProductsGrandTotal,
        resetExtraItems,
        validateExtraItemsConfig
    } = useExtraProductsExpressProgram(
        "MARGI",
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
            sideUnit: {
                options: sideUnitOptions,
                config: {
                    sideUnitObj: currentConfiguration.sideUnit,
                    sideUnitSku: currentConfiguration.sideUnitSku,
                    sideUnitPrice: currentConfiguration.sideUnitPrice
                }
            },
            wallUnit: {
                options: wallUnitOptions,
                config: {
                    wallUnitObj: currentConfiguration.wallUnit,
                    wallUnitSku: currentConfiguration.wallUnitSku,
                    wallUnitPrice: currentConfiguration.wallUnitPrice,
                }
            },
        }
    );
    console.log("extraItems:", extraItems);
    console.log("extraItemsCurrentProducts:",extraItemsCurrentProducts);

    // |===== GRAND TOTAL =====|
    const grandTotal = useMemo(() => {
        const {
            vanityPrice,
            washbasinPrice,
            isDoubleSink,
            sideUnit,
            sideUnitPrice,
            wallUnitPrice,
        } = currentConfiguration;

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

        if (vanityPrice === 0 || (sideUnit && sideUnitPrice === 0)) return 0;
        else {
            const finalVanityPrice = isDoubleSink
                ? vanityPrice * 2
                : vanityPrice;

            return finalVanityPrice +
                washbasinPrice +
                sideUnitPrice +
                wallUnitPrice +
                mirrorCabinetPrice +
                ledMirrorPrice +
                openCompMirrorPrice +
                getExtraItemsProductsGrandTotal();
        }
    }, [currentConfiguration, currentMirrorsConfiguration,extraItemsCurrentProducts]);

    // |===== COMPOSITION NAME =====| (repeated logic)
    const [isMissingLabel, setIsMissingLabel] = useState(false);
    const [isInvalidLabel, setIsInvalidLabel] = useState(false);

    // |===== HELPER FUNC =====|
    const updateCurrentProducts = (
        item: ItemFoxPro,
        action: "update" | "remove" | "add",
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

        if (item === "sideUnit") {
            if (composition.sideUnits[0].descw.includes("8")) {
                const copyOptions = structuredClone(
                    sideUnitOptions
                ) as OpenUnitOptions;

                for (const finishOption of copyOptions.finishOptions as Option[]) {
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

                const copyCurrentConfiguration = structuredClone(
                    currentConfiguration.sideUnit
                ) as OpenUnit;

                copyCurrentConfiguration[
                    property as keyof typeof copyCurrentConfiguration
                    ] = option;

                const {sku, price, product} = getSkuAndPrice(
                    composition.model as Model,
                    "openUnit",
                    copyCurrentConfiguration,
                    composition.sideUnits
                );

                dispatch({
                    type: `set-${item}-sku`,
                    payload: sku,
                });
                dispatch({
                    type: `set-${item}-price`,
                    payload: price,
                });
                dispatch({
                    type: `set-${item}-${property}`,
                    payload: `${option}`,
                });
                setSideUnitOptions(copyOptions);
                if (product) {
                    updateCurrentProducts("SIDE UNIT", "update", product);
                }
            }

            if (composition.sideUnits[0].descw.includes("16")) {
                const copyOptions = structuredClone(
                    sideUnitOptions
                ) as SideCabinetOptions;

                for (const doorStyleAndHandleOption of copyOptions.doorStyleAndHandleOptions as Option[]) {
                    if (property === "doorStyleAndHandle") break;
                    for (
                        let i = 0;
                        i < doorStyleAndHandleOption.validSkus.length;
                        i++
                    ) {
                        const validSku = doorStyleAndHandleOption.validSkus[i];
                        if (validSku.includes(option)) {
                            doorStyleAndHandleOption.isDisabled = false;
                            break;
                        }

                        if (i === doorStyleAndHandleOption.validSkus.length - 1)
                            doorStyleAndHandleOption.isDisabled = true;
                    }
                }

                for (const finishOption of copyOptions.finishOptions as Option[]) {
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

                const copyCurrentConfiguration = structuredClone(
                    currentConfiguration.sideUnit
                ) as SideCabinet;

                copyCurrentConfiguration[
                    property as keyof typeof copyCurrentConfiguration
                    ] = option;

                const {sku, price, product} = getSkuAndPrice(
                    composition.model as Model,
                    "sideCabinet",
                    copyCurrentConfiguration,
                    composition.sideUnits
                );

                dispatch({
                    type: `set-${item}-sku`,
                    payload: sku,
                });
                dispatch({
                    type: `set-${item}-price`,
                    payload: price,
                });
                dispatch({
                    type: `set-${item}-${property}`,
                    payload: `${option}`,
                });
                setSideUnitOptions(copyOptions);
                if (product) {
                    updateCurrentProducts("SIDE UNIT", "update", product);
                }
            }
        }

        if (item === "wallUnit") {

            // TODO: write logic that will determine to either update the main config or the extraItems object(hook state).
            const crrWallUnitOptions = extraItems.wallUnit.currentlyDisplay !== -1 ?
                extraItems.wallUnit.configurations[extraItems.wallUnit.currentlyDisplay].options as WallUnitOptions
                : wallUnitOptions as WallUnitOptions;

            const copyOptions = structuredClone(crrWallUnitOptions);

            const crrWallUnitConfig = extraItems.wallUnit.currentlyDisplay !== -1 ?
                extraItems.wallUnit.currentConfig.wallUnitObj
                : currentConfiguration.wallUnit;

            const copyCurrentConfiguration = structuredClone(
                crrWallUnitConfig
            ) as WallUnit;

            //--------------------------------------------------------------------

            for (const sizeOption of copyOptions?.sizeOptions!) {
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

            for (const doorStyleOption of copyOptions?.doorStyleOptions!) {
                if (property === "door style") break;
                for (let i = 0; i < doorStyleOption.validSkus.length; i++) {
                    const validSku = doorStyleOption.validSkus[i];
                    if (validSku.includes(option)) {
                        doorStyleOption.isDisabled = false;
                        break;
                    }

                    if (i === doorStyleOption.validSkus.length - 1)
                        doorStyleOption.isDisabled = true;
                }
            }

            for (const finishOption of copyOptions?.finishOptions!) {
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

            copyCurrentConfiguration[
                property as keyof typeof copyCurrentConfiguration
                ] = option;

            const {sku, price, product} = getSkuAndPrice(
                composition.model as Model,
                "wallUnit",
                copyCurrentConfiguration,
                composition.otherProductsAvailable.wallUnits
            );

            if (extraItems.wallUnit.currentlyDisplay !== -1) {
                handleExtraItemOptionSelected(
                    item,
                    extraItems.wallUnit.currentlyDisplay,
                    {
                        wallUnitObj: copyCurrentConfiguration,
                        wallUnitSku: sku,
                        wallUnitPrice: price
                    },
                    copyOptions,
                    price > 0,
                    product
                );
            }else {
                dispatch({
                    type: `set-${item}-sku`,
                    payload: sku,
                });
                dispatch({
                    type: `set-${item}-price`,
                    payload: price,
                });
                dispatch({type: `set-${item}-${property}`, payload: `${option}`});
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

                updateOnMainConfigChanges(item,copyOptions,{
                    wallUnitObj: copyCurrentConfiguration,
                    wallUnitSku: sku,
                    wallUnitPrice: price
                });
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
                type: `set-${item}-type`,
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
            wallUnitStatus.isWallUnitSelected &&
            !wallUnitStatus.isWallUnitValid
        ) {
            alert(
                "Looks like you forgot to select all available WALL UNIT OPTIONS. Either clear the wall unit section or select the missing option(s). "
            );
            scrollToView("wallUnit");
            return false;
        }

        if (!isMirrorCabinetConfigValid()) {
            alert(
                "Looks like you forgot to select all available MIRROR CABINET OPTIONS. Either clear the mirror cabinet section or select the missing option(s). "
            );
            scrollToView("mirror");
            return false;
        }

        const {isExtraItemsConfigValid,messages} = validateExtraItemsConfig()
        if (!isExtraItemsConfigValid){
            alert(messages.join("\n"));
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
        } = currentConfiguration;

        const allFormattedSkus: string[] = [];

        const vanityFormattedSku = `${vanitySku}!!${composition.model}${
            currentConfiguration.isDoubleSink ? "--2" : "--1"
        }##${currentConfiguration.label}`;
        allFormattedSkus.push(vanityFormattedSku);

        const sideUnitFormattedSku = sideUnitSku
            ? `${sideUnitSku}!!${composition.model}--1##${currentConfiguration.label}`
            : "";
        sideUnitFormattedSku && allFormattedSkus.push(sideUnitFormattedSku);

        const washbasinFormattedSku = washbasinSku
            ? `${washbasinSku}!!${composition.model}--1##${currentConfiguration.label}`
            : "";
        washbasinFormattedSku && allFormattedSkus.push(washbasinFormattedSku);

        const wallUnitFormattedSku = wallUnitSku
            ? `${wallUnitSku}!!${composition.model}--1##${currentConfiguration.label}`
            : "";
        wallUnitFormattedSku && allFormattedSkus.push(wallUnitFormattedSku);

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
            case "vanity":
                setVanityOptions(initialVanityOptions);
                dispatch({type: "reset-vanity", payload: ""});
                break;

            case "washbasin":
                updateCurrentProducts("WASHBASIN/SINK", "remove");
                dispatch({type: "reset-washbasin", payload: ""});
                break;

            case "wallUnit":
                updateCurrentProducts("WALL UNIT", "remove");
                setWallUnitOptions(initialWallUnitOptions);
                setWallUnitStatus({
                    isWallUnitSelected: false,
                    isWallUnitValid: false,
                });
                dispatch({type: "reset-wallUnit", payload: ""});
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
            images: null,
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
                        extraItemsProducts={Object.values(extraItemsCurrentProducts).flat()}
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
                        property="handle"
                        title="SELECT HANDLES"
                        options={vanityOptions.handleOptions}
                        crrOptionSelected={currentConfiguration.vanity.handle}
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

                {composition.sideUnits.length !== 0 && (
                    <ItemPropertiesAccordion
                        headerTitle="SIDE UNIT"
                        item="sideUnit"
                        isOpen={accordionState.sideUnit}
                        onClick={handleAccordionState}
                        buttons={"next and previous"}
                        accordionsOrder={accordionsOrder}
                        onNavigation={handleOrderedAccordion}
                    >
                        <SizeUnit
                            composition={composition}
                            currentConfiguration={currentConfiguration}
                            handleOptionSelected={handleOptionSelected}
                            sideUnitOptions={sideUnitOptions}
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
                        <MultiItemSelector
                            item={"wallUnit"}
                            initialOptions={initialWallUnitOptions as WallUnitOptions}
                            extraItems={extraItems}
                            handleAddExtraProduct={handleAddExtraProduct}
                            setCurrentDisplayItem={setCurrentDisplayItem}
                            removeConfiguration={removeConfiguration}
                        />
                        <Options
                            item="wallUnit"
                            property="size"
                            title="SELECT SIZE"
                            options={extraItems.wallUnit.currentOptions.sizeOptions}
                            crrOptionSelected={
                                extraItems.wallUnit.currentConfig.wallUnitObj.size
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                        <Options
                            item="wallUnit"
                            property="doorStyle"
                            title="SELECT DOOR STYLE"
                            options={extraItems.wallUnit.currentOptions.doorStyleOptions}
                            crrOptionSelected={
                                extraItems.wallUnit.currentConfig.wallUnitObj.doorStyle
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                        <Options
                            item="wallUnit"
                            property="finish"
                            title="SELECT FINISH"
                            options={extraItems.wallUnit.currentOptions.finishOptions}
                            crrOptionSelected={
                                extraItems.wallUnit.currentConfig.wallUnitObj.finish
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

export default MargiConfigurator;

interface SizeUnitProps {
    composition: Composition;
    currentConfiguration: CurrentConfiguration;
    handleOptionSelected: (
        item: string,
        property: string,
        option: string
    ) => void;
    sideUnitOptions: SideCabinetOptions | OpenUnitOptions | null;
}

function SizeUnit({
                      composition,
                      currentConfiguration,
                      handleOptionSelected,
                      sideUnitOptions,
                  }: SizeUnitProps) {
    if (composition.sideUnits[0].descw.includes("8")) {
        const options = sideUnitOptions as OpenUnitOptions;
        const sideUnitCurrentConfi = currentConfiguration.sideUnit as OpenUnit;

        return (
            <Options
                item="sideUnit"
                property="finish"
                title="SELECT FINISH"
                options={options.finishOptions}
                crrOptionSelected={sideUnitCurrentConfi?.finish as string}
                onOptionSelected={handleOptionSelected}
            />
        );
    }

    if (composition.sideUnits[0].descw.includes("16")) {
        const options = sideUnitOptions as SideCabinetOptions;
        const sideUnitCurrentConfi =
            currentConfiguration.sideUnit as SideCabinet;

        return (
            <>
                <Options
                    item="sideUnit"
                    property="finish"
                    title="SELECT FINISH"
                    options={options.finishOptions}
                    crrOptionSelected={sideUnitCurrentConfi?.finish as string}
                    onOptionSelected={handleOptionSelected}
                />
                <Options
                    item="sideUnit"
                    property="doorStyleAndHandle"
                    title="SELECT DOOR STYLE"
                    options={options.doorStyleAndHandleOptions}
                    crrOptionSelected={
                        sideUnitCurrentConfi?.doorStyleAndHandle as string
                    }
                    onOptionSelected={handleOptionSelected}
                />
            </>
        );
    }
}

