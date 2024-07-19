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

interface NewBaliConfiguratorProps {
    composition: Composition;
}

interface CurrentConfiguration {
    vanity: {
        baseSku: string;
        drawer: string;
        vanityBase: string;
        finish: string;
    };
    isDoubleSink: boolean;
    sideUnit: { baseSku: string; finish: string } | null;
    washbasin: string;
}

interface vanityOptions {
    baseSku: string;
    drawerOptions: Option[];
    vanityBaseOptions: Option[];
    finishOptions: Option[];
}

interface sideUnitOptions {
    baseSku: string;
    finishOptions: Option[];
}

function NewBaliConfigurator({ composition }: NewBaliConfiguratorProps) {
    // iterate over vanitites array and analize sku in order to get the valid options to get final sku. -------------|
    const initialVanityOptions: vanityOptions = useMemo(() => {
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

            if (!drawerOptionsMap.has(`${codes[1]}`))
                drawerOptionsMap.set(`${codes[1]}`, {
                    code: codes[1],
                    imgUrl: "https://portal.davidici.com/images/express-program/not-image.jpg",
                    title: codes[1].includes("D") ? "2 DRAWERS" : "1 DRAWER",
                    validSkus: [],
                    isDisabled: false,
                });

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

    // iterate over washbasin array and created Options array. ----------------------|
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

        return all;
    }, []);

    // if sideUnits array is not empty
    const sideUnitOptions: sideUnitOptions | null = useMemo(() => {
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
                    imgUrl: `https://portal.davidici.com/images/express-program/finishes/${sideUnit.finish}.jpg`,
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

    // create objetct that will hold current configuration. if only one option, make it default. --------------|
    const initialConfiguration: CurrentConfiguration = {
        vanity: {
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
        },
        isDoubleSink: composition.name.includes("DOUBLE"),
        sideUnit: sideUnitOptions
            ? {
                  baseSku: sideUnitOptions.baseSku,
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
            case "set-vanity-drawer":
                return {
                    ...state,
                    vanity: {
                        ...state.vanity,
                        drawer: action.payload,
                    },
                };

            case "set-vanity-vanityBase":
                return {
                    ...state,
                    vanity: {
                        ...state.vanity,
                        vanityBase: action.payload,
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
                    } as { baseSku: string; finish: string },
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

            setVanityOptions(copyOptions);
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
                    key as "baseSku" | "drawer" | "vanityBase" | "finish"
                ];

            if (value) codesArray.push(value);
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
            codesArray.length === 4 &&
            (sideUnitCodesArray.length === 2 || !currentConfiguration.sideUnit)
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
                    property="drawer"
                    title="SELECT VANITY DRAWERS"
                    options={vanityOptions.drawerOptions}
                    crrOptionSelected={currentConfiguration.vanity.drawer}
                    onOptionSelected={handleOptionSelected}
                />
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

export default NewBaliConfigurator;
