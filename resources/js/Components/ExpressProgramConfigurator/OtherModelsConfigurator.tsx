import { Composition } from "../../Models/Composition";
import classes from "../../../css/product-configurator.module.css";
import { useEffect, useMemo, useReducer, useState } from "react";
import type { Option } from "../../Models/ExpressProgramModels";
import Options from "./Options";

/**
 * TODO;
 * 1. logic for "order now" button.
 * 2. add other products options.
 */

interface OtherModelsConfiguratorProps {
    composition: Composition;
}

interface CurrentConfiguration {
    vanity: { baseSku: string; finish: string };
    sideUnit: string | null;
    washbasin: string;
}

interface vanityOptions {
    baseSku: string;
    finishOptions: Option[];
}

function OtherModelsConfigurator({
    composition,
}: OtherModelsConfiguratorProps) {
    // iterate over vanitites array and analize sku in order to get the valid options to get final sku. -------------|
    const initialVanityOptions: vanityOptions = useMemo(() => {
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
    const sideUnitOptions: Option[] = useMemo(() => {
        const all: Option[] = [];
        if (composition.sideUnits.length === 0) return all;

        composition.sideUnits.forEach((sideUnit) => {
            all.push({
                code: sideUnit.uscode,
                imgUrl: "https://portal.davidici.com/images/express-program/not-image.jpg",
                title: `${sideUnit.descw}`,
                validSkus: [sideUnit.uscode],
                isDisabled: false,
            });
        });

        return all;
    }, []);

    // create objetct that will hold current configuration. if only one option, make it default. --------------|
    const initialConfiguration: CurrentConfiguration = {
        vanity: {
            baseSku: vanityOptions.baseSku,
            finish:
                vanityOptions.finishOptions.length === 1
                    ? vanityOptions.finishOptions[0].code
                    : "",
        },
        sideUnit:
            composition.sideUnits.length > 0
                ? composition.sideUnits[0].uscode
                : null,
        washbasin: composition.washbasins[0].uscode,
    };

    const reducer = (
        state: CurrentConfiguration,
        action: { type: string; payload: string }
    ) => {
        switch (action.type) {
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

            case "set-sideUnit-type":
                return {
                    ...state,
                    sideUnit: action.payload,
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
            const copyOptions = { ...vanityOptions };

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
                currentConfiguration.vanity[key as "baseSku" | "finish"];

            if (value) codesArray.push(value);
        }

        // this means we have a valid vanity sku number;
        if (codesArray.length === 2) {
            const vanitySku = codesArray.join("-");

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

            if (sideUnitOptions.length !== 0) {
                for (const sideUnit of composition.sideUnits) {
                    if (sideUnit.uscode === currentConfiguration.sideUnit) {
                        sideUnitMsrp = sideUnit.msrp;
                        break;
                    }
                }
            }

            setGrandTotal(vanityMsrp + washbasinMsrp + sideUnitMsrp);
        }
    }, [currentConfiguration]);

    // Manage order now.
    const handleOrderNow = () => {
        console.log(composition);
        console.log(vanityOptions);
        console.log(sideUnitOptions);
        console.log(washbasinOptions);
        console.log(currentConfiguration);
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
                        title="SELECT FINISH"
                        options={vanityOptions.finishOptions}
                        crrOptionSelected={currentConfiguration.vanity.finish}
                        onOptionSelected={handleOptionSelected}
                    />
                </section>
            </section>
            <section className={classes.rightSideConfiguratorWrapper}>
                {sideUnitOptions.length !== 0 && (
                    <Options
                        item="sideUnit"
                        property="type"
                        title="SELECT SIDE UNIT"
                        options={sideUnitOptions}
                        crrOptionSelected={
                            currentConfiguration.sideUnit as string
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

export default OtherModelsConfigurator;
