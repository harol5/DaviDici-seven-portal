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

interface NewYorkConfiguratorProps {
    composition: Composition;
}

interface SideUnit {
    baseSku: string;
    handle: string;
    position: string;
    finish: string;
}

interface CurrentConfiguration {
    vanity: { baseSku: string; handle: string; finish: string };
    isDoubleSink: boolean;
    sideUnit: SideUnit | null;
    washbasin: string;
}

interface vanityOptions {
    baseSku: string;
    handleOptions: Option[];
    finishOptions: Option[];
}

interface sideUnitOptions {
    baseSku: string;
    handleOptions: Option[];
    position: string;
    finishOptions: Option[];
}

function NewYorkConfigurator({ composition }: NewYorkConfiguratorProps) {
    // iterate over vanitites array and analize sku in order to get the valid options to get final sku. -------------|
    const initialVanityOptions: vanityOptions = useMemo(() => {
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
                    imgUrl: "https://portal.davidici.com/images/express-program/not-image.jpg",
                    title:
                        codes[2] === "VBB" ? "BLACK HANDLE" : "CHROMED HANLDE",
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

    // iterate over washbasin array and created Options array. ----------------------|
    const washbasinOptions: Option[] = useMemo(() => {
        const all: Option[] = [];
        composition.washbasins.forEach((washbasin) => {
            all.push({
                code: washbasin.uscode,
                imgUrl: "https://portal.davidici.com/images/express-program/not-image.jpg",
                title: `${washbasin.model} ${washbasin.finish}`,
                validSkus: [washbasin.uscode],
                isDisabled: false,
            });
        });

        return all;
    }, []);

    // if sideUnits array is not empty
    const initialSideUnitOptions: sideUnitOptions | null = useMemo(() => {
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
                    imgUrl: "https://portal.davidici.com/images/express-program/not-image.jpg",
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

    // create objetct that will hold current configuration. if only one option, make it default. --------------|
    const initialConfiguration: CurrentConfiguration = {
        vanity: {
            baseSku: vanityOptions.baseSku,
            handle:
                vanityOptions.handleOptions.length === 1
                    ? vanityOptions.handleOptions[0].code
                    : "",
            finish:
                vanityOptions.finishOptions.length === 1
                    ? vanityOptions.finishOptions[0].code
                    : "",
        },
        isDoubleSink: composition.name.includes("DOUBLE"),
        sideUnit: sideUnitOptions
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
            : null,
        washbasin: composition.washbasins[0].uscode,
    };

    const reducer = (
        state: CurrentConfiguration,
        action: { type: string; payload: string }
    ) => {
        switch (action.type) {
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

            case "set-sideUnit-handle":
                return {
                    ...state,
                    sideUnit: {
                        ...state.sideUnit,
                        handle: action.payload,
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

            setVanityOptions(copyOptions);
        }

        if (item === "sideUnit") {
            // const copyOptions = { ...sideUnitOptions } as sideUnitOptions;
            const copyOptions = structuredClone(
                sideUnitOptions
            ) as sideUnitOptions;

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

            setSideUnitOptions(copyOptions);
        }

        dispatch({ type: `set-${item}-${property}`, payload: `${option}` });
    };

    // Manage grand total
    const [grandTotal, setGrandTotal] = useState(0);

    useEffect(() => {
        const codesArray = [];
        for (const key in currentConfiguration.vanity) {
            const value =
                currentConfiguration.vanity[
                    key as "baseSku" | "handle" | "finish"
                ];

            if (value) codesArray.push(value);
        }

        const sideUnitCodesArray = [];
        if (currentConfiguration.sideUnit) {
            for (const key in currentConfiguration.sideUnit) {
                const value =
                    currentConfiguration.sideUnit[
                        key as "baseSku" | "finish" | "handle" | "position"
                    ];

                if (value) sideUnitCodesArray.push(value);
            }
        }

        // this means we have a valid vanity sku number;
        if (
            codesArray.length === 3 &&
            (sideUnitCodesArray.length === 4 || !currentConfiguration.sideUnit)
        ) {
            const vanitySku = codesArray.join("-");
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
        if (sideUnitSku) {
            SKU = `${vanitySku}${
                currentConfiguration.isDoubleSink ? "--2" : "--1"
            }~${washbasinSku}--1~${sideUnitSku}--1`;
        } else {
            SKU = `${vanitySku}${
                currentConfiguration.isDoubleSink ? "--2" : "--1"
            }~${washbasinSku}--1`;
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
                <section className={classes.vanitiesAndSideUnitFinishes}>
                    <Options
                        item="vanity"
                        property="finish"
                        title="SELECT VANITY FINISH"
                        options={vanityOptions.finishOptions}
                        crrOptionSelected={currentConfiguration.vanity.finish}
                        onOptionSelected={handleOptionSelected}
                    />
                </section>
            </section>
            <section className={classes.rightSideConfiguratorWrapper}>
                <Options
                    item="vanity"
                    property="handle"
                    title="SELECT VANITY HANDLES"
                    options={vanityOptions.handleOptions}
                    crrOptionSelected={currentConfiguration.vanity.handle}
                    onOptionSelected={handleOptionSelected}
                />
                {sideUnitOptions && (
                    <Options
                        item="sideUnit"
                        property="handle"
                        title="SELECT SIDE UNIT HANDLE"
                        options={sideUnitOptions.handleOptions}
                        crrOptionSelected={
                            currentConfiguration.sideUnit?.handle as string
                        }
                        onOptionSelected={handleOptionSelected}
                    />
                )}
                {sideUnitOptions && (
                    <Options
                        item="sideUnit"
                        property="finish"
                        title="SELECT SIDE UNIT FINISH"
                        options={sideUnitOptions.finishOptions}
                        crrOptionSelected={
                            currentConfiguration.sideUnit?.finish as string
                        }
                        onOptionSelected={handleOptionSelected}
                    />
                )}
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

export default NewYorkConfigurator;
