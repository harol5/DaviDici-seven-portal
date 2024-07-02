import { useMemo, useState } from "react";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import Filter from "../../Components/Filter";
import User from "../../Models/User";
import type { ProductInventory } from "../../Models/Product";
import classes from "../../../css/express-program.module.css";

interface ProductsAvailableProps {
    auth: User;
    rawProducts: ProductInventory[];
}

function ProductsAvailable({ auth, rawProducts }: ProductsAvailableProps) {
    // this creates all the possible compositions.
    const testing = useMemo(() => {
        const itemsMap = new Map();
        const validCompositionSizesMap = new Map();
        const compositions = [];

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

            for (const [sinkPositionMeasure, crrItems] of sinkPositionsMap) {
                // this is not a valid sink measure (only "centered" or "(size+sieze)"" format), therefore, we continue. we must fix that in foxpro.
                if (sinkPositionMeasure === "DOUBLE SINK") continue;

                if (sinkPositionMeasure === "CENTERED") {
                    const modelsMap = itemsMap.get("VANITY").get(size);

                    for (const [model, arr] of modelsMap) {
                        compositions.push({
                            name: `${model} ${size}" ${sinkPositionMeasure}`,
                            size: size,
                            vanities: arr,
                            sideUnits: [],
                            washbasins: crrItems,
                        });
                    }
                } else {
                    // Get all the sizes from sinkPositionMeasure.
                    // the smallest size usually corresponse to a side unit.
                    // Get only models that can be pair with a side unit. (margi, new bali, new york, opera);
                    // for (const [position, listOfProducts] of crrItems) {}
                }
            }
        }

        console.log(validCompositionSizesMap);
        console.log(itemsMap);
        console.log(compositions);

        return itemsMap;
    }, [rawProducts]);

    // this will re render when filter is used.
    const [products, setProducts] = useState(rawProducts);

    const handleFilter = (value: string) => {
        console.log(value);
    };

    // console.log(testing);
    // console.log(Object.fromEntries(testing.entries()));
    // console.log(Array.from(testing.entries()));

    return (
        <UserAuthenticatedLayout auth={auth} crrPage="orders">
            <div className="main-content-wrapper">
                <section className={classes.allFiltersWrapper}>
                    <Filter
                        filterTitle="Filter By Size"
                        contentType="sizes"
                        values={["17", "20", "24", "32", "42", "48"]}
                        onFilter={handleFilter}
                    />
                    <Filter
                        filterTitle="Filter By Color"
                        contentType="images"
                        values={[
                            "https://www.davidici.com/wp-content/uploads/2024/01/matt-SAND.png",
                            "https://www.davidici.com/wp-content/uploads/2024/01/matt-PAPRIKA.png",
                            "https://www.davidici.com/wp-content/uploads/2024/01/matt-THYME-GREEN.jpg",
                            "https://www.davidici.com/wp-content/uploads/2024/01/matt-MUSTARD.png",
                            "https://www.davidici.com/wp-content/uploads/2024/01/matt-PACIFIC-BLUE.jpg",
                            "https://www.davidici.com/wp-content/uploads/2024/01/glossy-lacq-CLOUD-GREY.jpg",
                        ]}
                        onFilter={handleFilter}
                    />
                </section>
            </div>
        </UserAuthenticatedLayout>
    );
}

export default ProductsAvailable;
