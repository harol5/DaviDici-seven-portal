import { Composition } from "../../Models/Composition";
import classes from "../../../css/product-configurator.module.css";
import { useEffect, useMemo, useReducer, useState } from "react";
import type { Option } from "../../Models/ExpressProgramModels";
import Options from "./Options";
import { router } from "@inertiajs/react";

/**
 * TODO;
 * 2. add other products options.
 */

interface MargiConfiguratorProps {
    composition: Composition;
}

interface margiOpenUnit {
    baseSku: string;
    finish: string;
}

interface margiSideCabinet {
    baseSku: string;
    doorStyleAndHandle: string;
    finish: string;
}

interface CurrentConfiguration {
    vanity: { baseSku: string; drawer: string; handle: string; finish: string };
    isDoubleSink: boolean;
    sideUnit: margiOpenUnit | margiSideCabinet | null;
    washbasin: string;
}

interface vanityOptions {
    baseSku: string;
    drawerOptions: Option[];
    handleOptions: Option[];
    finishOptions: Option[];
}
interface margiOpenUnitOptions {
    baseSku: string;
    finishOptions: Option[];
}
interface margiSideCabinetOptions {
    baseSku: string;
    doorStyleAndHandleOptions: Option[];
    finishOptions: Option[];
}

function MargiConfigurator({ composition }: MargiConfiguratorProps) {
    // iterate over vanitites array and analize sku in order to get the valid options to get final sku. -------------|
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
                    imgUrl: `https://portal.davidici.com/images/express-program/MARGI/options/${
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

            if (!finishOptionsMap.has(`${codes[4]}`))
                finishOptionsMap.set(`${codes[4]}`, {
                    code: codes[4],
                    imgUrl: `https://portal.davidici.com/images/express-program/finishes/${vanity.finish}.jpg`,
                    title: vanity.finish,
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

    // iterate over washbasin array and created Options array. ----------------------|
    // this logic is the same for the other collection. mMUST CREATE A FUNTION THAT WRAPS TO AVOID REPETICION.
    const washbasinOptions: Option[] = useMemo(() => {
        const all: Option[] = [];
        composition.washbasins.forEach((washbasin) => {
            all.push({
                code: washbasin.uscode,
                imgUrl: `https://portal.davidici.com/images/express-program/washbasins/${washbasin.uscode}.webp`,
                title: `${washbasin.model} ${washbasin.finish}`,
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

    // if sideUnits array is not empty
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
                    let iniTitle = codes[3].includes("F")
                        ? "FRAME"
                        : codes[3].includes("S")
                        ? "STRIPES"
                        : codes[3].includes("G")
                        ? "GRID"
                        : codes[3].includes("P")
                        ? "PLAIN"
                        : "";
                    iniTitle += codes[3].includes("1")
                        ? " W/ BLACK HANDLE"
                        : " W/ POLISH HANDLE";

                    doorStyleAndHandleOptionsMap.set(`${codes[3]}`, {
                        code: codes[3],
                        imgUrl: "https://portal.davidici.com/images/express-program/not-image.jpg",
                        title: iniTitle,
                        validSkus: [],
                        isDisabled: false,
                    });
                }
                doorStyleAndHandleOptionsMap
                    .get(`${codes[3]}`)
                    .validSkus.push(sideUnit.uscode);

                if (!finishOptionsMap.has(`${codes[4]}`))
                    finishOptionsMap.set(`${codes[4]}`, {
                        code: codes[4],
                        imgUrl: `https://portal.davidici.com/images/express-program/finishes/${sideUnit.finish}.jpg`,
                        title: sideUnit.finish,
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

    // create objetct that will hold current configuration. if only one option, make it default. --------------|
    const initialConfiguration: CurrentConfiguration = useMemo(() => {
        let sideUnit: margiOpenUnit | margiSideCabinet | null = null;
        if (sideUnitOptions) {
            if (composition.sideUnits[0].descw.includes("8")) {
                const margiOpenUnitOptions =
                    sideUnitOptions as margiOpenUnitOptions;
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
            isDoubleSink: composition.name.includes("DOUBLE"),
            sideUnit: sideUnit,
            washbasin: composition.washbasins[0].uscode,
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

            case "reset-configurator":
                return {
                    ...initialConfiguration,
                };

            default:
                throw new Error();
        }
    };

    const [currentConfiguration, dispatch] = useReducer(
        reducer,
        initialConfiguration
    );

    // |====== Events ======|
    const handleOptionSelected = (
        item: string,
        property: string,
        option: string
    ) => {
        if (item === "vanity") {
            // const copyOptions = { ...vanityOptions };
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

                setSideUnitOptions(copyOptions);
            }
        }

        dispatch({ type: `set-${item}-${property}`, payload: `${option}` });
    };

    // Manage grand total
    const [grandTotal, setGrandTotal] = useState(0);

    useEffect(() => {
        const vanityCodesArray = [];
        for (const key in currentConfiguration.vanity) {
            const value =
                currentConfiguration.vanity[
                    key as "baseSku" | "drawer" | "handle" | "finish"
                ];

            if (value) vanityCodesArray.push(value);
        }

        const sideUnitCodesArray = [];
        if (currentConfiguration.sideUnit) {
            for (const key in currentConfiguration.sideUnit) {
                const value =
                    currentConfiguration.sideUnit[key as "baseSku" | "finish"];

                if (value) sideUnitCodesArray.push(value);
            }
        }

        // this means we have a valid vanity sku number;
        if (
            vanityCodesArray.length === 4 &&
            (sideUnitCodesArray.length === 2 ||
                sideUnitCodesArray.length === 3 ||
                !currentConfiguration.sideUnit)
        ) {
            const vanitySku = vanityCodesArray.join("-");
            const sideUnitSku = sideUnitCodesArray.join("-");

            let vanityMsrp = 0;
            let washbasinMsrp = 0;
            let sideUnitMsrp = 0;

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

            if (currentConfiguration.isDoubleSink) vanityMsrp *= 2;

            if (vanityMsrp === 0) setGrandTotal(0);
            else setGrandTotal(vanityMsrp + washbasinMsrp + sideUnitMsrp);
        }
    }, [currentConfiguration]);

    // Manage order now.
    const handleOrderNow = () => {
        console.log(composition);
        console.log(currentConfiguration);

        const vanitySku = Object.values(currentConfiguration.vanity).join("-");
        const sideUnitSku = currentConfiguration.sideUnit
            ? Object.values(currentConfiguration.sideUnit).join("-")
            : "";
        const washbasinSku = currentConfiguration.washbasin;

        let SKU;
        if (sideUnitSku && washbasinSku) {
            SKU = `${vanitySku}${
                currentConfiguration.isDoubleSink ? "--2" : "--1"
            }~${washbasinSku}--1~${sideUnitSku}--1`;
        }

        if (sideUnitSku && !washbasinSku) {
            SKU = `${vanitySku}${
                currentConfiguration.isDoubleSink ? "--2" : "--1"
            }~${sideUnitSku}--1`;
        }

        if (!sideUnitSku && washbasinSku) {
            SKU = `${vanitySku}${
                currentConfiguration.isDoubleSink ? "--2" : "--1"
            }~${washbasinSku}--1`;
        }

        if (!sideUnitSku && !washbasinSku) {
            SKU = `${vanitySku}${
                currentConfiguration.isDoubleSink ? "--2" : "--1"
            }`;
        }

        console.log(SKU);

        router.get("/orders/create-so-num", { SKU });
    };

    const handleResetConfigurator = () => {
        setVanityOptions(initialVanityOptions);
        setSideUnitOptions(initialSideUnitOptions);
        setGrandTotal(0);
        dispatch({ type: "reset-configurator", payload: "" });
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
                <div className={classes.grandTotalAndOrderNowButtonWrapper}>
                    <div className={classes.grandTotalWrapper}>
                        <h1 className={classes.label}>Grand Total:</h1>
                        <span className={classes.amount}>${grandTotal}</span>
                    </div>
                    <button
                        disabled={!grandTotal ? true : false}
                        onClick={handleOrderNow}
                    >
                        ORDER NOW
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
