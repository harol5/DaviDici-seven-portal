import { useMemo, useState } from "react";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import Filter from "../../Components/Filter";
import ProductExpressProgramCard from "../../Components/ProductExpressProgramCard";
import User from "../../Models/User";
import type { ProductInventory } from "../../Models/Product";
import type { Composition } from "../../Models/Composition";
import classes from "../../../css/express-program.module.css";

interface ProductsAvailableProps {
    auth: User;
    rawProducts: ProductInventory[];
}

type finish = {
    finish: string;
    url: string;
};

function ProductsAvailable({ auth, rawProducts }: ProductsAvailableProps) {
    // this creates all the possible compositions.
    const { compositions, sizesForFilter, finishesForFilter } = useMemo(() => {
        const itemsMap = new Map();
        const validCompositionSizesMap = new Map();

        const compositions: Composition[] = [];
        const sizesForFilter: string[] = [];
        const finishesForFilterMap = new Map();

        // Create map hierchy
        rawProducts.forEach((product) => {
            if (!itemsMap.has(product.item))
                itemsMap.set(product.item, new Map());

            const sizesMap = itemsMap.get(product.item);
            if (!sizesMap.has(product.size))
                sizesMap.set(product.size, new Map());

            const modelMap = sizesMap.get(product.size);
            if (!modelMap.has(product.model)) modelMap.set(product.model, []);

            modelMap.get(product.model).push(product);

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
                    const modelsMap = itemsMap.get("VANITY").get(size);

                    for (const [model, listOfVanities] of modelsMap) {
                        const listOfFinishesMap = new Map();

                        // add finishes to use in filter and composition.
                        listOfVanities.forEach((vanity: ProductInventory) => {
                            const finishObj = {
                                finish: vanity.finish,
                                url: "https://www.davidici.com/wp-content/uploads/2024/01/matt-SAND.png",
                            };

                            if (!listOfFinishesMap.has(vanity.finish))
                                listOfFinishesMap.set(vanity.finish, finishObj);

                            if (!finishesForFilterMap.has(vanity.finish))
                                finishesForFilterMap.set(
                                    vanity.finish,
                                    finishObj
                                );
                        });

                        // Add constructed composition to array.
                        compositions.push({
                            name: `${model} ${size}" ${sinkPositionMeasure} SINK`,
                            compositionImage: `https://seven.test/images/express-program/${model}/${size}.jpg`,
                            size: size,
                            vanities: listOfVanities.sort(
                                (a: ProductInventory, b: ProductInventory) =>
                                    a.msrp - b.msrp
                            ),
                            finishes: Object.values(
                                Object.fromEntries(listOfFinishesMap)
                            ),
                            sideUnits: [],
                            washbasins: crrItems.sort(
                                (a: ProductInventory, b: ProductInventory) =>
                                    a.msrp - b.msrp
                            ),
                        });
                    }
                } else {
                    const validModels = new Map();

                    // Get all the sizes from sinkPositionMeasure and sort the array to get the side unit first.
                    const sizesArr = sinkPositionMeasure
                        .match(/\d+/g)
                        .sort((a: number, b: number) => a - b);

                    // Iterate over the size array to get all possible models with the given measurements.
                    for (let i = 0; i < sizesArr.length; i++) {
                        const size = sizesArr[i];

                        // for double sinks.
                        if (i === 0 && Number.parseInt(size) > 16) {
                            const modelsMap = itemsMap.get("VANITY").get(size);

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
                            const modelsMap = itemsMap
                                .get("SIDE UNIT")
                                .get(size);

                            for (const [model, arr] of modelsMap) {
                                if (!validModels.has(model))
                                    validModels.set(model, new Map());
                                validModels.get(model).set("SIDE UNIT", arr);
                            }
                        } else {
                            // Once we got the valid model from the side units,
                            const modelsMap = itemsMap.get("VANITY").get(size);

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
                            const listOfVanities = itemsMap
                                .get("VANITY")
                                .sort(
                                    (
                                        a: ProductInventory,
                                        b: ProductInventory
                                    ) => a.msrp - b.msrp
                                );

                            const listOfFinishesMap = new Map();

                            // add finishes to use in filter and composition.
                            listOfVanities.forEach(
                                (vanity: ProductInventory) => {
                                    const finishObj = {
                                        finish: vanity.finish,
                                        url: "https://www.davidici.com/wp-content/uploads/2024/01/matt-SAND.png",
                                    };

                                    if (!listOfFinishesMap.has(vanity.finish))
                                        listOfFinishesMap.set(
                                            vanity.finish,
                                            finishObj
                                        );

                                    if (
                                        !finishesForFilterMap.has(vanity.finish)
                                    )
                                        finishesForFilterMap.set(
                                            vanity.finish,
                                            finishObj
                                        );
                                }
                            );

                            // Add constructed composition to array.
                            compositions.push({
                                name: `${model} ${size}" ${sinkPositionMeasure} ${position} SINK`,
                                compositionImage: `https://seven.test/images/express-program/${model}/${sinkPositionMeasure} ${position} SINK.jpg`,
                                size: size,
                                vanities: listOfVanities,
                                finishes: Object.values(
                                    Object.fromEntries(listOfFinishesMap)
                                ),
                                sideUnits: itemsMap.get("SIDE UNIT") ?? [],
                                washbasins: listOfWasbasins.sort(
                                    (
                                        a: ProductInventory,
                                        b: ProductInventory
                                    ) => a.msrp - b.msrp
                                ),
                            });
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
    console.log(compositions);
    // this will re render when filter is used.
    const [products, setProducts] = useState(compositions);

    const [crrValueFiltered, setCrrValueFiltered] = useState("");

    const handleFilter = (filter: string, value: string) => {
        let productsFiltered: Composition[] = [];

        if (filter === "sizes") {
            productsFiltered = compositions.filter((product) => {
                return product.size === value;
            });
        }

        if (filter === "images") {
            productsFiltered = compositions.filter((product) => {
                for (const finishObj of product.finishes) {
                    if (finishObj.finish === value) return true;
                }
                return false;
            });
        }

        setCrrValueFiltered(value);
        setProducts(productsFiltered);
    };

    return (
        <UserAuthenticatedLayout auth={auth} crrPage="orders">
            <div className="main-content-wrapper">
                <section className={classes.allFiltersWrapper}>
                    <Filter
                        filterTitle="Filter By Size"
                        contentType="sizes"
                        values={sizesForFilter}
                        crrValueSelected={crrValueFiltered}
                        onFilter={handleFilter}
                    />
                    <Filter
                        filterTitle="Filter By Color"
                        contentType="images"
                        values={finishesForFilter}
                        crrValueSelected={crrValueFiltered}
                        onFilter={handleFilter}
                    />
                </section>
                <section className={classes.expressProgramProductsWrapper}>
                    {products.map((product, index) => (
                        <ProductExpressProgramCard
                            product={product}
                            key={index}
                        />
                    ))}
                </section>
            </div>
        </UserAuthenticatedLayout>
    );
}

export default ProductsAvailable;
