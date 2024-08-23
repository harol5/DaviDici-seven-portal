import { Composition } from "../../Models/Composition";
import classes from "../../../css/product-configurator.module.css";
import { useEffect, useMemo, useReducer, useState } from "react";
import type {
    Option,
    shoppingCartProduct as shoppingCartProductModel,
} from "../../Models/ExpressProgramModels";
import Options from "./Options";
import { router } from "@inertiajs/react";

/**
 * TODO;
 * 2. add other products options.
 */

interface EloraConfiguratorProps {
    composition: Composition;
    onAddToCart: (shoppingCartProduct: shoppingCartProductModel) => void;
}

interface CurrentConfiguration {
    vanity: { baseSku: string; mattFinish: string; glassFinish: string };
    isDoubleSink: boolean;
    washbasin: string;
}

interface vanityOptions {
    baseSku: string;
    mattFinishOptions: Option[];
    glassFinishOptions: Option[];
}

function EloraConfigurator({
    composition,
    onAddToCart,
}: EloraConfiguratorProps) {
    // iterate over vanitites array and analize sku in order to get the valid options to get final sku. -------------|
    const initialVanityOptions: vanityOptions = useMemo(() => {
        let baseSku: string = "";
        const mattFinishOptionsMap = new Map();
        const glassFinishOptionsMap = new Map();

        composition.vanities.forEach((vanity, index) => {
            const codes = vanity.uscode.split("-");
            // the following logic is only for NEW YORK because each model has a different sku number order.
            // EX: 71 - VB -  024  -  M03  -  V03
            //        base-sku       matt    glass

            // only get base sku from first vanity.
            if (index === 0) {
                baseSku = `${codes[0]}-${codes[1]}-${codes[2]}`;
            }

            let finish = vanity.finish;
            if (vanity.finish.includes("/")) {
                finish = vanity.finish.replace("/", "-");
            }

            if (!mattFinishOptionsMap.has(`${codes[3]}`))
                mattFinishOptionsMap.set(`${codes[3]}`, {
                    code: codes[3],
                    imgUrl: `https://portal.davidici.com/images/express-program/finishes/${finish}.jpg`,
                    title: vanity.finish,
                    validSkus: [],
                    isDisabled: false,
                });

            mattFinishOptionsMap
                .get(`${codes[3]}`)
                .validSkus.push(vanity.uscode);

            if (!glassFinishOptionsMap.has(`${codes[4]}`))
                glassFinishOptionsMap.set(`${codes[4]}`, {
                    code: codes[4],
                    imgUrl: `https://portal.davidici.com/images/express-program/finishes/${finish}.jpg`,
                    title: vanity.finish,
                    validSkus: [],
                    isDisabled: false,
                });

            glassFinishOptionsMap
                .get(`${codes[4]}`)
                .validSkus.push(vanity.uscode);
        });

        return {
            baseSku,
            mattFinishOptions: Object.values(
                Object.fromEntries(mattFinishOptionsMap)
            ),
            glassFinishOptions: Object.values(
                Object.fromEntries(glassFinishOptionsMap)
            ),
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

    // create objetct that will hold current configuration. if only one option, make it default. --------------|
    const initialConfiguration: CurrentConfiguration = {
        vanity: {
            baseSku: vanityOptions.baseSku,
            mattFinish:
                vanityOptions.mattFinishOptions.length === 1
                    ? vanityOptions.mattFinishOptions[0].code
                    : "",
            glassFinish:
                vanityOptions.glassFinishOptions.length === 1
                    ? vanityOptions.glassFinishOptions[0].code
                    : "",
        },
        isDoubleSink: composition.name.includes("DOUBLE"),
        washbasin: composition.washbasins[0].uscode,
    };

    const reducer = (
        state: CurrentConfiguration,
        action: { type: string; payload: string }
    ) => {
        switch (action.type) {
            case "set-vanity-mattFinish":
                return {
                    ...state,
                    vanity: {
                        ...state.vanity,
                        mattFinish: action.payload,
                    },
                };

            case "set-vanity-glassFinish":
                return {
                    ...state,
                    vanity: {
                        ...state.vanity,
                        glassFinish: action.payload,
                    },
                };

            case "set-washbasin-type":
                return {
                    ...state,
                    washbasin: action.payload,
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

            // Checks if any matt option should be disabled.
            for (const mattFinishOption of copyOptions.mattFinishOptions) {
                if (property === "mattFinish") break;
                for (let i = 0; i < mattFinishOption.validSkus.length; i++) {
                    const validSku = mattFinishOption.validSkus[i];
                    if (validSku.includes(option)) {
                        mattFinishOption.isDisabled = false;
                        break;
                    }

                    if (i === mattFinishOption.validSkus.length - 1)
                        mattFinishOption.isDisabled = true;
                }
            }

            // Checks if any glass option should be disabled.
            for (const glassFinishOption of copyOptions.glassFinishOptions) {
                if (property === "glassFinish") break;
                for (let i = 0; i < glassFinishOption.validSkus.length; i++) {
                    const validSku = glassFinishOption.validSkus[i];
                    if (validSku.includes(option)) {
                        glassFinishOption.isDisabled = false;
                        break;
                    }

                    if (i === glassFinishOption.validSkus.length - 1)
                        glassFinishOption.isDisabled = true;
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
                    key as "baseSku" | "mattFinish" | "glassFinish"
                ];

            if (value) codesArray.push(value);
        }

        // this means we have a valid sku number;
        if (codesArray.length === 3) {
            const vanitySku = codesArray.join("-");

            let vanityMsrp = 0;
            let washbasinMsrp = 0;

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

            if (currentConfiguration.isDoubleSink) vanityMsrp *= 2;

            if (vanityMsrp === 0) setGrandTotal(0);
            else setGrandTotal(vanityMsrp + washbasinMsrp);
        }
    }, [currentConfiguration]);

    // Manage order now.
    const handleOrderNow = () => {
        console.log(composition);
        console.log(currentConfiguration);

        const vanitySku = Object.values(currentConfiguration.vanity).join("-");
        const washbasinSku = currentConfiguration.washbasin;

        let SKU;
        if (!washbasinSku) {
            SKU = `${vanitySku}${
                currentConfiguration.isDoubleSink ? "--2" : "--1"
            }`;
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

    // Creates object for shopping cart.
    const handleAddToCart = () => {
        const vanitySku = Object.values(currentConfiguration.vanity).join("-");
        const washbasinSku = currentConfiguration.washbasin;

        const vanityObj = composition.vanities.find(
            (vanity) => vanity.uscode === vanitySku
        );
        const washbasinObj = composition.washbasins.find(
            (washbasin) => washbasin.uscode === washbasinSku
        );

        const shoppingCartObj: shoppingCartProductModel = {
            composition: composition,
            description: composition.name,
            vanity: vanityObj!,
            sideUnits: [],
            washbasin: washbasinObj!,
            otherProducts: [],
            isDoubleSink: currentConfiguration.isDoubleSink,
            isDoubleSideunit: false,
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
                </section>
            </section>
            <section className={classes.rightSideConfiguratorWrapper}>
                <Options
                    item="vanity"
                    property="mattFinish"
                    title="SELECT MATT FINISH"
                    options={vanityOptions.mattFinishOptions}
                    crrOptionSelected={currentConfiguration.vanity.mattFinish}
                    onOptionSelected={handleOptionSelected}
                />
                <Options
                    item="vanity"
                    property="glassFinish"
                    title="SELECT GLASS FINISH"
                    options={vanityOptions.glassFinishOptions}
                    crrOptionSelected={currentConfiguration.vanity.glassFinish}
                    onOptionSelected={handleOptionSelected}
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
                    <button
                        disabled={!grandTotal ? true : false}
                        onClick={handleAddToCart}
                    >
                        ADD TO CART
                    </button>
                </div>
            </section>
        </div>
    );
}

export default EloraConfigurator;
