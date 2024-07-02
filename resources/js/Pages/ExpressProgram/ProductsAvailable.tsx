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
    finish: "matt sand";
    url: "https://www.davidici.com/wp-content/uploads/2024/01/matt-SAND.png";
};

function ProductsAvailable({ auth, rawProducts }: ProductsAvailableProps) {
    // this creates all the possible compositions.
    const { compositions, sizesForFilter } = useMemo(() => {
        const itemsMap = new Map();
        const validCompositionSizesMap = new Map();

        const compositions: Composition[] = [];
        const sizesForFilter: string[] = [];
        const finishesForFilter = new Map();

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

        //travers throght map.
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
                        // add finish to use in filter.
                        listOfVanities.forEach((vanity: ProductInventory) => {
                            if (!finishesForFilter.has(vanity.finish))
                                finishesForFilter.set(vanity.finish, {
                                    finish: vanity.finish,
                                    url: `https://www.davidici.com/wp-content/uploads/2024/01/${vanity.finish}.png`,
                                });
                        });

                        // Add constructed composotion to array.
                        compositions.push({
                            name: `${model} ${size}" ${sinkPositionMeasure} SINK`,
                            size: size,
                            vanities: listOfVanities.sort(
                                (a: ProductInventory, b: ProductInventory) =>
                                    a.msrp - b.msrp
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

                        if (Number.parseInt(size) <= 16) {
                            // Checks if side unit size. else should be a vaninity size.
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

                    for (const [position, listOfWasbasins] of crrItems) {
                        for (const [model, itemsMap] of validModels) {
                            compositions.push({
                                name: `${model} ${size}" ${sinkPositionMeasure} ${position} SINK`,
                                size: size,
                                vanities: itemsMap
                                    .get("VANITY")
                                    .sort(
                                        (
                                            a: ProductInventory,
                                            b: ProductInventory
                                        ) => a.msrp - b.msrp
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

        return { compositions, sizesForFilter };
    }, [rawProducts]);

    // this will re render when filter is used.
    const [products, setProducts] = useState(compositions);

    const [crrSizeFiltered, setCrrSizeFiltered] = useState("");

    const handleFilter = (value: string) => {
        const productsFiltered = compositions.filter((product) => {
            return product.size === value;
        });
        setCrrSizeFiltered(value);
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
                        crrValueSelected={crrSizeFiltered}
                        onFilter={handleFilter}
                    />
                    <Filter
                        filterTitle="Filter By Color"
                        contentType="images"
                        values={[
                            {
                                finish: "matt sand",
                                url: "https://www.davidici.com/wp-content/uploads/2024/01/matt-SAND.png",
                            },
                            {
                                finish: "PAPRIKA",
                                url: "https://www.davidici.com/wp-content/uploads/2024/01/matt-PAPRIKA.png",
                            },
                            {
                                finish: "GREEN",
                                url: "https://www.davidici.com/wp-content/uploads/2024/01/matt-THYME-GREEN.jpg",
                            },
                            {
                                finish: "MUSTARD",
                                url: "https://www.davidici.com/wp-content/uploads/2024/01/matt-MUSTARD.png",
                            },
                            {
                                finish: "BLUE",
                                url: "https://www.davidici.com/wp-content/uploads/2024/01/matt-PACIFIC-BLUE.jpg",
                            },
                            {
                                finish: "GREY",
                                url: "https://www.davidici.com/wp-content/uploads/2024/01/glossy-lacq-CLOUD-GREY.jpg",
                            },
                        ]}
                        crrValueSelected={crrSizeFiltered}
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
