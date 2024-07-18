import { useEffect, useState } from "react";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import Filter from "../../Components/Filter";
import FinishesFilter from "../../Components/FinishesFilter";
import ProductExpressProgramCard from "../../Components/ProductExpressProgramCard";
import User from "../../Models/User";
import useExpressProgramProducts from "../../Hooks/useExpressProgramProducts";
import type { ProductInventory } from "../../Models/Product";
import type { Composition } from "../../Models/Composition";
import classes from "../../../css/express-program.module.css";
import type { finish } from "../../Models/ExpressProgramModels";

/**
 * TODO:
 *
 * 1. filter compotiions by price.
 * 2. kepp filtered size.
 * 3. change finish filter.
 */

interface ProductsAvailableProps {
    auth: User;
    rawProducts: ProductInventory[];
    message?: string;
}

interface StatefulFilterObj {
    crrFilteredFinish: string;
    crrFilteredSize: string;
}

function ProductsAvailable({
    auth,
    rawProducts,
    message,
}: ProductsAvailableProps) {
    // this creates all the possible compositions.
    const {
        initialCompositions,
        initialSizesForFilter,
        initialFinishesForFilter,
    } = useExpressProgramProducts(rawProducts);

    // this will re-render when filter is used.
    const [compositions, setCompositions] = useState(initialCompositions);

    // Manage size filter
    const [sizesForFilter, setSizesForFilter] = useState(initialSizesForFilter);
    const [crrFilteredSize, setCrrFilteredSize] = useState("");

    // Manage finishes filter
    const [finishesForFilter, setFinishesForFilter] = useState(
        initialFinishesForFilter
    );
    const [crrFilteredFinish, setCrrFilteredFinish] = useState("");

    const handleFilter = (
        filter: string,
        value: string | StatefulFilterObj
    ) => {
        let filteredComposition: Composition[] = [];
        const statefulFilters = {
            crrFilteredSize,
            crrFilteredFinish,
        };

        if (filter === "sizes") {
            const sizeValue = value as string;

            statefulFilters.crrFilteredSize = sizeValue;
            localStorage.setItem(
                "statefulFilters",
                JSON.stringify(statefulFilters)
            );

            filteredComposition = compositions.filter((product) => {
                return product.size === sizeValue;
            });

            const finishesForFilterMap = new Map();
            filteredComposition.forEach((composition) => {
                composition.finishes.forEach((finishObj) =>
                    finishesForFilterMap.set(finishObj.finish, finishObj)
                );
            });

            setSizesForFilter([sizeValue]);
            setFinishesForFilter(
                Object.values(Object.fromEntries(finishesForFilterMap))
            );
            setCrrFilteredSize(sizeValue);
        }

        if (filter === "images") {
            const finishValue = value as string;

            statefulFilters.crrFilteredFinish = finishValue;
            localStorage.setItem(
                "statefulFilters",
                JSON.stringify(statefulFilters)
            );

            filteredComposition = compositions.filter((product) => {
                for (const finishObj of product.finishes) {
                    if (finishObj.finish === finishValue) return true;
                }
                return false;
            });

            const sizesForFilter = new Set<string>();
            filteredComposition.forEach((composition) => {
                sizesForFilter.add(composition.size);
            });

            const crrFinishObj = initialFinishesForFilter.find(
                (finish) => finish.finish === finishValue
            );

            setSizesForFilter(Array.from(sizesForFilter));
            setFinishesForFilter([crrFinishObj!]);
            setCrrFilteredFinish(finishValue);
        }

        if (filter === "both") {
            const { crrFilteredSize, crrFilteredFinish } =
                value as StatefulFilterObj;

            if (crrFilteredSize && !crrFilteredFinish) {
                const sizeValue = crrFilteredSize;

                filteredComposition = compositions.filter((product) => {
                    return product.size === sizeValue;
                });

                const finishesForFilterMap = new Map();
                filteredComposition.forEach((composition) => {
                    composition.finishes.forEach((finishObj) =>
                        finishesForFilterMap.set(finishObj.finish, finishObj)
                    );
                });

                setSizesForFilter([sizeValue]);
                setFinishesForFilter(
                    Object.values(Object.fromEntries(finishesForFilterMap))
                );
                setCrrFilteredSize(sizeValue);
            }

            if (crrFilteredFinish && !crrFilteredSize) {
                const finishValue = crrFilteredFinish;

                filteredComposition = compositions.filter((product) => {
                    for (const finishObj of product.finishes) {
                        if (finishObj.finish === finishValue) return true;
                    }
                    return false;
                });

                const sizesForFilter = new Set<string>();
                filteredComposition.forEach((composition) => {
                    sizesForFilter.add(composition.size);
                });

                const crrFinishObj = initialFinishesForFilter.find(
                    (finish) => finish.finish === finishValue
                );

                setSizesForFilter(Array.from(sizesForFilter));
                setFinishesForFilter([crrFinishObj!]);
                setCrrFilteredFinish(finishValue);
            }

            if (crrFilteredFinish && crrFilteredSize) {
                const sizeValue = crrFilteredSize;
                const finishValue = crrFilteredFinish;

                filteredComposition = compositions.filter((product) => {
                    for (const finishObj of product.finishes) {
                        if (
                            finishObj.finish === finishValue &&
                            product.size === sizeValue
                        )
                            return true;
                    }
                    return false;
                });

                const crrFinishObj = initialFinishesForFilter.find(
                    (finish) => finish.finish === finishValue
                );

                setSizesForFilter([sizeValue]);
                setFinishesForFilter([crrFinishObj!]);
                setCrrFilteredFinish(finishValue);
                setCrrFilteredSize(sizeValue);
            }
        }

        setCompositions(filteredComposition);
    };

    const handleResetFilters = () => {
        setCompositions(structuredClone(initialCompositions));
        setFinishesForFilter(structuredClone(initialFinishesForFilter));
        setSizesForFilter(structuredClone(initialSizesForFilter));
        setCrrFilteredFinish("");
        setCrrFilteredSize("");
        localStorage.setItem(
            "statefulFilters",
            JSON.stringify({ crrFilteredSize: "", crrFilteredFinish: "" })
        );
    };

    useEffect(() => {
        const statefulFiltersJSON = localStorage.getItem("statefulFilters");
        if (statefulFiltersJSON) {
            const statefulFilters: StatefulFilterObj =
                JSON.parse(statefulFiltersJSON);

            if (
                statefulFilters.crrFilteredFinish ||
                statefulFilters.crrFilteredSize
            )
                handleFilter("both", statefulFilters);
        }
    }, []);

    return (
        <UserAuthenticatedLayout auth={auth} crrPage="orders">
            <div className="main-content-wrapper">
                <section className={classes.allFiltersWrapper}>
                    <Filter
                        filterTitle="Filter By Size"
                        contentType="sizes"
                        values={sizesForFilter}
                        crrValueSelected={crrFilteredSize}
                        onFilter={handleFilter}
                    />
                    <FinishesFilter
                        filterTitle="Filter By Color"
                        contentType="images"
                        values={finishesForFilter}
                        crrValueSelected={crrFilteredFinish}
                        onFilter={handleFilter}
                    />
                    <button
                        className={classes.resetFiltersButton}
                        onClick={handleResetFilters}
                    >
                        reset filters
                    </button>
                </section>
                <section className={classes.expressProgramProductsWrapper}>
                    {compositions.map((composition, index) => (
                        <ProductExpressProgramCard
                            composition={composition}
                            key={index}
                        />
                    ))}
                </section>
            </div>
        </UserAuthenticatedLayout>
    );
}

export default ProductsAvailable;
