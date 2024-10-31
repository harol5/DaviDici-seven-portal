import { useMemo } from "react";
import { ProductInventory } from "../Models/Product";
import { Composition } from "../Models/Composition";
import {
    FinishObj,
    ModelObj,
    SinkPositionObj,
    OtherProductsAvailable,
    ModelsAvailable,
    ModelsAvailableKeys,
    ExpressProgramMaps,
} from "../Models/ExpressProgramModels";

function useExpressProgramProducts(
    rawProducts: ProductInventory[],
    isOnSale = false
) {
    const createProductsTree = (): ExpressProgramMaps => {
        const vanitiesAndSideUnitsMap = new Map();
        const otherProductsMap = new Map();
        const validCompositionSizesMap = new Map();
        const sharedItemsMap = new Map();

        for (const product of rawProducts) {
            if (isOnSale && !product.sprice) continue;

            if (product.item === "VANITY" || product.item === "SIDE UNIT") {
                if (!vanitiesAndSideUnitsMap.has(product.item))
                    vanitiesAndSideUnitsMap.set(product.item, new Map());

                const sizesMap = vanitiesAndSideUnitsMap.get(product.item);
                if (!sizesMap.has(product.size))
                    sizesMap.set(product.size, new Map());

                const modelMap = sizesMap.get(product.size);

                if (
                    product.model === "NEW YORK" &&
                    product.item === "SIDE UNIT"
                ) {
                    if (!modelMap.has(product.model))
                        modelMap.set(product.model, new Map());

                    const sideUnitPositionMap = modelMap.get(product.model);
                    const position = product.descw.match(/\bLEFT\b|\bRIGHT\b/);

                    if (position) {
                        if (!sideUnitPositionMap.has(position[0]))
                            sideUnitPositionMap.set(position[0], []);
                        sideUnitPositionMap.get(position[0]).push(product);
                    }
                } else if (
                    product.model === "MARGI" &&
                    product.item === "VANITY"
                ) {
                    // MARGI needs to be narrow down further because of variations of door style.
                    if (!modelMap.has(product.model))
                        modelMap.set(product.model, new Map());

                    const doorStyleMap = modelMap.get(product.model);
                    const doorStyle = product.descw.match(
                        /\bGRID\b|\bPLAIN\b|\bFRAME\b|\bSTRIPES\b/
                    );

                    if (doorStyle) {
                        if (!doorStyleMap.has(doorStyle[0]))
                            doorStyleMap.set(doorStyle[0], []);
                        doorStyleMap.get(doorStyle[0]).push(product);
                    }
                } else {
                    if (!modelMap.has(product.model))
                        modelMap.set(product.model, []);

                    modelMap.get(product.model).push(product);
                }
            } else {
                if (ModelsAvailable[product.model as ModelsAvailableKeys]) {
                    if (!otherProductsMap.has(product.model))
                        otherProductsMap.set(product.model, new Map());

                    const itemsMap = otherProductsMap.get(product.model);
                    if (!itemsMap.has(product.item))
                        itemsMap.set(product.item, []);

                    itemsMap.get(product.item).push(product);
                } else {
                    if (!sharedItemsMap.has(product.item))
                        sharedItemsMap.set(product.item, []);

                    sharedItemsMap.get(product.item).push(product);
                }
            }

            // adds valid sizes composition to the map so we can use later.
            if (product.item === "WASHBASIN/SINK") {
                if (!validCompositionSizesMap.has(product.size))
                    validCompositionSizesMap.set(product.size, new Map());

                const sinkPositionsMap = validCompositionSizesMap.get(
                    product.size
                );

                // checks if washbasin must have a side unit included.
                const sinkBreakdownMeasurement = product.descw.match(
                    /\(\d+(\+\d+)+\)|\bDOUBLE SINK\b/
                );

                if (sinkBreakdownMeasurement) {
                    if (!sinkPositionsMap.has(sinkBreakdownMeasurement[0]))
                        sinkPositionsMap.set(
                            sinkBreakdownMeasurement[0],
                            new Map()
                        );

                    const sinkPosition = sinkPositionsMap.get(
                        sinkBreakdownMeasurement[0]
                    );

                    const sinkConfig = product.descw.match(
                        /\bLEFT\b|\bRIGHT\b|\bDOUBLE\b|\bCENTERED\b/
                    );

                    if (sinkConfig) {
                        if (!sinkPosition.has(sinkConfig[0]))
                            sinkPosition.set(sinkConfig[0], []);

                        sinkPosition.get(sinkConfig[0]).push(product);

                        if (sinkConfig[0] === "CENTERED") {
                            if (!sinkPositionsMap.has("CENTERED"))
                                sinkPositionsMap.set("CENTERED", []);

                            sinkPositionsMap.get("CENTERED").push(product);
                        }
                    }
                } else {
                    if (!sinkPositionsMap.has("CENTERED"))
                        sinkPositionsMap.set("CENTERED", []);

                    sinkPositionsMap.get("CENTERED").push(product);
                }
            }
        }

        return {
            vanitiesAndSideUnitsMap,
            validCompositionSizesMap,
            otherProductsMap,
            sharedItemsMap,
        };
    };

    const generateFinishes = (
        listOfVanities: ProductInventory[],
        finishesForFilterMap: Map<string, FinishObj>
    ): FinishObj[] => {
        const listOfFinishesMap = new Map();

        // add finishes to use in filter and composition.
        listOfVanities.forEach((vanity: ProductInventory) => {
            let finish = vanity.finish;

            if (vanity.finish.includes("/")) {
                finish = vanity.finish.replace("/", "-");
            }

            const finishObj = {
                type: vanity.fintype,
                finish: finish,
                url: `https://portal.davidici.com/images/express-program/finishes/${finish}.jpg`,
            };

            if (!listOfFinishesMap.has(finish))
                listOfFinishesMap.set(finish, finishObj);

            if (!finishesForFilterMap.has(finish))
                finishesForFilterMap.set(finish, finishObj);
        });

        return Object.values(Object.fromEntries(listOfFinishesMap));
    };

    const generateOtherProductsObj = (
        otherProducts: Map<string, Map<string, ProductInventory[]>>,
        sharedItemsMap: Map<string, ProductInventory[]>,
        model: string
    ) => {
        const otherProductsObj: OtherProductsAvailable = {
            accessories: [],
            drawersVanities: [],
            mirrors: [],
            tallUnitsLinenClosets: [],
            tops: [],
            vesselSinks: [],
            wallUnits: [],
        };

        if (otherProducts.has(model)) {
            const itemsMap: Map<string, ProductInventory[]> =
                otherProducts.get(model)!;

            const LacqTops = sharedItemsMap.get("TOP") ?? [];
            const modelTops = itemsMap.get("TOP") ?? [];
            otherProductsObj.tops = [...modelTops, ...LacqTops];

            otherProductsObj.accessories = itemsMap.get("ACCESSORY") ?? [];

            otherProductsObj.drawersVanities =
                itemsMap.get("DRAWER/VANITY") ?? [];

            otherProductsObj.tallUnitsLinenClosets =
                itemsMap.get("TALL UNIT/LINEN CLOSET") ?? [];

            otherProductsObj.wallUnits = itemsMap.get("WALL UNIT") ?? [];
        }

        otherProductsObj.mirrors = sharedItemsMap.get("MIRROR") ?? [];
        otherProductsObj.vesselSinks = sharedItemsMap.get("VESSEL SINK") ?? [];

        return otherProductsObj;
    };

    const generateCenteredSinkCompositions = (
        listOfVanities: ProductInventory[],
        finishesForFilterMap: Map<string, FinishObj>,
        sinkPositionsForFilterMap: Map<string, SinkPositionObj>,
        compositions: Composition[],
        model: string,
        size: string,
        sinkPositionMeasure: string,
        washbasingAvailable: ProductInventory[],
        otherProducts: Map<string, Map<string, ProductInventory[]>>,
        sharedItemsMap: Map<string, ProductInventory[]>
    ) => {
        const vanities = listOfVanities.sort(
            (a: ProductInventory, b: ProductInventory) => a.msrp - b.msrp
        );

        const washbasins = washbasingAvailable.sort(
            (a: ProductInventory, b: ProductInventory) => a.msrp - b.msrp
        );

        const finishes = generateFinishes(listOfVanities, finishesForFilterMap);

        sinkPositionsForFilterMap.set(sinkPositionMeasure, {
            name: sinkPositionMeasure,
            url: `https://portal.davidici.com/images/express-program/sink-position/${sinkPositionMeasure}.webp`,
        });

        const getStartingPrice = () => {
            const vanityPrice = vanities[0].sprice
                ? vanities[0].sprice
                : vanities[0].msrp;

            let washbasinPrice = 0;
            if (washbasins.length !== 0) {
                washbasinPrice = washbasins[0].sprice
                    ? washbasins[0].sprice
                    : washbasins[0].msrp;
            }

            return vanityPrice + washbasinPrice;
        };

        const getName = () => {
            let base = `${model} ${size}"`;
            base +=
                washbasins.length !== 0
                    ? ` Incl a ${washbasins[0].model} SINK`
                    : "";
            return base;
        };

        // Add constructed composition to array.
        compositions.push({
            model: model,
            name: getName(),
            compositionImage: `https://${location.hostname}/images/express-program/${model}/${size}.webp`,
            size: size,
            sinkPosition: sinkPositionMeasure,
            startingPrice: getStartingPrice(),
            vanities,
            finishes,
            sideUnits: [],
            washbasins,
            otherProductsAvailable: generateOtherProductsObj(
                otherProducts,
                sharedItemsMap,
                model
            ),
        });
    };

    const generateCenteredSinkMargiCompositions = (
        doorStylesMap: Map<string, ProductInventory[]>,
        finishesForFilterMap: Map<string, FinishObj>,
        sinkPositionsForFilterMap: Map<string, SinkPositionObj>,
        compositions: Composition[],
        model: string,
        size: string,
        sinkPositionMeasure: string,
        washbasingAvailable: ProductInventory[],
        otherProducts: Map<string, Map<string, []>>,
        sharedItemsMap: Map<string, ProductInventory[]>
    ) => {
        for (const [doorStyle, margiVanityList] of doorStylesMap) {
            const finishes = generateFinishes(
                margiVanityList,
                finishesForFilterMap
            );

            const washbasins = washbasingAvailable.sort(
                (a: ProductInventory, b: ProductInventory) => a.msrp - b.msrp
            );

            sinkPositionsForFilterMap.set(sinkPositionMeasure, {
                name: sinkPositionMeasure,
                url: `https://portal.davidici.com/images/express-program/sink-position/${sinkPositionMeasure}.webp`,
            });

            const vanities = margiVanityList.sort(
                (a: ProductInventory, b: ProductInventory) => a.msrp - b.msrp
            );

            const getStartingPrice = () => {
                const vanityPrice = vanities[0].sprice
                    ? vanities[0].sprice
                    : vanities[0].msrp;

                const washbasinPrice = washbasins[0].sprice
                    ? washbasins[0].sprice
                    : washbasins[0].msrp;

                return vanityPrice + washbasinPrice;
            };

            // Add constructed composition to array.
            compositions.push({
                model: model,
                name: `${model} ${size}" - ${doorStyle} DOOR Incl a ${washbasins[0].model} SINK`,
                compositionImage: `https://portal.davidici.com/images/express-program/${model}/${size}-${doorStyle}.webp`,
                size: size,
                sinkPosition: sinkPositionMeasure,
                startingPrice: getStartingPrice(),
                vanities,
                finishes,
                sideUnits: [],
                washbasins,
                otherProductsAvailable: generateOtherProductsObj(
                    otherProducts,
                    sharedItemsMap,
                    model
                ),
            });
        }
    };

    const generateComplexCompositions = (
        itemsMap: Map<string, any>,
        finishesForFilterMap: Map<string, FinishObj>,
        sinkPositionsForFilterMap: Map<string, SinkPositionObj>,
        compositions: Composition[],
        model: string,
        size: string,
        sinkPositionMeasure: string,
        position: string,
        washbasingAvailable: ProductInventory[],
        otherProducts: Map<string, Map<string, []>>,
        sharedItemsMap: Map<string, ProductInventory[]>
    ) => {
        const vanities = itemsMap
            .get("VANITY")
            .sort(
                (a: ProductInventory, b: ProductInventory) => a.msrp - b.msrp
            );

        const finishes = generateFinishes(vanities, finishesForFilterMap);

        sinkPositionsForFilterMap.set(position, {
            name: position,
            url: `https://portal.davidici.com/images/express-program/sink-position/${position}.webp`,
        });

        const washbasins = washbasingAvailable.sort(
            (a: ProductInventory, b: ProductInventory) => a.msrp - b.msrp
        );

        let sideUnits: ProductInventory[] = [];
        if (itemsMap.has("SIDE UNIT")) sideUnits = itemsMap.get("SIDE UNIT");

        if (model === "NEW YORK" && itemsMap.has("SIDE UNIT")) {
            const actualPosition =
                position === "LEFT"
                    ? "RIGHT"
                    : position === "RIGHT"
                    ? "LEFT"
                    : "";
            sideUnits = itemsMap.get("SIDE UNIT").get(actualPosition);
        }

        if (
            model === "NEW YORK" &&
            itemsMap.has("SIDE UNIT") &&
            sinkPositionMeasure === "(12+24+12)"
        ) {
            sideUnits = [
                ...itemsMap.get("SIDE UNIT").get("LEFT"),
                ...itemsMap.get("SIDE UNIT").get("RIGHT"),
            ];
        }

        if (model === "NEW YORK" && sinkPositionMeasure === "(24+12+24)") {
            sideUnits = [
                ...itemsMap.get("SIDE UNIT").get("LEFT"),
                ...itemsMap.get("SIDE UNIT").get("RIGHT"),
            ];
        }

        const getStartingPrice = () => {
            const vanityPrice = vanities[0].sprice
                ? vanities[0].sprice
                : vanities[0].msrp;

            const vanityFinalPrice =
                position === "DOUBLE" ? vanityPrice * 2 : vanityPrice;

            const washbasinPrice = washbasins[0].sprice
                ? washbasins[0].sprice
                : washbasins[0].msrp;

            if (sideUnits && sideUnits.length !== 0) {
                sideUnits.sort(
                    (a: ProductInventory, b: ProductInventory) =>
                        a.msrp - b.msrp
                );

                const sideUnitPrice = sideUnits[0].sprice
                    ? sideUnits[0].sprice
                    : sideUnits[0].msrp;

                const sideUnitFinalPrice =
                    sinkPositionMeasure === "(12+24+12)"
                        ? sideUnitPrice * 2
                        : sideUnitPrice;

                return vanityFinalPrice + washbasinPrice + sideUnitFinalPrice;
            }

            return vanityFinalPrice + washbasinPrice;
        };

        // Add constructed composition to array.
        compositions.push({
            model: model,
            name: `${model} ${size}" ${sinkPositionMeasure} Incl a ${washbasins[0].model} ${position} SINK`,
            compositionImage: `https://${location.hostname}/images/express-program/${model}/${sinkPositionMeasure} ${position} SINK.webp`,
            size: size,
            sinkPosition: position,
            startingPrice: getStartingPrice(),
            vanities,
            finishes,
            sideUnits: sideUnits ?? [],
            washbasins,
            otherProductsAvailable: generateOtherProductsObj(
                otherProducts,
                sharedItemsMap,
                model
            ),
        });
    };

    const generateComplexMargiCompositions = (
        itemsMap: Map<string, any>,
        finishesForFilterMap: Map<string, FinishObj>,
        sinkPositionsForFilterMap: Map<string, SinkPositionObj>,
        compositions: Composition[],
        model: string,
        size: string,
        sinkPositionMeasure: string,
        position: string,
        washbasingAvailable: ProductInventory[],
        otherProducts: Map<string, Map<string, []>>,
        sharedItemsMap: Map<string, ProductInventory[]>
    ) => {
        const doorStylesMap = itemsMap.get("VANITY");
        const sideUnits = itemsMap.get("SIDE UNIT") ?? [];

        for (const [doorStyle, margiVanitiesList] of doorStylesMap) {
            const vanities = margiVanitiesList.sort(
                (a: ProductInventory, b: ProductInventory) => a.msrp - b.msrp
            );

            const finishes = generateFinishes(vanities, finishesForFilterMap);

            sinkPositionsForFilterMap.set(position, {
                name: position,
                url: `https://seven.test/images/express-program/sink-position/${position}.webp`,
            });

            const washbasins = washbasingAvailable.sort(
                (a: ProductInventory, b: ProductInventory) => a.msrp - b.msrp
            );

            const getStartingPrice = () => {
                const vanityPrice = vanities[0].sprice
                    ? vanities[0].sprice
                    : vanities[0].msrp;

                const vanityFinalPrice =
                    position === "DOUBLE" ? vanityPrice * 2 : vanityPrice;

                const washbasinPrice = washbasins[0].sprice
                    ? washbasins[0].sprice
                    : washbasins[0].msrp;

                if (sideUnits.length !== 0) {
                    sideUnits.sort(
                        (a: ProductInventory, b: ProductInventory) =>
                            a.msrp - b.msrp
                    );

                    const sideUnitPrice = sideUnits[0].sprice
                        ? sideUnits[0].sprice
                        : sideUnits[0].msrp;

                    return vanityFinalPrice + washbasinPrice + sideUnitPrice;
                }

                return vanityFinalPrice + washbasinPrice;
            };

            // Add constructed composition to array.
            compositions.push({
                model: model,
                name: `${model} ${size}" ${sinkPositionMeasure} Incl a ${washbasins[0].model} ${position} SINK - ${doorStyle} DOOR`,
                compositionImage: `https://portal.davidici.com/images/express-program/${model}/${sinkPositionMeasure} ${position} SINK-${doorStyle}.webp`,
                size: size,
                sinkPosition: position,
                startingPrice: getStartingPrice(),
                vanities,
                finishes,
                sideUnits,
                washbasins,
                otherProductsAvailable: generateOtherProductsObj(
                    otherProducts,
                    sharedItemsMap,
                    model
                ),
            });
        }
    };

    const getExpressProgramData = (mapsObject: ExpressProgramMaps) => {
        const {
            vanitiesAndSideUnitsMap,
            validCompositionSizesMap,
            otherProductsMap,
            sharedItemsMap,
        } = mapsObject;

        const initialCompositions: Composition[] = [];
        const initialSizesForFilter: string[] = [];
        const finishesForFilterMap = new Map();
        const sinkPositionsForFilterMap = new Map<string, SinkPositionObj>();
        const modelsForFilterMap = new Map<string, ModelObj>();

        // ONLY FOR THOSE MODELS THAT HAVE INTEGRATED SINK
        if (vanitiesAndSideUnitsMap.get("VANITY").has("20")) {
            initialSizesForFilter.push("20");
            const modelsMap = vanitiesAndSideUnitsMap.get("VANITY").get("20");
            for (const [model, products] of modelsMap) {
                modelsForFilterMap.set(model, {
                    name: model,
                    url: `https://${location.hostname}/images/express-program/${model}/${model}.webp`,
                });
                generateCenteredSinkCompositions(
                    products,
                    finishesForFilterMap,
                    sinkPositionsForFilterMap,
                    initialCompositions,
                    model,
                    "20",
                    "CENTERED",
                    [],
                    otherProductsMap,
                    sharedItemsMap
                );
            }
        }

        // Traverse throght validCompositionSizesMap so we can create all possible compositions.
        // SIZE -> SINK SET UP -> SINK POSITION.
        for (const [size, sinkPositionsMap] of validCompositionSizesMap) {
            // this is not a valid size, therefore, we continue. we must fix that in foxpro.
            if (size === "SINK" || size === "56") continue;

            initialSizesForFilter.push(size);

            for (const [sinkPositionMeasure, crrItems] of sinkPositionsMap) {
                // this is not a valid sink measure (only "centered" or "(size+sieze)"" format), therefore, we continue. we must fix that in foxpro.
                if (sinkPositionMeasure === "DOUBLE SINK") continue;

                if (sinkPositionMeasure === "CENTERED") {
                    const modelsMap = vanitiesAndSideUnitsMap
                        .get("VANITY")
                        .get(size);

                    for (const [model, listOfVanities] of modelsMap) {
                        if (model === "PETRA") continue;

                        modelsForFilterMap.set(model, {
                            name: model,
                            url: `https://${location.hostname}/images/express-program/${model}/${model}.webp`,
                        });

                        // MARGI is a special case because it's also classified by door style. this means,
                        // there is an extra Map we have to go through
                        if (model === "MARGI")
                            generateCenteredSinkMargiCompositions(
                                listOfVanities,
                                finishesForFilterMap,
                                sinkPositionsForFilterMap,
                                initialCompositions,
                                model,
                                size,
                                sinkPositionMeasure,
                                crrItems,
                                otherProductsMap,
                                sharedItemsMap
                            );
                        else
                            generateCenteredSinkCompositions(
                                listOfVanities,
                                finishesForFilterMap,
                                sinkPositionsForFilterMap,
                                initialCompositions,
                                model,
                                size,
                                sinkPositionMeasure,
                                crrItems,
                                otherProductsMap,
                                sharedItemsMap
                            );
                    }
                } else {
                    // Get all the sizes from sinkPositionMeasure and sort the array to get the side unit first.
                    //sinkPositionMeasure example = (24+8) or (24+24) or (24+12+24).
                    const sizesArr = sinkPositionMeasure
                        .match(/\d+/g)
                        .sort((a: number, b: number) => a - b);

                    // Iterate over the size array to get all possible models with the given measurements.
                    const validModels = new Map();
                    for (let i = 0; i < sizesArr.length; i++) {
                        const size = sizesArr[i];

                        // for double sinks.
                        if (i === 0 && Number.parseInt(size) > 16) {
                            const modelsMap = vanitiesAndSideUnitsMap
                                .get("VANITY")
                                .get(size);

                            for (const [model, arr] of modelsMap) {
                                if (!validModels.has(model))
                                    validModels.set(model, new Map());
                                validModels.get(model).set("VANITY", arr);
                            }

                            break;
                        }

                        // for side units.
                        // Checks IF it's a side unit size. ELSE should be a vanity size.
                        if (Number.parseInt(size) <= 16) {
                            // As of 07/2/2024, the largest side unit size is 16" inches and the smallest one 8".
                            const modelsMap = vanitiesAndSideUnitsMap
                                .get("SIDE UNIT")
                                .get(size);

                            // IMPORTANT!! - "value" could be an array or a map(NEW YORK <position, arr>).
                            for (const [model, value] of modelsMap) {
                                if (!validModels.has(model))
                                    validModels.set(model, new Map());

                                validModels.get(model).set("SIDE UNIT", value);
                            }
                        } else {
                            // Once we got the valid model from the side units,
                            const modelsMap = vanitiesAndSideUnitsMap
                                .get("VANITY")
                                .get(size);

                            // IMPORTANT!! - "value" could be an array or a map(MARGI <door style, arr>).
                            for (const [model, value] of modelsMap) {
                                //we can get only vanities that can be pair with a side unit.
                                if (!validModels.has(model)) continue;
                                validModels.get(model).set("VANITY", value);
                            }
                        }
                    }

                    // Iterate over the sink position map (centered, left right, double) to start creating the composition.
                    for (const [position, listOfWasbasins] of crrItems) {
                        for (const [model, itemsMap] of validModels) {
                            if (model === "PETRA") continue;

                            modelsForFilterMap.set(model, {
                                name: model,
                                url: `https://${location.hostname}/images/express-program/${model}/${model}.webp`,
                            });

                            if (model === "MARGI")
                                generateComplexMargiCompositions(
                                    itemsMap,
                                    finishesForFilterMap,
                                    sinkPositionsForFilterMap,
                                    initialCompositions,
                                    model,
                                    size,
                                    sinkPositionMeasure,
                                    position,
                                    listOfWasbasins,
                                    otherProductsMap,
                                    sharedItemsMap
                                );
                            else
                                generateComplexCompositions(
                                    itemsMap,
                                    finishesForFilterMap,
                                    sinkPositionsForFilterMap,
                                    initialCompositions,
                                    model,
                                    size,
                                    sinkPositionMeasure,
                                    position,
                                    listOfWasbasins,
                                    otherProductsMap,
                                    sharedItemsMap
                                );
                        }
                    }
                }
            }
        }

        // Converts finishesForFilterMap values to and array with such values.
        const initialFinishesForFilter: FinishObj[] = Object.values(
            Object.fromEntries(finishesForFilterMap)
        );

        // Converts modelsForFilterMap values to and array with such values.
        const initialModelsForFilter: ModelObj[] = Object.values(
            Object.fromEntries(modelsForFilterMap)
        );

        // Converts sink potision set into an array.
        const initialSinkPositionsForFilter: SinkPositionObj[] = Object.values(
            Object.fromEntries(sinkPositionsForFilterMap)
        );

        initialFinishesForFilter.sort((a: FinishObj, b: FinishObj) => {
            if (a.type.toUpperCase() < b.type.toUpperCase()) return -1;
            if (a.type.toUpperCase() > b.type.toUpperCase()) return 1;
            return 0;
        });

        // Sorts composition array by price.
        initialCompositions.sort(
            (a: Composition, b: Composition) =>
                a.startingPrice - b.startingPrice
        );

        return {
            initialCompositions,
            initialSizesForFilter,
            initialFinishesForFilter,
            initialSinkPositionsForFilter,
            initialModelsForFilter,
        };
    };

    return useMemo(() => {
        return getExpressProgramData(createProductsTree());
    }, [rawProducts]);
}

export default useExpressProgramProducts;
