import { useMemo } from "react";
import { ProductInventory } from "../Models/Product";
import { Composition } from "../Models/Composition";

type finish = {
    finish: string;
    url: string;
};

function useExpressProgramProducts(rawProducts: ProductInventory[]) {
    const createProductsTree = () => {
        const vanitiesAndSideUnitsMap = new Map();
        const otherProductsMap = new Map();
        const validCompositionSizesMap = new Map();

        rawProducts.forEach((product) => {
            if (product.item === "VANITY" || product.item === "SIDE UNIT") {
                if (!vanitiesAndSideUnitsMap.has(product.item))
                    vanitiesAndSideUnitsMap.set(product.item, new Map());

                const sizesMap = vanitiesAndSideUnitsMap.get(product.item);
                if (!sizesMap.has(product.size))
                    sizesMap.set(product.size, new Map());

                const modelMap = sizesMap.get(product.size);
                if (product.model === "MARGI" && product.item === "VANITY") {
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
                if (!otherProductsMap.has(product.model))
                    otherProductsMap.set(product.model, new Map());

                const itemsMap = otherProductsMap.get(product.model);
                if (!itemsMap.has(product.item)) itemsMap.set(product.item, []);

                itemsMap.get(product.item).push(product);
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
                        /\bLEFT\b|\bRIGHT\b|\bDOUBLE\b/
                    );
                    if (sinkConfig) {
                        if (!sinkPosition.has(sinkConfig[0]))
                            sinkPosition.set(sinkConfig[0], []);
                        sinkPosition.get(sinkConfig[0]).push(product);
                    }
                } else {
                    if (!sinkPositionsMap.has("CENTERED"))
                        sinkPositionsMap.set("CENTERED", []);

                    sinkPositionsMap.get("CENTERED").push(product);
                }
            }
        });

        return {
            vanitiesAndSideUnitsMap,
            validCompositionSizesMap,
            otherProductsMap,
        };
    };

    const generateFinishes = (
        listOfVanities: ProductInventory[],
        finishesForFilterMap: Map<string, finish>
    ): finish[] => {
        const listOfFinishesMap = new Map();

        // add finishes to use in filter and composition.
        listOfVanities.forEach((vanity: ProductInventory) => {
            let finish = vanity.finish;

            if (vanity.finish.includes("/")) {
                finish = vanity.finish.replace("/", "-");
            }

            const finishObj = {
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
        model: string
    ) => {
        if (otherProducts.get(model)) {
            return Object.fromEntries(
                otherProducts.get(model) as Map<string, ProductInventory[]>
            );
        }

        return null;
    };

    const generateCenteredSinkCompositions = (
        listOfVanities: ProductInventory[],
        finishesForFilterMap: Map<string, finish>,
        compositions: Composition[],
        model: string,
        size: string,
        sinkPositionMeasure: string,
        washbasingAvailable: ProductInventory[],
        otherProducts: Map<string, Map<string, ProductInventory[]>>
    ) => {
        const finishes = generateFinishes(listOfVanities, finishesForFilterMap);

        // Add constructed composition to array.
        compositions.push({
            model: model,
            name: `${model} ${size}" - ${sinkPositionMeasure} SINK`,
            compositionImage: `https://portal.davidici.com/images/express-program/${model}/${size}.webp`,
            size: size,
            vanities: listOfVanities.sort(
                (a: ProductInventory, b: ProductInventory) => a.msrp - b.msrp
            ),
            finishes: finishes,
            sideUnits: [],
            washbasins: washbasingAvailable.sort(
                (a: ProductInventory, b: ProductInventory) => a.msrp - b.msrp
            ),
            otherProductsAvailable: generateOtherProductsObj(
                otherProducts,
                model
            ),
        });
    };

    const generateCenteredSinkMargiCompositions = (
        doorStylesMap: Map<string, ProductInventory[]>,
        finishesForFilterMap: Map<string, finish>,
        compositions: Composition[],
        model: string,
        size: string,
        sinkPositionMeasure: string,
        washbasingAvailable: ProductInventory[],
        otherProducts: Map<string, Map<string, []>>
    ) => {
        for (const [doorStyle, margiVanityList] of doorStylesMap) {
            const finishes = generateFinishes(
                margiVanityList,
                finishesForFilterMap
            );

            // Add constructed composition to array.
            compositions.push({
                model: model,
                name: `${model} ${size}" - ${sinkPositionMeasure} SINK - ${doorStyle} DOOR`,
                compositionImage: `https://portal.davidici.com/images/express-program/${model}/${size}-${doorStyle}.webp`,
                size: size,
                vanities: margiVanityList.sort(
                    (a: ProductInventory, b: ProductInventory) =>
                        a.msrp - b.msrp
                ),
                finishes: finishes,
                sideUnits: [],
                washbasins: washbasingAvailable.sort(
                    (a: ProductInventory, b: ProductInventory) =>
                        a.msrp - b.msrp
                ),
                otherProductsAvailable: generateOtherProductsObj(
                    otherProducts,
                    model
                ),
            });
        }
    };

    const generateComplexCompositions = (
        itemsMap: Map<string, any>,
        finishesForFilterMap: Map<string, finish>,
        compositions: Composition[],
        model: string,
        size: string,
        sinkPositionMeasure: string,
        position: string,
        washbasingAvailable: ProductInventory[],
        otherProducts: Map<string, Map<string, []>>
    ) => {
        const listOfVanities = itemsMap
            .get("VANITY")
            .sort(
                (a: ProductInventory, b: ProductInventory) => a.msrp - b.msrp
            );

        const finishes = generateFinishes(listOfVanities, finishesForFilterMap);

        // Add constructed composition to array.
        compositions.push({
            model: model,
            name: `${model} ${size}" ${sinkPositionMeasure} - ${position} SINK`,
            compositionImage: `https://portal.davidici.com/images/express-program/${model}/${sinkPositionMeasure} ${position} SINK.webp`,
            size: size,
            vanities: listOfVanities,
            finishes: finishes,
            sideUnits: itemsMap.get("SIDE UNIT") ?? [],
            washbasins: washbasingAvailable.sort(
                (a: ProductInventory, b: ProductInventory) => a.msrp - b.msrp
            ),
            otherProductsAvailable: generateOtherProductsObj(
                otherProducts,
                model
            ),
        });
    };

    const generateComplexMargiCompositions = (
        itemsMap: Map<string, any>,
        finishesForFilterMap: Map<string, finish>,
        compositions: Composition[],
        model: string,
        size: string,
        sinkPositionMeasure: string,
        position: string,
        washbasingAvailable: ProductInventory[],
        otherProducts: Map<string, Map<string, []>>
    ) => {
        const doorStylesMap = itemsMap.get("VANITY");
        const sideUnits = itemsMap.get("SIDE UNIT") ?? [];

        for (const [doorStyle, margiVanitiesList] of doorStylesMap) {
            const listOfVanities = margiVanitiesList.sort(
                (a: ProductInventory, b: ProductInventory) => a.msrp - b.msrp
            );

            const finishes = generateFinishes(
                listOfVanities,
                finishesForFilterMap
            );

            // Add constructed composition to array.
            compositions.push({
                model: model,
                name: `${model} ${size}" ${sinkPositionMeasure} - ${position} SINK - ${doorStyle} DOOR`,
                compositionImage: `https://portal.davidici.com/images/express-program/${model}/${sinkPositionMeasure} ${position} SINK-${doorStyle}.webp`,
                size: size,
                vanities: listOfVanities,
                finishes: finishes,
                sideUnits: sideUnits,
                washbasins: washbasingAvailable.sort(
                    (a: ProductInventory, b: ProductInventory) =>
                        a.msrp - b.msrp
                ),
                otherProductsAvailable: generateOtherProductsObj(
                    otherProducts,
                    model
                ),
            });
        }
    };

    return useMemo(() => {
        // Create map hierchy
        const {
            vanitiesAndSideUnitsMap,
            validCompositionSizesMap,
            otherProductsMap,
        } = createProductsTree();

        console.log(otherProductsMap);
        const compositions: Composition[] = [];
        const sizesForFilter: string[] = [];
        const finishesForFilterMap = new Map();

        // Traverse throght validCompositionSizesMap map so we can create all possible compositions.
        // SIZE -> SINK SET UP -> SINK POSITION.
        for (const [size, sinkPositionsMap] of validCompositionSizesMap) {
            // this is not a valid size, therefore, we continue. we must fix that in foxpro.
            if (size === "SINK" || size === "56") continue;

            sizesForFilter.push(size);

            for (const [sinkPositionMeasure, crrItems] of sinkPositionsMap) {
                // this is not a valid sink measure (only "centered" or "(size+sieze)"" format), therefore, we continue. we must fix that in foxpro.
                if (sinkPositionMeasure === "DOUBLE SINK") continue;

                if (sinkPositionMeasure === "CENTERED") {
                    const modelsMap = vanitiesAndSideUnitsMap
                        .get("VANITY")
                        .get(size);
                    for (const [model, listOfVanities] of modelsMap) {
                        // MARGI is a special case because it's also classified by door style. this means,
                        // there is an extra Map we have to go through
                        if (model === "MARGI")
                            generateCenteredSinkMargiCompositions(
                                listOfVanities,
                                finishesForFilterMap,
                                compositions,
                                model,
                                size,
                                sinkPositionMeasure,
                                crrItems,
                                otherProductsMap
                            );
                        else
                            generateCenteredSinkCompositions(
                                listOfVanities,
                                finishesForFilterMap,
                                compositions,
                                model,
                                size,
                                sinkPositionMeasure,
                                crrItems,
                                otherProductsMap
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
                        // Checks if it's a side unit size. else should be a vanity size.
                        if (Number.parseInt(size) <= 16) {
                            // As of 07/2/2024, the largest side unit size is 16" inches and the smallest one 8".
                            const modelsMap = vanitiesAndSideUnitsMap
                                .get("SIDE UNIT")
                                .get(size);

                            for (const [model, arr] of modelsMap) {
                                if (!validModels.has(model))
                                    validModels.set(model, new Map());
                                validModels.get(model).set("SIDE UNIT", arr);
                            }
                        } else {
                            // Once we got the valid model from the side units,
                            const modelsMap = vanitiesAndSideUnitsMap
                                .get("VANITY")
                                .get(size);

                            for (const [model, arr] of modelsMap) {
                                //we can get only vanities that can be pair with a side unit.
                                if (!validModels.has(model)) continue;
                                validModels.get(model).set("VANITY", arr);
                            }
                        }
                    }

                    // Iterate over the sink position map to start creating the composition.
                    for (const [position, listOfWasbasins] of crrItems) {
                        for (const [model, itemsMap] of validModels) {
                            if (model === "MARGI")
                                generateComplexMargiCompositions(
                                    itemsMap,
                                    finishesForFilterMap,
                                    compositions,
                                    model,
                                    size,
                                    sinkPositionMeasure,
                                    position,
                                    listOfWasbasins,
                                    otherProductsMap
                                );
                            else
                                generateComplexCompositions(
                                    itemsMap,
                                    finishesForFilterMap,
                                    compositions,
                                    model,
                                    size,
                                    sinkPositionMeasure,
                                    position,
                                    listOfWasbasins,
                                    otherProductsMap
                                );
                        }
                    }
                }
            }
        }

        // Converts finishesForFilterMap values to and array with such values.
        const finishesForFilter: finish[] = Object.values(
            Object.fromEntries(finishesForFilterMap)
        );

        return { compositions, sizesForFilter, finishesForFilter };
    }, [rawProducts]);
}

export default useExpressProgramProducts;
