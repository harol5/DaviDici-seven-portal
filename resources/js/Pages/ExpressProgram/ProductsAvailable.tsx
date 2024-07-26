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
    crrFilteredSinkPosition: string;
    crrFilteredModel: string;
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
        initialSinkPositionsForFilter,
        initialModelsForFilter,
    } = useExpressProgramProducts(rawProducts);

    // this will re-render when filter is used.
    const [compositions, setCompositions] = useState(initialCompositions);

    // --- Manage size filter.
    const [sizesForFilter, setSizesForFilter] = useState(initialSizesForFilter);
    const [crrFilteredSize, setCrrFilteredSize] = useState("");

    // --- Manage model filter.
    const [modelsForFilter, setModelsForFilter] = useState(
        initialModelsForFilter
    );
    const [crrFilteredModel, setCrrFilteredModel] = useState("");

    // --- Manage finishes filter.
    const [finishesForFilter, setFinishesForFilter] = useState(
        initialFinishesForFilter
    );
    const [crrFilteredFinish, setCrrFilteredFinish] = useState("");

    // --- Manage sink position filter.
    const [sinkPositionsForFilter, setSinkPositionsForFilter] = useState(
        initialSinkPositionsForFilter
    );
    const [crrFilteredSinkPosition, setCrrFilteredSinkPosition] = useState("");

    const handleFilter = (
        filter: string,
        value: string | StatefulFilterObj
    ) => {
        let filteredComposition: Composition[] = [];
        const statefulFilters = {
            crrFilteredSize,
            crrFilteredSinkPosition,
            crrFilteredFinish,
            crrFilteredModel,
        };

        if (filter === "sizes") {
            const sizeValue = value as string;

            // Updates local storage object for stateful filters.
            statefulFilters.crrFilteredSize = sizeValue;
            localStorage.setItem(
                "statefulFilters",
                JSON.stringify(statefulFilters)
            );

            // Filter composition by current selected size.
            filteredComposition = compositions.filter((composition) => {
                return composition.size === sizeValue;
            });

            // Based on filtered composition, create new avaibla values for other filters.
            let finishesForFilter: finish[] | null = crrFilteredFinish
                ? [
                      initialFinishesForFilter.find(
                          (finish) => finish.finish === crrFilteredFinish
                      )!,
                  ]
                : null;

            let sinkPositionsForFilter: string[] | null =
                crrFilteredSinkPosition ? [crrFilteredSinkPosition] : null;

            if (!finishesForFilter || !sinkPositionsForFilter) {
                const finishesForFilterMap = new Map();
                const sinkPositionsForFilterSet = new Set<string>();

                filteredComposition.forEach((composition) => {
                    sinkPositionsForFilterSet.add(composition.sinkPosition);

                    if (!finishesForFilter) {
                        composition.finishes.forEach((finishObj) =>
                            finishesForFilterMap.set(
                                finishObj.finish,
                                finishObj
                            )
                        );
                    }
                });

                finishesForFilter =
                    finishesForFilter ??
                    Object.values(Object.fromEntries(finishesForFilterMap));
                sinkPositionsForFilter =
                    sinkPositionsForFilter ??
                    Array.from(sinkPositionsForFilterSet);
            }

            // Set current selected size.
            setSizesForFilter([sizeValue]);
            setCrrFilteredSize(sizeValue);

            // Set available values for the other filters based on current selected size.
            setFinishesForFilter(finishesForFilter);
            setSinkPositionsForFilter(sinkPositionsForFilter);
        }

        if (filter === "sink position") {
            const sinkPositionValue = value as string;

            // Updates local storage object for stateful filters.
            statefulFilters.crrFilteredSinkPosition = sinkPositionValue;
            localStorage.setItem(
                "statefulFilters",
                JSON.stringify(statefulFilters)
            );

            // Filter compositions by current selected size.
            filteredComposition = compositions.filter((product) => {
                return product.sinkPosition === sinkPositionValue;
            });

            // Based on filtered compositions, create new available values for other filters.
            let finishesForFilter: finish[] | null = crrFilteredFinish
                ? [
                      initialFinishesForFilter.find(
                          (finish) => finish.finish === crrFilteredFinish
                      )!,
                  ]
                : null;

            let sizesForFilter: string[] | null = crrFilteredSinkPosition
                ? [crrFilteredSinkPosition]
                : null;

            if (!finishesForFilter || !sizesForFilter) {
                const sizesForFilterSet = new Set<string>();
                const finishesForFilterMap = new Map();

                filteredComposition.forEach((composition) => {
                    sizesForFilterSet.add(composition.size);
                    if (!finishesForFilter) {
                        composition.finishes.forEach((finishObj) =>
                            finishesForFilterMap.set(
                                finishObj.finish,
                                finishObj
                            )
                        );
                    }
                });

                finishesForFilter =
                    finishesForFilter ??
                    Object.values(Object.fromEntries(finishesForFilterMap));

                sizesForFilter =
                    sizesForFilter ?? Array.from(sizesForFilterSet);
            }

            // Set current selected sink position.
            setSinkPositionsForFilter([sinkPositionValue]);
            setCrrFilteredSinkPosition(sinkPositionValue);

            // Set available values for the other filters based on current selected size.
            setFinishesForFilter(finishesForFilter);
            setSizesForFilter(sizesForFilter);
        }

        if (filter === "finishes") {
            const finishValue = value as string;

            statefulFilters.crrFilteredFinish = finishValue;
            localStorage.setItem(
                "statefulFilters",
                JSON.stringify(statefulFilters)
            );

            filteredComposition = compositions.filter((composition) => {
                for (const finishObj of composition.finishes) {
                    if (finishObj.finish.includes(finishValue)) return true;
                }
                return false;
            });

            const sizesForFilter = new Set<string>();
            const sinkPositionsForFilterSet = new Set<string>();
            filteredComposition.forEach((composition) => {
                sizesForFilter.add(composition.size);
                sinkPositionsForFilterSet.add(composition.sinkPosition);
            });

            const crrFinishObj = initialFinishesForFilter.find(
                (finish) => finish.finish === finishValue
            );

            setFinishesForFilter([crrFinishObj!]);
            setCrrFilteredFinish(finishValue);

            setSizesForFilter(Array.from(sizesForFilter));
            setSinkPositionsForFilter(Array.from(sinkPositionsForFilterSet));
        }

        if (filter === "models") {
            const modelValue = value as string;

            statefulFilters.crrFilteredModel = modelValue;
            localStorage.setItem(
                "statefulFilters",
                JSON.stringify(statefulFilters)
            );

            filteredComposition = compositions.filter((composition) => {
                return composition.model === modelValue;
            });

            let finishesForFilter: finish[] | null = crrFilteredFinish
                ? [
                      initialFinishesForFilter.find(
                          (finish) => finish.finish === crrFilteredFinish
                      )!,
                  ]
                : null;
            let sinkPositionsForFilter: string[] | null =
                crrFilteredSinkPosition ? [crrFilteredSinkPosition] : null;

            const sizesForFilter = new Set<string>();
            const sinkPositionsForFilterSet = new Set<string>();
            filteredComposition.forEach((composition) => {
                sizesForFilter.add(composition.size);
                sinkPositionsForFilterSet.add(composition.sinkPosition);
            });

            const crrModelObj = initialModelsForFilter.find(
                (model) => model.name === modelValue
            );

            setModelsForFilter([crrModelObj!]);
            setCrrFilteredModel(modelValue);

            setSizesForFilter(Array.from(sizesForFilter));
            setSinkPositionsForFilter(Array.from(sinkPositionsForFilterSet));
        }

        if (filter === "stateful filters") {
            const {
                crrFilteredSize,
                crrFilteredFinish,
                crrFilteredSinkPosition,
            } = value as StatefulFilterObj;

            filteredComposition = compositions.filter((composition) => {
                const hasSize =
                    !crrFilteredSize || composition.size === crrFilteredSize;

                const hasSinkPosition =
                    !crrFilteredSinkPosition ||
                    composition.sinkPosition === crrFilteredSinkPosition;

                const hasFinish =
                    !crrFilteredFinish ||
                    composition.finishes.some(
                        (finish) => finish.finish === crrFilteredFinish
                    );

                return hasSize && hasSinkPosition && hasFinish;
            });

            const finishesForFilterMap = new Map();
            const sinkPositionsForFilterSet = new Set<string>();
            const sizesForFilterSet = new Set<string>();
            filteredComposition.forEach((composition) => {
                sizesForFilterSet.add(composition.size);
                sinkPositionsForFilterSet.add(composition.sinkPosition);
                composition.finishes.forEach((finishObj) =>
                    finishesForFilterMap.set(finishObj.finish, finishObj)
                );
            });

            setCrrFilteredFinish(crrFilteredFinish);
            setCrrFilteredSinkPosition(crrFilteredSinkPosition);
            setCrrFilteredSize(crrFilteredSize);

            setFinishesForFilter(
                Object.values(Object.fromEntries(finishesForFilterMap))
            );
            setSinkPositionsForFilter(Array.from(sinkPositionsForFilterSet));
            setSizesForFilter(Array.from(sizesForFilterSet));
        }

        setCompositions(filteredComposition);
    };

    const handleResetFilters = () => {
        setCompositions(structuredClone(initialCompositions));
        setFinishesForFilter(structuredClone(initialFinishesForFilter));
        setSizesForFilter(structuredClone(initialSizesForFilter));
        setSinkPositionsForFilter(
            structuredClone(initialSinkPositionsForFilter)
        );
        setCrrFilteredFinish("");
        setCrrFilteredSize("");
        setCrrFilteredSinkPosition("");
        localStorage.setItem(
            "statefulFilters",
            JSON.stringify({
                crrFilteredSize: "",
                crrFilteredSinkPosition: "",
                crrFilteredFinish: "",
            })
        );
    };

    useEffect(() => {
        const statefulFiltersJSON = localStorage.getItem("statefulFilters");
        if (statefulFiltersJSON) {
            const statefulFilters: StatefulFilterObj =
                JSON.parse(statefulFiltersJSON);

            if (
                statefulFilters.crrFilteredFinish ||
                statefulFilters.crrFilteredSize ||
                statefulFilters.crrFilteredSinkPosition
            )
                handleFilter("stateful filters", statefulFilters);
        }
    }, []);
    console.log(initialCompositions);
    console.log(compositions);
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
                    <Filter
                        filterTitle="Filter By Sink Position"
                        contentType="sink position"
                        values={sinkPositionsForFilter}
                        crrValueSelected={crrFilteredSinkPosition}
                        onFilter={handleFilter}
                    />
                    <FinishesFilter
                        filterTitle="Filter By Color"
                        contentType="finishes"
                        values={finishesForFilter}
                        crrValueSelected={crrFilteredFinish}
                        onFilter={handleFilter}
                    />
                    <button
                        className={classes.resetFiltersButton}
                        onClick={handleResetFilters}
                    >
                        RESET FILTERS
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
