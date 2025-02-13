import { useEffect, useState } from "react";
import Filter from "../../Components/Filter";
import FinishesFilter from "../../Components/FinishesFilter";
import ProductExpressProgramCard from "../../Components/ProductExpressProgramCard";
import Modal from "../../Components/Modal";
import type { Composition } from "../../Models/Composition";
import classes from "../../../css/express-program.module.css";
import type {
    FinishObj,
    SinkPositionObj,
    ModelObj,    
    ExpressProgramData,
} from "../../Models/ExpressProgramModels";

interface StatefulFilterObj {
    crrFilteredFinish: string;
    crrFilteredSize: string;
    crrFilteredSinkPosition: string;
    crrFilteredModel: string;
}

interface CompositionsListingProps {
    data: ExpressProgramData;    
}

function CompositionsListing({
    data,    
}: CompositionsListingProps) {
    const {
        initialCompositions,
        initialSizesForFilter,
        initialFinishesForFilter,
        initialSinkPositionsForFilter,
        initialModelsForFilter,
    } = data;

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

    // --- Manage Modal filter.
    const [openFiltersModal, setOpenFiltersModal] = useState(false);

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
            statefulFilters.crrFilteredSize = value as string;
            setCrrFilteredSize(value as string);
        }

        if (filter === "sink position") {
            statefulFilters.crrFilteredSinkPosition = value as string;
            setCrrFilteredSinkPosition(value as string);
        }

        if (filter === "finishes") {
            statefulFilters.crrFilteredFinish = value as string;
            setCrrFilteredFinish(value as string);
        }

        if (filter === "models") {
            statefulFilters.crrFilteredModel = value as string;
            setCrrFilteredModel(value as string);
        }

        if (filter === "stateful filters") {
            const {
                crrFilteredSize,
                crrFilteredFinish,
                crrFilteredSinkPosition,
                crrFilteredModel,
            } = value as StatefulFilterObj;

            statefulFilters.crrFilteredSize = crrFilteredSize;
            statefulFilters.crrFilteredFinish = crrFilteredFinish;
            statefulFilters.crrFilteredSinkPosition = crrFilteredSinkPosition;
            statefulFilters.crrFilteredModel = crrFilteredModel;

            setCrrFilteredSize(crrFilteredSize);
            setCrrFilteredSinkPosition(crrFilteredSinkPosition);
            setCrrFilteredFinish(crrFilteredFinish);
            setCrrFilteredModel(crrFilteredModel);
        }

        // Updates local storage object for stateful filters.
        if (filter !== "stateful filters") {
            localStorage.setItem(
                "statefulFilters",
                JSON.stringify(statefulFilters)
            );
        }

        filteredComposition = initialCompositions.filter((composition) => {
            const hasSize =
                !statefulFilters.crrFilteredSize ||
                composition.size === statefulFilters.crrFilteredSize;

            const hasSinkPosition =
                !statefulFilters.crrFilteredSinkPosition ||
                composition.sinkPosition ===
                    statefulFilters.crrFilteredSinkPosition;

            const hasFinish =
                !statefulFilters.crrFilteredFinish ||
                composition.finishes.some(
                    (finish) =>
                        finish.finish === statefulFilters.crrFilteredFinish
                );

            const hasModel =
                !statefulFilters.crrFilteredModel ||
                composition.model === statefulFilters.crrFilteredModel;

            return hasSize && hasSinkPosition && hasFinish && hasModel;
        });

        const finishesForFilterMap = new Map<string, FinishObj>();
        const modelsForFilterMap = new Map<string, ModelObj>();
        const sinkPositionsForFilterMap = new Map<string, SinkPositionObj>();
        const sizesForFilterSet = new Set<string>();

        filteredComposition.forEach((composition) => {
            if (composition.model === "MIRRORS") {
                modelsForFilterMap.set("MIRRORS", {
                    name: "MIRRORS",
                    url: `https://${location.hostname}/images/express-program/mirrors/main.webp`,
                });
            } else {
                sizesForFilterSet.add(composition.size);

                sinkPositionsForFilterMap.set(composition.sinkPosition, {
                    name: composition.sinkPosition,
                    url: `https://${location.hostname}/images/express-program/sink-position/${composition.sinkPosition}.webp`,
                });

                modelsForFilterMap.set(composition.model, {
                    name: composition.model,
                    url: `https://${location.hostname}/images/express-program/${composition.model}/${composition.model}.webp`,
                });

                composition.finishes.forEach((finishObj) =>
                    finishesForFilterMap.set(finishObj.finish, finishObj)
                );
            }
        });

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

    return (
        <>
            <section className={classes.filterIconAndValuesSelectedWrapper}>
                <button
                    onClick={() => setOpenFiltersModal(true)}
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
            <Modal
                show={openFiltersModal}
                onClose={() => setOpenFiltersModal(false)}
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
                            onClick={() => setOpenFiltersModal(false)}
                        >
                            SHOW RESULTS
                        </button>
                    </div>
                    <section
                        className={classes.sizeAndSinkPositionFiltersWrapper}
                    >
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
                    </section>
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
        </>
    );
}

export default CompositionsListing;
