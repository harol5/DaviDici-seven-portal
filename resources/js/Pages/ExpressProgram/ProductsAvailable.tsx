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

            if (product.item === "WASHBASIN/SINK") {
                if (!validCompositionSizesMap.has(product.size))
                    validCompositionSizesMap.set(product.size, new Map());

                const sinkPositionsMap = validCompositionSizesMap.get(
                    product.size
                );

                const sinkPosition = product.descw.match(
                    /\(\d+(\+\d+)+\)|\bDOUBLE SINK\b/
                );

                if (sinkPosition) {
                    if (!sinkPositionsMap.has(sinkPosition[0]))
                        sinkPositionsMap.set(sinkPosition[0], new Map());

                    const itemsMap = sinkPositionsMap.get(sinkPosition[0]);
                    if (!itemsMap.has(product.item))
                        itemsMap.set(product.item, []);

                    itemsMap.get(product.item).push(product);
                } else {
                    if (!sinkPositionsMap.has("CENTERED"))
                        sinkPositionsMap.set("CENTERED", new Map());

                    const itemsMap = sinkPositionsMap.get("CENTERED");
                    if (!itemsMap.has(product.item))
                        itemsMap.set(product.item, []);

                    itemsMap.get(product.item).push(product);
                }
            }
        });

        //travers throght map.
        // for (const [size, modelMap] of sizesMap) {
        //     if (size === "24") {
        //         for (const [model, arr] of modelMap) {
        //             if (model === "ELORA") console.log(arr);
        //         }
        //     }
        // }

        console.log(validCompositionSizesMap);
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
