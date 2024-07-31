import { useEffect, useState } from "react";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import Filter from "../../Components/Filter";
import FinishesFilter from "../../Components/FinishesFilter";
import ProductExpressProgramCard from "../../Components/ProductExpressProgramCard";
import User from "../../Models/User";
import useExpressProgramProducts from "../../Hooks/useExpressProgramProducts";
import Modal from "../../Components/Modal";
import type { ProductInventory } from "../../Models/Product";
import type { Composition } from "../../Models/Composition";
import classes from "../../../css/express-program.module.css";
import type {
    finish,
    sinkPosition,
    model,
} from "../../Models/ExpressProgramModels";

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

            let sinkPositionsForFilter: sinkPosition[] | null =
                crrFilteredSinkPosition
                    ? [
                          initialSinkPositionsForFilter.find(
                              (sinkPosition) =>
                                  sinkPosition.name === crrFilteredSinkPosition
                          )!,
                      ]
                    : null;

            let modelsForFilter: model[] | null = crrFilteredModel
                ? [
                      initialModelsForFilter.find(
                          (model) => model.name === crrFilteredModel
                      )!,
                  ]
                : null;

            if (
                !finishesForFilter ||
                !sinkPositionsForFilter ||
                !modelsForFilter
            ) {
                const finishesForFilterMap = new Map<string, finish>();
                const sinkPositionsForFilterMap = new Map<
                    string,
                    sinkPosition
                >();
                const modelsForFilterMap = new Map<string, model>();

                filteredComposition.forEach((composition) => {
                    sinkPositionsForFilterMap.set(composition.sinkPosition, {
                        name: composition.sinkPosition,
                        url: `https://portal.davidici.com/images/express-program/sink-position/${composition.sinkPosition}.webp`,
                    });

                    modelsForFilterMap.set(composition.model, {
                        name: composition.model,
                        url: `https://portal.davidici.com/images/express-program/${composition.model}/${composition.model}.webp`,
                    });

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
                    Object.values(
                        Object.fromEntries(sinkPositionsForFilterMap)
                    );

                modelsForFilter =
                    modelsForFilter ??
                    Object.values(Object.fromEntries(modelsForFilterMap));
            }

            // Set current selected size.
            setSizesForFilter([sizeValue]);
            setCrrFilteredSize(sizeValue);

            // Set available values for the other filters based on current selected size.
            setFinishesForFilter(finishesForFilter);
            setSinkPositionsForFilter(sinkPositionsForFilter);
            setModelsForFilter(modelsForFilter);
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

            let modelsForFilter: model[] | null = crrFilteredModel
                ? [
                      initialModelsForFilter.find(
                          (model) => model.name === crrFilteredModel
                      )!,
                  ]
                : null;

            if (!finishesForFilter || !sizesForFilter || !modelsForFilter) {
                const sizesForFilterSet = new Set<string>();
                const finishesForFilterMap = new Map<string, finish>();
                const modelsForFilterMap = new Map<string, model>();

                filteredComposition.forEach((composition) => {
                    sizesForFilterSet.add(composition.size);
                    modelsForFilterMap.set(composition.model, {
                        name: composition.model,
                        url: `https://portal.davidici.com/images/express-program/${composition.model}/${composition.model}.webp`,
                    });
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

                modelsForFilter =
                    modelsForFilter ??
                    Object.values(Object.fromEntries(modelsForFilterMap));
            }

            // Set current selected sink position.
            setSinkPositionsForFilter([
                initialSinkPositionsForFilter.find(
                    (sinkPosition) => sinkPosition.name === sinkPositionValue
                )!,
            ]);
            setCrrFilteredSinkPosition(sinkPositionValue);

            // Set available values for the other filters based on current selected size.
            setFinishesForFilter(finishesForFilter);
            setSizesForFilter(sizesForFilter);
            setModelsForFilter(modelsForFilter);
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

            const sizesForFilterSet = new Set<string>();
            const sinkPositionsForFilterMap = new Map<string, sinkPosition>();
            const modelsForFilterMap = new Map<string, model>();

            filteredComposition.forEach((composition) => {
                sizesForFilterSet.add(composition.size);
                sinkPositionsForFilterMap.set(composition.sinkPosition, {
                    name: composition.sinkPosition,
                    url: `https://portal.davidici.com/images/express-program/sink-position/${composition.sinkPosition}.webp`,
                });
                modelsForFilterMap.set(composition.model, {
                    name: composition.model,
                    url: `https://portal.davidici.com/images/express-program/${composition.model}/${composition.model}.webp`,
                });
            });

            const crrFinishObj = initialFinishesForFilter.find(
                (finish) => finish.finish === finishValue
            );

            setFinishesForFilter([crrFinishObj!]);
            setCrrFilteredFinish(finishValue);

            setSizesForFilter(Array.from(sizesForFilterSet));
            setSinkPositionsForFilter(
                Object.values(Object.fromEntries(sinkPositionsForFilterMap))
            );
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

            const finishesForFilterMap = new Map<string, finish>();
            const sizesForFilterSet = new Set<string>();
            const sinkPositionsForFilterMap = new Map<string, sinkPosition>();
            filteredComposition.forEach((composition) => {
                sizesForFilterSet.add(composition.size);
                sinkPositionsForFilterMap.set(composition.sinkPosition, {
                    name: composition.sinkPosition,
                    url: `https://portal.davidici.com/images/express-program/sink-position/${composition.sinkPosition}.webp`,
                });
                if (!finishesForFilter) {
                    composition.finishes.forEach((finishObj) =>
                        finishesForFilterMap.set(finishObj.finish, finishObj)
                    );
                }
            });

            finishesForFilter =
                finishesForFilter ??
                Object.values(Object.fromEntries(finishesForFilterMap));

            const crrModelObj = initialModelsForFilter.find(
                (model) => model.name === modelValue
            );

            setModelsForFilter([crrModelObj!]);
            setCrrFilteredModel(modelValue);

            setSizesForFilter(Array.from(sizesForFilterSet));
            setFinishesForFilter(finishesForFilter);
            setSinkPositionsForFilter(
                Object.values(Object.fromEntries(sinkPositionsForFilterMap))
            );
        }

        if (filter === "stateful filters") {
            const {
                crrFilteredSize,
                crrFilteredFinish,
                crrFilteredSinkPosition,
                crrFilteredModel,
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

                const hasModel =
                    !crrFilteredModel || composition.model === crrFilteredModel;

                return hasSize && hasSinkPosition && hasFinish && hasModel;
            });

            const finishesForFilterMap = new Map<string, finish>();
            const modelsForFilterMap = new Map<string, model>();
            const sinkPositionsForFilterMap = new Map<string, sinkPosition>();
            const sizesForFilterSet = new Set<string>();
            filteredComposition.forEach((composition) => {
                sizesForFilterSet.add(composition.size);
                sinkPositionsForFilterMap.set(composition.sinkPosition, {
                    name: composition.sinkPosition,
                    url: `https://portal.davidici.com/images/express-program/sink-position/${composition.sinkPosition}.webp`,
                });
                modelsForFilterMap.set(composition.model, {
                    name: composition.model,
                    url: `https://portal.davidici.com/images/express-program/${composition.model}/${composition.model}.webp`,
                });
                composition.finishes.forEach((finishObj) =>
                    finishesForFilterMap.set(finishObj.finish, finishObj)
                );
            });

            setCrrFilteredFinish(crrFilteredFinish);
            setCrrFilteredSinkPosition(crrFilteredSinkPosition);
            setCrrFilteredSize(crrFilteredSize);
            setCrrFilteredModel(crrFilteredModel);

            setFinishesForFilter(
                Object.values(Object.fromEntries(finishesForFilterMap))
            );
            setSinkPositionsForFilter(
                Object.values(Object.fromEntries(sinkPositionsForFilterMap))
            );
            setModelsForFilter(
                Object.values(Object.fromEntries(modelsForFilterMap))
            );
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
        setModelsForFilter(structuredClone(initialModelsForFilter));

        setCrrFilteredFinish("");
        setCrrFilteredSize("");
        setCrrFilteredSinkPosition("");
        setCrrFilteredModel("");
        localStorage.setItem(
            "statefulFilters",
            JSON.stringify({
                crrFilteredSize: "",
                crrFilteredSinkPosition: "",
                crrFilteredFinish: "",
                crrFilteredModel: "",
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
                statefulFilters.crrFilteredSinkPosition ||
                statefulFilters.crrFilteredModel
            )
                handleFilter("stateful filters", statefulFilters);
        }
    }, []);

    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = async () => {
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };
    console.log(compositions);
    return (
        <UserAuthenticatedLayout auth={auth} crrPage="orders">
            <div className="main-content-wrapper">
                <section className={classes.filterIconAndValuesSelectedWrapper}>
                    <button
                        onClick={handleOpenModal}
                        className={classes.filterIconButton}
                    >
                        <img
                            src={`${location.origin}/images/filters-icon.svg`}
                            alt="filter icon"
                        />
                    </button>
                    <div className={classes.valuesSelectedAndTitleWrapper}>
                        <h1>Products Filtered By:</h1>
                        <section className={classes.valuesSelectedWrapper}>
                            {crrFilteredModel && (
                                <div>
                                    <h1>Model:</h1>
                                    <p>{crrFilteredModel}</p>
                                </div>
                            )}
                            {crrFilteredSize && (
                                <div>
                                    <h1>Size:</h1>
                                    <p>{crrFilteredSize}"</p>
                                </div>
                            )}
                            {crrFilteredSinkPosition && (
                                <div>
                                    <h1>Sink Position:</h1>
                                    <p>{crrFilteredSinkPosition}</p>
                                </div>
                            )}
                            {crrFilteredFinish && (
                                <div>
                                    <h1>Finish:</h1>
                                    <p>{crrFilteredFinish}</p>
                                </div>
                            )}

                            {!crrFilteredModel &&
                            !crrFilteredSize &&
                            !crrFilteredSinkPosition &&
                            !crrFilteredFinish ? (
                                <h1>No Filters Selected</h1>
                            ) : null}
                        </section>
                    </div>
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
            <Modal
                show={openModal}
                onClose={handleCloseModal}
                customClass={classes.filtersModal}
            >
                <section className={classes.allFiltersWrapper}>
                    <div
                        className={
                            classes.resetFiltersAndCloseFilterButtonsWrapper
                        }
                    >
                        <button
                            className={classes.resetFiltersButton}
                            onClick={handleResetFilters}
                        >
                            RESET FILTERS
                        </button>
                        <button
                            className={classes.closeFilterModalButton}
                            onClick={handleCloseModal}
                        >
                            SHOW RESULTS
                        </button>
                    </div>
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
                    <Filter
                        filterTitle="Filter By Model"
                        contentType="models"
                        values={modelsForFilter}
                        crrValueSelected={crrFilteredModel}
                        onFilter={handleFilter}
                    />
                    <FinishesFilter
                        filterTitle="Filter By Color"
                        contentType="finishes"
                        values={finishesForFilter}
                        crrValueSelected={crrFilteredFinish}
                        onFilter={handleFilter}
                    />
                </section>
            </Modal>
        </UserAuthenticatedLayout>
    );
}

export default ProductsAvailable;
