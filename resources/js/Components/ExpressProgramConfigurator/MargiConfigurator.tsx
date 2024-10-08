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
    VanityOptions,
    WallUnitOptions,
    OpenUnitOptions,
    SideCabinetOptions,
    OpenUnit,
    SideCabinet,
    WallUnit,
    Vanity,
    CurrentConfiguration,
} from "../../Models/MargiConfigTypes";
import useMirrorOptions from "../../Hooks/useMirrorOptions";
import ItemPropertiesAccordion from "./ItemPropertiesAccordion";
import type { MirrorCategory } from "../../Models/MirrorConfigTypes";
import { Item, Model } from "../../Models/ModelConfigTypes";
import MirrorConfigurator from "./MirrorConfigurator";
import useAccordionState from "../../Hooks/useAccordionState";

interface MargiConfiguratorProps {
    composition: Composition;
    onAddToCart: (shoppingCartProduct: shoppingCartProductModel) => void;
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
        getMirrorProductObj,
        isMirrorCabinetConfigValid,
    } = useMirrorOptions(composition.otherProductsAvailable.mirrors);

    const handleSwitchCrrMirrorCategory = (mirrorCategory: MirrorCategory) => {
        updateCurrentMirrorCategory(mirrorCategory);
    };

    // |===== ACCORDION =====|
    const { accordionState, handleAccordionState, handleOrderedAccordion } =
        useAccordionState();

    const accordionsOrder = [
        "vanity",
        "sideUnit",
        "washbasin",
        "wallUnit",
        "mirror",
    ];

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

        const washbasinPrice = composition.washbasins[0].sprice
            ? composition.washbasins[0].sprice
            : composition.washbasins[0].msrp;

        // --- SIDE UNIT---
        let sideUnit: OpenUnit | SideCabinet | null = null;
        let sideUnitType = "";
        let sideUnitSkuAndPrice = {
            sku: "",
            price: 0,
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
            washbasin: composition.washbasins[0].uscode,
            washbasinPrice,
            wallUnit,
            wallUnitSku: "",
            wallUnitPrice: 0,
            label: "",
        };
    }, []);

    const reducer = (
        state: CurrentConfiguration,
        action: { type: string; payload: string | number }
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

                const { sku, price } = getSkuAndPrice(
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

                const lastIndex = accordionsOrder.length - 1;
                const itemIndex = accordionsOrder.indexOf(item);
                if (itemIndex !== lastIndex && price > 0) {
                    const nextItem = accordionsOrder[itemIndex + 1] as Item;
                    handleOrderedAccordion(item, nextItem);
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

                const { sku, price } = getSkuAndPrice(
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

                const lastIndex = accordionsOrder.length - 1;
                const itemIndex = accordionsOrder.indexOf(item);
                if (itemIndex !== lastIndex && price > 0) {
                    const nextItem = accordionsOrder[itemIndex + 1] as Item;
                    handleOrderedAccordion(item, nextItem);
                }
            }
        }

        if (item === "wallUnit") {
            const copyOptions = structuredClone(wallUnitOptions);

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

            const copyCurrentConfiguration = structuredClone(
                currentConfiguration.wallUnit
            ) as WallUnit;

            copyCurrentConfiguration[
                property as keyof typeof copyCurrentConfiguration
            ] = option;

            const { sku, price } = getSkuAndPrice(
                composition.model as Model,
                "wallUnit",
                copyCurrentConfiguration,
                composition.otherProductsAvailable.wallUnits
            );

            dispatch({
                type: `set-${item}-sku`,
                payload: sku,
            });
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
                type: `set-${item}-type`,
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
        dispatch({ type: "reset-configurator", payload: "" });
    };

    const handleClearItem = (item: string) => {
        switch (item) {
            case "vanity":
                setVanityOptions(initialVanityOptions);
                dispatch({ type: "reset-vanity", payload: "" });
                break;

            case "wallUnit":
                setWallUnitOptions(initialWallUnitOptions);
                setWallUnitStatus({
                    isWallUnitSelected: false,
                    isWallUnitValid: false,
                });
                dispatch({ type: "reset-wallUnit", payload: "" });
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
            wallUnitSku,
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

        const sideUnitsObj = composition.sideUnits.find(
            (sideUnit) => sideUnit.uscode === sideUnitSku
        );

        const washbasinObj = composition.washbasins.find(
            (washbasin) => washbasin.uscode === washbasinSku
        );

        const wallUnitObj = composition.otherProductsAvailable.wallUnits.find(
            (wallUnit) => wallUnit.uscode === wallUnitSku
        );
        wallUnitObj && otherProducts.wallUnit.push(wallUnitObj);

        getMirrorProductObj(
            composition.otherProductsAvailable.mirrors,
            otherProducts
        );

        const shoppingCartObj: shoppingCartProductModel = {
            composition: composition,
            configuration: currentConfiguration,
            description: composition.name,
            label: currentConfiguration.label,
            vanity: vanityObj!,
            sideUnits: sideUnitsObj ? [sideUnitsObj] : [],
            washbasin: washbasinObj!,
            otherProducts,
            isDoubleSink: currentConfiguration.isDoubleSink,
            isDoubleSideunit: false,
            quantity: 1,
            grandTotal: grandTotal,
        };

        onAddToCart(shoppingCartObj);
    };

    console.log("=== margi confg render ===");
    console.log("composition:", composition);
    console.log("current config:", currentConfiguration);
    console.log("current mirror config:", currentMirrorsConfiguration);
    console.log("is wall unit active?", wallUnitStatus.isWallUnitSelected);
    console.log("is wall unit valid?", wallUnitStatus.isWallUnitValid);
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

                <ItemPropertiesAccordion
                    headerTitle="VANITY"
                    item="vanity"
                    isOpen={accordionState.vanity}
                    onClick={handleAccordionState}
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
                    >
                        <button
                            className={classes.clearButton}
                            onClick={() => handleClearItem("wallUnit")}
                        >
                            CLEAR
                        </button>
                        <Options
                            item="wallUnit"
                            property="size"
                            title="SELECT SIZE"
                            options={wallUnitOptions.sizeOptions}
                            crrOptionSelected={
                                currentConfiguration.wallUnit!.size
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                        <Options
                            item="wallUnit"
                            property="doorStyle"
                            title="SELECT DOOR STYLE"
                            options={wallUnitOptions.doorStyleOptions}
                            crrOptionSelected={
                                currentConfiguration.wallUnit!.doorStyle
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                        <Options
                            item="wallUnit"
                            property="finish"
                            title="SELECT FINISH"
                            options={wallUnitOptions.finishOptions}
                            crrOptionSelected={
                                currentConfiguration.wallUnit!.finish
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
