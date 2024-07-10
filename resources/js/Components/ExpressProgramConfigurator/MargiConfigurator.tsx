import { Composition } from "../../Models/Composition";
import classes from "../../../css/product-configurator.module.css";
import { useMemo, useReducer } from "react";
import type { Option } from "../../Models/ExpressProgramModels";
import Options from "./Options";

/**
 * TODO;
 *
 * SOMEHOW I NEED DISABLE OPTIONS THAT ARE NOT AVAILABLE DEPENDING ON CURRENT CONFIG, FOR EXAMPLE:
 * POLISH HANDLE IS ONLY AVAIABLE IF USER CHOOSE SAGE GREEN FINISH.
 *
 * MUST CREATE A RESET BUTTON FOR EACH OPTION.
 */

interface MargiConfiguratorProps {
    composition: Composition;
}

interface CurrentConfiguration {
    vanity: { baseSku: string; drawer: string; handle: string; finish: string };
    washbasin: string;
}

interface vanityOptions {
    baseSku: string;
    drawerOptions: Option[];
    handleOptions: Option[];
    finishOptions: Option[];
}

function MargiConfigurator({ composition }: MargiConfiguratorProps) {
    // iterate over vanitites array and analize sku in order to get the valid options to get final sku.
    const vanityOptions: vanityOptions = useMemo(() => {
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
                    imgUrl: "https://seven.test/images/express-program/not-image.jpg",
                    title: codes[2].includes("D") ? "2 DRAWERS" : "1 DRAWER",
                });

            if (!handleOptionsMap.has(`${codes[3]}`))
                handleOptionsMap.set(`${codes[3]}`, {
                    code: codes[3],
                    imgUrl: "https://seven.test/images/express-program/not-image.jpg",
                    title: codes[3].includes("1")
                        ? "BLACK HANDLE"
                        : "POLISH HANLDE",
                });

            if (!finishOptionsMap.has(`${codes[4]}`))
                finishOptionsMap.set(`${codes[4]}`, {
                    code: codes[4],
                    imgUrl: "https://seven.test/images/express-program/not-image.jpg",
                    title: vanity.finish,
                });
        });

        return {
            baseSku,
            drawerOptions: Object.values(Object.fromEntries(drawerOptionsMap)),
            handleOptions: Object.values(Object.fromEntries(handleOptionsMap)),
            finishOptions: Object.values(Object.fromEntries(finishOptionsMap)),
        };
    }, []);

    const washbasinOptions: Option[] = useMemo(() => {
        const all: Option[] = [];
        composition.washbasins.forEach((washbasin, index) => {
            all.push({
                code: washbasin.uscode,
                imgUrl: "https://seven.test/images/express-program/not-image.jpg",
                title: `${washbasin.model} ${washbasin.finish}`,
            });
        });

        return all;
    }, []);

    // create objetct that will hold current configuration. if only one option, make default.
    const initialConfiguration: CurrentConfiguration = {
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
            finish:
                vanityOptions.finishOptions.length === 1
                    ? vanityOptions.finishOptions[0].code
                    : "",
        },
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

            default:
                throw new Error();
        }
    };

    const [currentConfiguration, dispatch] = useReducer(
        reducer,
        initialConfiguration
    );

    const handleOptionSelected = (
        item: string,
        property: string,
        option: string
    ) => {
        dispatch({ type: `set-${item}-${property}`, payload: `${option}` });
    };

    console.log("----------------");
    console.log(vanityOptions);
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
                </section>
                <section className={classes.compositionImageWrapper}>
                    <img
                        src={composition.compositionImage}
                        alt="product images"
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
                <Options
                    item="washbasin"
                    property="type"
                    title="SELECT WASHBASIN"
                    options={washbasinOptions}
                    crrOptionSelected={currentConfiguration.washbasin}
                    onOptionSelected={handleOptionSelected}
                />
            </section>
        </div>
    );
}

export default MargiConfigurator;
