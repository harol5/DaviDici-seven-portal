import { Composition } from "../../Models/Composition";
import classes from "../../../css/product-configurator.module.css";
import { useMemo, useReducer, useState } from "react";
import type {
    Option,
    shoppingCartProduct as shoppingCartProductModel,
} from "../../Models/ExpressProgramModels";
import Options from "./Options";
import ConfigurationName from "./ConfigurationName";
import { ToastContainer, toast } from "react-toastify";
import { router } from "@inertiajs/react";
import { isAlphanumericWithSpaces } from "../../utils/helperFunc";
import { ProductInventory } from "../../Models/Product";
import {
    vanityOptions,
    wallUnitOptions,
    margiOpenUnitOptions,
    margiSideCabinetOptions,
    margiOpenUnit,
    margiSideCabinet,
    wallUnit,
    vanity,
    CurrentConfiguration,
    SkuLengths,
} from "../../Models/MargiConfigTypes";
import useMirrorOptions from "../../Hooks/useMirrorOptions";
import ItemPropertiesAccordion from "./ItemPropertiesAccordion";
import type {
    mirrorCategories,
    MirrorCabinetsOptions,
} from "../../Models/MirrorConfigTypes";

/**
 * TODO;
 * 3. redesign options by sections (vanity, side unit, wall unit, etc...)
 */

interface MargiConfiguratorProps {
    composition: Composition;
    onAddToCart: (shoppingCartProduct: shoppingCartProductModel) => void;
}

function MargiConfigurator({
    composition,
    onAddToCart,
}: MargiConfiguratorProps) {
    // |====== creates vanity options ======|
    const initialVanityOptions: vanityOptions = useMemo(() => {
        let baseSku: string = "";
        const drawerOptionsMap = new Map();
        const handleOptionsMap = new Map();
        const finishOptionsMap = new Map();

        composition.vanities.forEach((vanity, index) => {
            const codes = vanity.uscode.split("-");
            // the following logic is only for margi because each model has a different sku number order.
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

    // |====== creates washbasin options ======|
    // this logic is the same for the other collection. MUST CREATE A FUNTION THAT WRAPS TO AVOID REPETICION.
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

    // |====== creates side unit options ======|
    const initialSideUnitOptions:
        | margiSideCabinetOptions
        | margiOpenUnitOptions
        | null = useMemo(() => {
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

    // |====== creates wall unit options ======|
    const initialWallUnitOptions: wallUnitOptions | null = useMemo(() => {
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
                    imgUrl: `https://portal.davidici.com/images/express-program/not-image.jpg`,
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
                    imgUrl: `https://portal.davidici.com/images/express-program/not-image.jpg`,
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
        initialMirrorCabinetOptions,
        mirrorCabinetOptions,
        setMirrorCabinetOptions,
        ledMirrorOptions,
        openCompMirrorOptions,
        mirrorCabinetStatus,
        setMirrorCabinetStatus,
        crrMirrorCategory,
        setCrrMirrorCategory,
        handleSwitchCrrMirrorCategory: updateCurrentMirrorCategory,
        handleMirrorOptionSelected: updateMirrorOptions,
    } = useMirrorOptions(composition.otherProductsAvailable.mirrors);

    const handleSwitchCrrMirrorCategory = (
        mirrorCategory: mirrorCategories
    ) => {
        updateCurrentMirrorCategory(mirrorCategory);
        dispatch({ type: `reset-${crrMirrorCategory}`, payload: "" });
    };

    // |====== create objetct that will hold current configuration. if only one option, make it default. ======|
    const getSkuAndPrice = (
        item: string,
        itemObj: vanity | margiOpenUnit | margiSideCabinet | wallUnit | {},
        products: ProductInventory[],
        wholeSku?: string
    ) => {
        const skuAndPrice = { sku: "", price: 0 };

        if (wholeSku) {
            for (const crrProduct of products) {
                if (crrProduct.uscode === wholeSku) {
                    skuAndPrice.price = crrProduct.msrp;
                    skuAndPrice.sku = wholeSku;
                    break;
                }
            }
        } else {
            const itemCodesArray: string[] = [];

            for (const key in itemObj) {
                const property = key as keyof typeof itemObj;
                const code = itemObj[property];
                if (code) itemCodesArray.push(code);
            }

            if (
                itemCodesArray.length !==
                SkuLengths[item as keyof typeof SkuLengths]
            ) {
                return skuAndPrice;
            }

            const productSku = itemCodesArray.join("-");

            for (const crrProduct of products) {
                if (crrProduct.uscode === productSku) {
                    skuAndPrice.price = crrProduct.msrp;
                    skuAndPrice.sku = productSku;
                    break;
                }
            }
        }

        return skuAndPrice;
    };

    const initialConfiguration: CurrentConfiguration = useMemo(() => {
        // --- VANITY---
        const vanity = {
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
            "vanity",
            vanity,
            composition.vanities
        );

        // --- SIDE UNIT---
        let sideUnit: margiOpenUnit | margiSideCabinet | null = null;
        let sideUnitType = "";
        let sideUnitSkuAndPrice = {
            sku: "",
            price: 0,
        };

        if (sideUnitOptions) {
            if (composition.sideUnits[0].descw.includes("8")) {
                const margiOpenUnitOptions =
                    sideUnitOptions as margiOpenUnitOptions;

                sideUnitType = "open unit";

                sideUnit = {
                    baseSku: margiOpenUnitOptions.baseSku,
                    finish:
                        margiOpenUnitOptions.finishOptions.length === 1
                            ? margiOpenUnitOptions.finishOptions[0].code
                            : "",
                };

                sideUnitSkuAndPrice = getSkuAndPrice(
                    "openUnit",
                    sideUnit,
                    composition.sideUnits
                );
            }

            if (composition.sideUnits[0].descw.includes("16")) {
                const margiSideCabinetOptions =
                    sideUnitOptions as margiSideCabinetOptions;

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
                    "sideCabinet",
                    sideUnit,
                    composition.sideUnits
                );
            }
        }

        let wallUnit = null;
        if (wallUnitOptions) {
            const options = wallUnitOptions as wallUnitOptions;
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
            washbasinPrice: composition.washbasins[0].msrp,
            wallUnit,
            wallUnitSku: "",
            wallUnitPrice: 0,
            mirrorCabinet: {
                baseSku: mirrorCabinetOptions.baseSku,
                size: "",
                finish: "",
            },
            mirrorCabinetSku: "",
            mirrorCabinetPrice: 0,
            ledMirror: "",
            ledMirrorPrice: 0,
            openCompMirror: "",
            openCompMirrorPrice: 0,
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
                    } as margiOpenUnit | margiSideCabinet,
                };

            case "set-sideUnit-doorStyleAndHandle":
                return {
                    ...state,
                    sideUnit: {
                        ...state.sideUnit,
                        doorStyleAndHandle: action.payload as string,
                    } as margiSideCabinet,
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
                    } as wallUnit,
                };

            case "set-wallUnit-doorStyle":
                return {
                    ...state,
                    wallUnit: {
                        ...state.wallUnit,
                        doorStyle: action.payload as string,
                    } as wallUnit,
                };

            case "set-wallUnit-finish":
                return {
                    ...state,
                    wallUnit: {
                        ...state.wallUnit,
                        finish: action.payload as string,
                    } as wallUnit,
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
                        ...(initialConfiguration.wallUnit as wallUnit),
                    },
                    wallUnitSku: initialConfiguration.wallUnitSku,
                    wallUnitPrice: initialConfiguration.wallUnitPrice,
                };

            // |===vvvvvv SAME MIRROR CASES FOR ALL MODELS VVVVV===|

            case "set-mirrorCabinet-size":
                return {
                    ...state,
                    mirrorCabinet: {
                        ...state.mirrorCabinet,
                        size: action.payload as string,
                    },
                };

            case "set-mirrorCabinet-finish":
                return {
                    ...state,
                    mirrorCabinet: {
                        ...state.mirrorCabinet,
                        finish: action.payload as string,
                    },
                };

            case "set-mirrorCabinet-sku":
                return {
                    ...state,
                    mirrorCabinetSku: action.payload as string,
                };

            case "set-mirrorCabinet-price":
                return {
                    ...state,
                    mirrorCabinetPrice: action.payload as number,
                };

            case "reset-mirrorCabinet":
                return {
                    ...state,
                    mirrorCabinet: {
                        ...initialConfiguration.mirrorCabinet,
                    },
                    mirrorCabinetPrice: initialConfiguration.mirrorCabinetPrice,
                    mirrorCabinetSku: initialConfiguration.mirrorCabinetSku,
                };

            case "set-ledMirror-type":
                return {
                    ...state,
                    ledMirror: action.payload as string,
                };

            case "set-ledMirror-price":
                return {
                    ...state,
                    ledMirrorPrice: action.payload as number,
                };

            case "reset-ledMirror":
                return {
                    ...state,
                    ledMirror: initialConfiguration.ledMirror,
                    ledMirrorPrice: initialConfiguration.ledMirrorPrice,
                };

            case "set-openCompMirror-type":
                return {
                    ...state,
                    openCompMirror: action.payload as string,
                };

            case "set-openCompMirror-price":
                return {
                    ...state,
                    openCompMirrorPrice: action.payload as number,
                };

            case "reset-openCompMirror":
                return {
                    ...state,
                    openCompMirror: initialConfiguration.openCompMirror,
                    openCompMirrorPrice:
                        initialConfiguration.openCompMirrorPrice,
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
            mirrorCabinetPrice,
            ledMirrorPrice,
            openCompMirrorPrice,
        } = currentConfiguration;

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
    }, [currentConfiguration]);

    // |===== Manage label =====| (repeated logic)
    const [isMissingLabel, setIsMissingLabel] = useState(false);
    const [isInvalidLabel, setIsInvalidLabel] = useState(false);

    // |====== Events ======|
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

            const skuAndPrice = getSkuAndPrice(
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

        if (item === "sideUnit") {
            if (composition.sideUnits[0].descw.includes("8")) {
                const copyOptions = structuredClone(
                    sideUnitOptions
                ) as margiOpenUnitOptions;

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
                ) as margiOpenUnit;

                copyCurrentConfiguration[
                    property as keyof typeof copyCurrentConfiguration
                ] = option;

                const skuAndPrice = getSkuAndPrice(
                    "openUnit",
                    copyCurrentConfiguration,
                    composition.sideUnits
                );

                dispatch({
                    type: `set-${item}-sku`,
                    payload: skuAndPrice.sku,
                });
                dispatch({
                    type: `set-${item}-price`,
                    payload: skuAndPrice.price,
                });
                dispatch({
                    type: `set-${item}-${property}`,
                    payload: `${option}`,
                });
                setSideUnitOptions(copyOptions);
            }

            if (composition.sideUnits[0].descw.includes("16")) {
                const copyOptions = structuredClone(
                    sideUnitOptions
                ) as margiSideCabinetOptions;

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
                ) as margiSideCabinet;

                copyCurrentConfiguration[
                    property as keyof typeof copyCurrentConfiguration
                ] = option;

                const skuAndPrice = getSkuAndPrice(
                    "sideCabinet",
                    copyCurrentConfiguration,
                    composition.sideUnits
                );

                dispatch({
                    type: `set-${item}-sku`,
                    payload: skuAndPrice.sku,
                });
                dispatch({
                    type: `set-${item}-price`,
                    payload: skuAndPrice.price,
                });
                dispatch({
                    type: `set-${item}-${property}`,
                    payload: `${option}`,
                });
                setSideUnitOptions(copyOptions);
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
            ) as wallUnit;

            copyCurrentConfiguration[
                property as keyof typeof copyCurrentConfiguration
            ] = option;

            const skuAndPrice = getSkuAndPrice(
                "wallUnit",
                copyCurrentConfiguration,
                composition.otherProductsAvailable.wallUnits
            );

            dispatch({
                type: `set-${item}-sku`,
                payload: skuAndPrice.sku,
            });
            dispatch({
                type: `set-${item}-price`,
                payload: skuAndPrice.price,
            });
            dispatch({ type: `set-${item}-${property}`, payload: `${option}` });
            setWallUnitOptions(copyOptions);

            setWallUnitStatus((prev) => ({
                ...prev,
                isWallUnitValid: skuAndPrice.price > 0,
            }));

            !wallUnitStatus.isWallUnitSelected &&
                setWallUnitStatus((prev) => ({
                    ...prev,
                    isWallUnitSelected: true,
                }));
        }

        if (item === "washbasin") {
            const skuAndPrice = getSkuAndPrice(
                item,
                {},
                composition.washbasins,
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

        // |===vvvvvv SAME MIRROR LOGIC FOR ALL MODELS VVVVV===|

        if (item === "mirrorCabinet") {
            const mirrorCabinetCurrentConfiguration = structuredClone(
                currentConfiguration.mirrorCabinet
            );

            mirrorCabinetCurrentConfiguration[
                property as keyof typeof mirrorCabinetCurrentConfiguration
            ] = option;

            const skuAndPrice = getSkuAndPrice(
                item,
                mirrorCabinetCurrentConfiguration,
                composition.otherProductsAvailable.mirrors
            );

            dispatch({ type: `set-${item}-sku`, payload: skuAndPrice.sku });
            dispatch({
                type: `set-${item}-price`,
                payload: skuAndPrice.price,
            });
            dispatch({ type: `set-${item}-${property}`, payload: `${option}` });
            updateMirrorOptions(item, property, option, skuAndPrice.price > 0);
        }

        if (item === "ledMirror") {
            const skuAndPrice = getSkuAndPrice(
                item,
                {},
                composition.otherProductsAvailable.mirrors,
                option
            );

            dispatch({
                type: `set-${item}-type`,
                payload: skuAndPrice.sku === "none" ? "" : skuAndPrice.sku,
            });
            dispatch({
                type: `set-${item}-price`,
                payload: skuAndPrice.price,
            });
        }

        if (item === "openCompMirror") {
            const skuAndPrice = getSkuAndPrice(
                item,
                {},
                composition.otherProductsAvailable.mirrors,
                option
            );

            dispatch({
                type: `set-${item}-type`,
                payload: skuAndPrice.sku === "none" ? "" : skuAndPrice.sku,
            });
            dispatch({
                type: `set-${item}-price`,
                payload: skuAndPrice.price,
            });
        }
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

        if (
            wallUnitStatus.isWallUnitSelected &&
            !wallUnitStatus.isWallUnitValid
        ) {
            alert(
                "Looks like you forgot to select all available WALL UNIT OPTIONS. Either clear the wall unit section or select the missing option(s). "
            );
            return false;
        }

        if (
            mirrorCabinetStatus.isMirrorCabinetSelected &&
            !mirrorCabinetStatus.isMirrorCabinetValid
        ) {
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
            sideUnitSku,
            washbasin: washbasinSku,
            wallUnitSku,
            mirrorCabinetSku,
            ledMirror: ledMirrorSku,
            openCompMirror: openCompMirrorSku,
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
        const mirrorCabinetFormattedSku = mirrorCabinetSku
            ? `${mirrorCabinetSku}!!${composition.model}--1##${currentConfiguration.label}`
            : "";
        mirrorCabinetFormattedSku &&
            allFormattedSkus.push(mirrorCabinetFormattedSku);

        const ledMirrorFormattedSku = ledMirrorSku
            ? `${ledMirrorSku}!!${composition.model}--1##${currentConfiguration.label}`
            : "";
        ledMirrorFormattedSku && allFormattedSkus.push(ledMirrorFormattedSku);

        const openCompMirrorFormattedSku = openCompMirrorSku
            ? `${openCompMirrorSku}!!${composition.model}--1##${currentConfiguration.label}`
            : "";
        openCompMirrorFormattedSku &&
            allFormattedSkus.push(openCompMirrorFormattedSku);

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
        setMirrorCabinetOptions(initialMirrorCabinetOptions);
        setMirrorCabinetStatus({
            isMirrorCabinetSelected: false,
            isMirrorCabinetValid: false,
        });
        setCrrMirrorCategory("mirrorCabinet");
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

            case "mirrorCabinet":
                setMirrorCabinetOptions(initialMirrorCabinetOptions);
                setMirrorCabinetStatus({
                    isMirrorCabinetSelected: false,
                    isMirrorCabinetValid: false,
                });
                dispatch({ type: "reset-mirrorCabinet", payload: "" });
                break;

            case "ledMirror":
                dispatch({ type: "reset-ledMirror", payload: "" });
                break;

            case "openCompMirror":
                dispatch({ type: "reset-openCompMirror", payload: "" });
                break;

            default:
                throw new Error("case condition not found");
        }
    };

    // Creates object for shopping cart.
    const handleAddToCart = () => {
        if (!isValidConfiguration()) return;

        const {
            vanitySku,
            sideUnitSku,
            washbasin: washbasinSku,
            wallUnitSku,
            mirrorCabinetSku,
            ledMirror: ledMirrorSku,
            openCompMirror: openCompMirrorSku,
        } = currentConfiguration;

        const otherProducts = {
            wallUnit: [] as ProductInventory[],
            tallUnit: [] as ProductInventory[],
            accessory: [] as ProductInventory[],
            mirror: [] as ProductInventory[],
        };

        const mirrorSku = mirrorCabinetSku || ledMirrorSku || openCompMirrorSku;

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

        const mirrorObj = composition.otherProductsAvailable.mirrors.find(
            (mirror) => mirror.uscode === mirrorSku
        );
        mirrorObj && otherProducts.mirror.push(mirrorObj);

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
    console.log("is wall unit active?", wallUnitStatus.isWallUnitSelected);
    console.log("is wall unit valid?", wallUnitStatus.isWallUnitValid);
    console.log(
        "is mirror cabinet active?",
        mirrorCabinetStatus.isMirrorCabinetSelected
    );
    console.log(
        "is mirror cabinet valid?",
        mirrorCabinetStatus.isMirrorCabinetValid
    );
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
                    <ItemPropertiesAccordion headerTitle="SIDE UNIT">
                        <SizeUnit
                            composition={composition}
                            currentConfiguration={currentConfiguration}
                            handleOptionSelected={handleOptionSelected}
                            sideUnitOptions={sideUnitOptions}
                        />
                    </ItemPropertiesAccordion>
                )}

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

                {wallUnitOptions && (
                    <ItemPropertiesAccordion headerTitle="WALL UNIT">
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

                <ItemPropertiesAccordion headerTitle="MIRRORS">
                    <section className={classes.mirrorCategories}>
                        <div className={classes.mirrorCategoriesSwitchers}>
                            <button
                                className={
                                    crrMirrorCategory === "mirrorCabinet"
                                        ? classes.mirrorCategorySelected
                                        : ""
                                }
                                onClick={() =>
                                    handleSwitchCrrMirrorCategory(
                                        "mirrorCabinet"
                                    )
                                }
                            >
                                MIRROR CABINETS
                            </button>
                            <button
                                className={
                                    crrMirrorCategory === "ledMirror"
                                        ? classes.mirrorCategorySelected
                                        : ""
                                }
                                onClick={() =>
                                    handleSwitchCrrMirrorCategory("ledMirror")
                                }
                            >
                                LED MIRRORS
                            </button>
                            <button
                                className={
                                    crrMirrorCategory === "openCompMirror"
                                        ? classes.mirrorCategorySelected
                                        : ""
                                }
                                onClick={() =>
                                    handleSwitchCrrMirrorCategory(
                                        "openCompMirror"
                                    )
                                }
                            >
                                OPEN COMPARTMENT MIRRORS
                            </button>
                        </div>
                        {crrMirrorCategory === "mirrorCabinet" && (
                            <div>
                                <button
                                    className={classes.clearButton}
                                    onClick={() =>
                                        handleClearItem("mirrorCabinet")
                                    }
                                >
                                    CLEAR
                                </button>
                                <Options
                                    item="mirrorCabinet"
                                    property="size"
                                    title="SELECT SIZE"
                                    options={mirrorCabinetOptions.sizeOptions}
                                    crrOptionSelected={
                                        currentConfiguration.mirrorCabinet.size
                                    }
                                    onOptionSelected={handleOptionSelected}
                                />
                                <Options
                                    item="mirrorCabinet"
                                    property="finish"
                                    title="SELECT FINISH"
                                    options={mirrorCabinetOptions.finishOptions}
                                    crrOptionSelected={
                                        currentConfiguration.mirrorCabinet
                                            .finish
                                    }
                                    onOptionSelected={handleOptionSelected}
                                />
                            </div>
                        )}
                        {crrMirrorCategory === "ledMirror" && (
                            <div>
                                <button
                                    className={classes.clearButton}
                                    onClick={() => handleClearItem("ledMirror")}
                                >
                                    CLEAR
                                </button>
                                <Options
                                    item="ledMirror"
                                    property="type"
                                    title="SELECT LED MIRROR"
                                    options={ledMirrorOptions}
                                    crrOptionSelected={
                                        currentConfiguration.ledMirror
                                    }
                                    onOptionSelected={handleOptionSelected}
                                />
                            </div>
                        )}
                        {crrMirrorCategory === "openCompMirror" && (
                            <div>
                                <button
                                    className={classes.clearButton}
                                    onClick={() =>
                                        handleClearItem("openCompMirror")
                                    }
                                >
                                    CLEAR
                                </button>
                                <Options
                                    item="openCompMirror"
                                    property="type"
                                    title="SELECT OPEN COMPARMENT MIRROR"
                                    options={openCompMirrorOptions}
                                    crrOptionSelected={
                                        currentConfiguration.openCompMirror
                                    }
                                    onOptionSelected={handleOptionSelected}
                                />
                            </div>
                        )}
                    </section>
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
            <ToastContainer />
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
    sideUnitOptions: margiSideCabinetOptions | margiOpenUnitOptions | null;
}

function SizeUnit({
    composition,
    currentConfiguration,
    handleOptionSelected,
    sideUnitOptions,
}: SizeUnitProps) {
    if (composition.sideUnits[0].descw.includes("8")) {
        const options = sideUnitOptions as margiOpenUnitOptions;
        const sideUnitCurrentConfi =
            currentConfiguration.sideUnit as margiOpenUnit;

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
        const options = sideUnitOptions as margiSideCabinetOptions;
        const sideUnitCurrentConfi =
            currentConfiguration.sideUnit as margiSideCabinet;

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
