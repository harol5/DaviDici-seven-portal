import { Composition } from "../../Models/Composition";
import classes from "../../../css/product-configurator.module.css";
import { act, useEffect, useMemo, useReducer, useState } from "react";
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
    otherMargiProducts,
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

/**
 * TODO;
 * 2. add other products options.
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

    // |====== create objetct that will hold current configuration. if only one option, make it default. ======|
    const initialConfiguration: CurrentConfiguration = useMemo(() => {
        let sideUnit: margiOpenUnit | margiSideCabinet | null = null;
        let sideUnitType = "";

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
            vanity: {
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
            },
            vanitySku: "",
            vanityPrice: 0,
            isDoubleSink: composition.name.includes("DOUBLE"),
            sideUnit,
            sideUnitType,
            sideUnitSku: "",
            sideUnitPrice: 0,
            washbasin: composition.washbasins[0].uscode,
            washbasinPrice: 0,
            wallUnit,
            wallUnitSku: "",
            wallUnitPrice: 0,
            label: "",
        };
    }, []);

    const reducer = (
        state: CurrentConfiguration,
        action: { type: string; payload: string }
    ) => {
        switch (action.type) {
            case "set-vanity-drawer":
                return {
                    ...state,
                    vanity: {
                        ...state.vanity,
                        drawer: action.payload,
                    },
                };

            case "set-vanity-handle":
                return {
                    ...state,
                    vanity: {
                        ...state.vanity,
                        handle: action.payload,
                    },
                };

            case "set-vanity-finish":
                return {
                    ...state,
                    vanity: {
                        ...state.vanity,
                        finish: action.payload,
                    },
                };

            case "set-vanity-sku":
                return {
                    ...state,
                    vanitySku: action.payload,
                };

            case "set-washbasin-type":
                return {
                    ...state,
                    washbasin: action.payload,
                };

            case "set-sideUnit-finish":
                return {
                    ...state,
                    sideUnit: {
                        ...state.sideUnit,
                        finish: action.payload,
                    } as margiOpenUnit | margiSideCabinet,
                };

            case "set-sideUnit-doorStyleAndHandle":
                return {
                    ...state,
                    sideUnit: {
                        ...state.sideUnit,
                        doorStyleAndHandle: action.payload,
                    } as margiSideCabinet,
                };

            case "set-sideUnit-sku":
                return {
                    ...state,
                    sideUnitSku: action.payload,
                };

            case "set-wallUnit-size":
                return {
                    ...state,
                    wallUnit: {
                        ...state.wallUnit,
                        size: action.payload,
                    } as wallUnit,
                };

            case "set-wallUnit-doorStyle":
                return {
                    ...state,
                    wallUnit: {
                        ...state.wallUnit,
                        doorStyle: action.payload,
                    } as wallUnit,
                };

            case "set-wallUnit-finish":
                return {
                    ...state,
                    wallUnit: {
                        ...state.wallUnit,
                        finish: action.payload,
                    } as wallUnit,
                };

            case "set-wallUnit-sku":
                return {
                    ...state,
                    wallUnitSku: action.payload,
                };

            case "reset-configurator":
                return {
                    ...initialConfiguration,
                };

            case "set-label":
                return {
                    ...state,
                    label: action.payload,
                };

            default:
                throw new Error();
        }
    };

    const [currentConfiguration, dispatch] = useReducer(
        reducer,
        initialConfiguration
    );

    const getSkuAndPrice = (
        item: string,
        itemObj: vanity | margiOpenUnit | margiSideCabinet | wallUnit,
        products: ProductInventory[]
    ) => {
        const itemCodesArray = [];
        const obj = { sku: "", price: 0 };

        for (const key in itemObj) {
            const property = key as keyof typeof itemObj;
            const code = itemObj[property];
            if (code) itemCodesArray.push(code);
        }

        console.log("===== getSkuAndPrice ======");
        console.log(item);
        console.log(itemObj);
        console.log(products);
        console.log(itemCodesArray);
        console.log(SkuLengths[item as keyof typeof SkuLengths]);

        if (
            itemCodesArray.length !==
            SkuLengths[item as keyof typeof SkuLengths]
        ) {
            return obj;
        }

        const productSku = itemCodesArray.join("-");

        for (const crrProduct of products) {
            if (crrProduct.uscode === productSku) {
                obj.price = crrProduct.msrp;
                obj.sku = productSku;
                break;
            }
        }
        console.log(obj);
        return obj;
    };

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

            const copyCurrentConfiguration = structuredClone(
                currentConfiguration.vanity
            );

            copyCurrentConfiguration[
                property as keyof typeof copyCurrentConfiguration
            ] = option;

            const skuAndPrice = getSkuAndPrice(
                item,
                copyCurrentConfiguration,
                composition.vanities
            );

            console.log(copyCurrentConfiguration);

            setVanityOptions(copyOptions);
        }

        if (item === "sideUnit") {
            if (composition.sideUnits[0].descw.includes("8")) {
                // const copyOptions = {
                //     ...sideUnitOptions,
                // } as margiOpenUnitOptions;

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

                console.log(copyCurrentConfiguration);

                setSideUnitOptions(copyOptions);
            }

            if (composition.sideUnits[0].descw.includes("16")) {
                // const copyOptions = {
                //     ...sideUnitOptions,
                // } as margiSideCabinetOptions;

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

                console.log(copyCurrentConfiguration);

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

            console.log(copyCurrentConfiguration);

            setWallUnitOptions(copyOptions);
            !wallUnitStatus.isWallUnitSelected &&
                setWallUnitStatus((prev) => ({
                    ...prev,
                    isWallUnitSelected: true,
                }));
        }

        dispatch({ type: `set-${item}-${property}`, payload: `${option}` });
    };

    // Manage grand total
    const [grandTotal, setGrandTotal] = useState(0);

    useEffect(() => {
        // ========================/////////////// REFACTORING THIS PART IN A SINGLE FUNC (getSkuAndPrice) using func inside handleOptionSelected/////////////////////////////////

        const vanityCodesArray = [];
        for (const key in currentConfiguration.vanity) {
            const property = key as keyof typeof currentConfiguration.vanity;
            const code = currentConfiguration.vanity[property];
            if (code) vanityCodesArray.push(code);
        }

        const sideUnitCodesArray = [];
        if (currentConfiguration.sideUnit) {
            for (const key in currentConfiguration.sideUnit) {
                const property =
                    key as keyof typeof currentConfiguration.sideUnit;
                const code = currentConfiguration.sideUnit[property];

                if (code) sideUnitCodesArray.push(code);
            }
        }

        const wallUnitCodesArray = [];
        if (currentConfiguration.wallUnit) {
            for (const key in currentConfiguration.wallUnit) {
                const property =
                    key as keyof typeof currentConfiguration.wallUnit;
                const code = currentConfiguration.wallUnit[property];
                if (code) wallUnitCodesArray.push(code);
            }
        }

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

        const vanitySku = vanityCodesArray.join("-");
        const sideUnitSku = sideUnitCodesArray.join("-");
        const wallUnitSku = wallUnitCodesArray.join("-");

        let vanityMsrp = 0;
        let washbasinMsrp = 0;
        let sideUnitMsrp = 0;
        let wallUnitMsrp = 0;

        for (const crrVanity of composition.vanities) {
            if (crrVanity.uscode === vanitySku) {
                vanityMsrp = crrVanity.msrp;
                break;
            }
        }

        for (const washbasin of composition.washbasins) {
            if (washbasin.uscode === currentConfiguration.washbasin) {
                washbasinMsrp = washbasin.msrp;
                break;
            }
        }

        for (const sideUnit of composition.sideUnits) {
            if (sideUnit.uscode === sideUnitSku) {
                sideUnitMsrp = sideUnit.msrp;
                break;
            }
        }

        for (const wallUnit of composition.otherProductsAvailable.wallUnits) {
            if (wallUnit.uscode === wallUnitSku) {
                wallUnitMsrp = wallUnit.msrp;
                break;
            }
        }

        // ========================////////////////////////////////////////////////

        if (wallUnitMsrp > 0)
            setWallUnitStatus((prev) => ({ ...prev, isWallUnitValid: true }));

        if (currentConfiguration.isDoubleSink) vanityMsrp *= 2;

        if (
            vanityMsrp === 0 ||
            (currentConfiguration.sideUnit && sideUnitMsrp === 0)
        )
            setGrandTotal(0);
        else {
            // dispatch({ type: `set-${item}-${property}`, payload: `${option}` });
            setGrandTotal(
                vanityMsrp + washbasinMsrp + sideUnitMsrp + wallUnitMsrp
            );
        }
    }, [currentConfiguration]);

    // Manage label (repeated logic)
    const [isMissingLabel, setIsMissingLabel] = useState(false);
    const [isInvalidLabel, setIsInvalidLabel] = useState(false);
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

    // Manage order now. // ========================////////////////////////////////////////////////
    const handleOrderNow = () => {
        if (!currentConfiguration.label) {
            toast.error("missing composition name!!");
            setIsMissingLabel(true);
            return;
        }

        if (
            wallUnitStatus.isWallUnitSelected &&
            !wallUnitStatus.isWallUnitValid
        ) {
            alert(
                "Looks like you forgot to select all available wall unit options. Either clear the wall unit section or select the missing option(s). "
            );
            return;
        }

        const vanitySku = Object.values(currentConfiguration.vanity).join("-");
        const sideUnitSku = currentConfiguration.sideUnit
            ? Object.values(currentConfiguration.sideUnit).join("-")
            : "";
        const wallUnitSku = currentConfiguration.wallUnit
            ? Object.values(currentConfiguration.wallUnit).join("-")
            : "";
        const washbasinSku = currentConfiguration.washbasin;

        let SKU;
        if (sideUnitSku && washbasinSku) {
            SKU = `${vanitySku}${
                currentConfiguration.isDoubleSink ? "--2" : "--1"
            }##${
                currentConfiguration.label
            }~${washbasinSku}--1~${sideUnitSku}--1##${
                currentConfiguration.label
            }`;
        }

        if (sideUnitSku && !washbasinSku) {
            SKU = `${vanitySku}${
                currentConfiguration.isDoubleSink ? "--2" : "--1"
            }##${currentConfiguration.label}~${sideUnitSku}--1##${
                currentConfiguration.label
            }`;
        }

        if (!sideUnitSku && washbasinSku) {
            SKU = `${vanitySku}${
                currentConfiguration.isDoubleSink ? "--2" : "--1"
            }##${currentConfiguration.label}~${washbasinSku}--1##${
                currentConfiguration.label
            }`;
        }

        if (!sideUnitSku && !washbasinSku) {
            SKU = `${vanitySku}${
                currentConfiguration.isDoubleSink ? "--2" : "--1"
            }##${currentConfiguration.label}`;
        }

        router.get("/orders/create-so-num", { SKU });
    };

    const handleResetConfigurator = () => {
        setVanityOptions(initialVanityOptions);
        setSideUnitOptions(initialSideUnitOptions);
        setWallUnitOptions(initialWallUnitOptions);
        setGrandTotal(0);
        dispatch({ type: "reset-configurator", payload: "" });
    };

    // Creates object for shopping cart.
    const handleAddToCart = () => {
        if (!currentConfiguration.label) {
            toast.error("missing composition name!!");
            setIsMissingLabel(true);
            return;
        }

        if (
            wallUnitStatus.isWallUnitSelected &&
            !wallUnitStatus.isWallUnitValid
        ) {
            alert(
                "Looks like you forgot to select all available wall unit options. Either clear the wall unit section or select the missing option(s). "
            );
            return;
        }

        const vanitySku = Object.values(currentConfiguration.vanity).join("-");
        const sideUnitSku = currentConfiguration.sideUnit
            ? Object.values(currentConfiguration.sideUnit).join("-")
            : "";
        const washbasinSku = currentConfiguration.washbasin;

        const vanityObj = composition.vanities.find(
            (vanity) => vanity.uscode === vanitySku
        );
        const sideUnitsObj = composition.sideUnits.find(
            (sideUnit) => sideUnit.uscode === sideUnitSku
        );
        const washbasinObj = composition.washbasins.find(
            (washbasin) => washbasin.uscode === washbasinSku
        );

        const shoppingCartObj: shoppingCartProductModel = {
            composition: composition,
            description: composition.name,
            label: currentConfiguration.label,
            vanity: vanityObj!,
            sideUnits: sideUnitsObj ? [sideUnitsObj] : [],
            washbasin: washbasinObj!,
            otherProducts: [],
            isDoubleSink: currentConfiguration.isDoubleSink,
            isDoubleSideunit: false,
            quantity: 1,
            grandTotal: grandTotal,
        };

        onAddToCart(shoppingCartObj);
    };

    console.log("=== margi confg render ===");
    console.log(composition);
    console.log(currentConfiguration);

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
                <Options
                    item="vanity"
                    property="finish"
                    title="SELECT VANITY FINISH"
                    options={vanityOptions.finishOptions}
                    crrOptionSelected={currentConfiguration.vanity.finish}
                    onOptionSelected={handleOptionSelected}
                />
                <Options
                    item="vanity"
                    property="handle"
                    title="SELECT VANITY HANDLES"
                    options={vanityOptions.handleOptions}
                    crrOptionSelected={currentConfiguration.vanity.handle}
                    onOptionSelected={handleOptionSelected}
                />
                <Options
                    item="vanity"
                    property="drawer"
                    title="SELECT VANITY DRAWERS"
                    options={vanityOptions.drawerOptions}
                    crrOptionSelected={currentConfiguration.vanity.drawer}
                    onOptionSelected={handleOptionSelected}
                />
                <SizeUnit
                    composition={composition}
                    currentConfiguration={currentConfiguration}
                    handleOptionSelected={handleOptionSelected}
                    sideUnitOptions={sideUnitOptions}
                />
                <Options
                    item="washbasin"
                    property="type"
                    title="SELECT WASHBASIN"
                    options={washbasinOptions}
                    crrOptionSelected={currentConfiguration.washbasin}
                    onOptionSelected={handleOptionSelected}
                />

                {wallUnitOptions && (
                    <>
                        <Options
                            item="wallUnit"
                            property="size"
                            title="SELECT WALL UNIT SIZE"
                            options={wallUnitOptions.sizeOptions}
                            crrOptionSelected={
                                currentConfiguration.wallUnit!.size
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                        <Options
                            item="wallUnit"
                            property="doorStyle"
                            title="SELECT WALL UNIT DOOR STYLE"
                            options={wallUnitOptions.doorStyleOptions}
                            crrOptionSelected={
                                currentConfiguration.wallUnit!.doorStyle
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                        <Options
                            item="wallUnit"
                            property="finish"
                            title="SELECT WALL UNIT FINISH"
                            options={wallUnitOptions.finishOptions}
                            crrOptionSelected={
                                currentConfiguration.wallUnit!.finish
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                    </>
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
    if (composition.sideUnits.length === 0) return;

    if (composition.sideUnits[0].descw.includes("8")) {
        const options = sideUnitOptions as margiOpenUnitOptions;
        const sideUnitCurrentConfi =
            currentConfiguration.sideUnit as margiOpenUnit;

        return (
            <Options
                item="sideUnit"
                property="finish"
                title="SELECT SIDE UNIT FINISH"
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
                    title="SELECT SIDE UNIT FINISH"
                    options={options.finishOptions}
                    crrOptionSelected={sideUnitCurrentConfi?.finish as string}
                    onOptionSelected={handleOptionSelected}
                />
                <Options
                    item="sideUnit"
                    property="doorStyleAndHandle"
                    title="SELECT SIDE UNIT DOOR STYLE"
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
