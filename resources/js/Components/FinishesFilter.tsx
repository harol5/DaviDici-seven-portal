import { useMemo } from "react";
import classes from "../../css/express-program.module.css";
import type { FinishObj } from "../Models/ExpressProgramModels";

interface FinishesFilterProps {
    filterTitle: string;
    contentType: "finishes" | "sizes";
    values: FinishObj[];
    crrValueSelected: string;
    onFilter: (filter: string, value: string) => void;
}

function FinishesFilter({
    filterTitle,
    contentType,
    values,
    crrValueSelected,
    onFilter: handleFilter,
}: FinishesFilterProps) {
    const finishTypes = useMemo(() => {
        const obj = {
            lacquered: [] as FinishObj[],
            glass: [] as FinishObj[],
            melamine: [] as FinishObj[],
        };

        values.forEach((value) => {
            if (value.type === "LACQUERED") obj.lacquered.push(value);
            if (value.type === "MELAMINE") obj.melamine.push(value);
            if (value.type === "LACQUERED / GLASS") {
                // value.finish = value.finish
                //     .replace("MATT LACQ. ", "")
                //     .split("-")[0];

                obj.glass.push(value);
            }
        });

        return obj;
    }, [values]);

    return (
        <section className={classes.titleAndFinishesFilterWrapper}>
            <div className={classes.titleWrapper}>
                <h1>{filterTitle}</h1>
                {crrValueSelected && (
                    <button onClick={() => handleFilter(contentType, "")}>
                        Reset
                    </button>
                )}
            </div>
            <div className={classes.allFinishTypesWrapper}>
                {finishTypes.melamine.length !== 0 && (
                    <div className={classes.finishTypeWrapper}>
                        <h1 className={classes.finishTypeLabel}>MELAMINE</h1>
                        <div className={classes.finishFilterWrapper}>
                            {finishTypes.melamine.map((value, index) => {
                                const finishObj = value as FinishObj;
                                return (
                                    <div
                                        key={index}
                                        className={
                                            classes.labelAndFinishWrapper
                                        }
                                    >
                                        <div
                                            className={
                                                crrValueSelected ===
                                                finishObj.finish
                                                    ? `${classes.imageAndOverlayWrapper} ${classes.finishFilterValueSelected} `
                                                    : classes.imageAndOverlayWrapper
                                            }
                                        >
                                            <img
                                                className={classes.finishFilter}
                                                src={finishObj.url}
                                                onClick={() =>
                                                    handleFilter(
                                                        contentType,
                                                        finishObj.finish
                                                    )
                                                }
                                            />
                                            <div
                                                className={
                                                    classes.filterOverlay
                                                }
                                            ></div>
                                        </div>
                                        <p
                                            className={
                                                classes.finishFilterLabel
                                            }
                                        >
                                            {finishObj.finish}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {finishTypes.lacquered.length !== 0 && (
                    <div className={classes.finishTypeWrapper}>
                        <h1 className={classes.finishTypeLabel}>LACQUERED</h1>
                        <div className={classes.finishFilterWrapper}>
                            {finishTypes.lacquered.map((value, index) => {
                                const finishObj = value as FinishObj;
                                return (
                                    <div
                                        key={index}
                                        className={
                                            classes.labelAndFinishWrapper
                                        }
                                    >
                                        <div
                                            className={
                                                crrValueSelected ===
                                                finishObj.finish
                                                    ? `${classes.imageAndOverlayWrapper} ${classes.finishFilterValueSelected} `
                                                    : classes.imageAndOverlayWrapper
                                            }
                                        >
                                            <img
                                                className={classes.finishFilter}
                                                src={finishObj.url}
                                                onClick={() =>
                                                    handleFilter(
                                                        contentType,
                                                        finishObj.finish
                                                    )
                                                }
                                            />
                                            <div
                                                className={
                                                    classes.filterOverlay
                                                }
                                            ></div>
                                        </div>
                                        <p
                                            className={
                                                classes.finishFilterLabel
                                            }
                                        >
                                            {finishObj.finish}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {finishTypes.glass.length !== 0 && (
                    <div className={classes.finishTypeWrapper}>
                        <h1 className={classes.finishTypeLabel}>GLASS</h1>
                        <div className={classes.finishFilterWrapper}>
                            {finishTypes.glass.map((value, index) => {
                                const finishObj = value as FinishObj;
                                return (
                                    <div
                                        key={index}
                                        className={
                                            classes.labelAndFinishWrapper
                                        }
                                    >
                                        <div
                                            className={
                                                crrValueSelected ===
                                                finishObj.finish
                                                    ? `${classes.imageAndOverlayWrapper} ${classes.finishFilterValueSelected} `
                                                    : classes.imageAndOverlayWrapper
                                            }
                                        >
                                            <img
                                                className={classes.finishFilter}
                                                src={finishObj.url}
                                                onClick={() =>
                                                    handleFilter(
                                                        contentType,
                                                        finishObj.finish
                                                    )
                                                }
                                            />
                                            <div
                                                className={
                                                    classes.filterOverlay
                                                }
                                            ></div>
                                        </div>
                                        <p
                                            className={
                                                classes.finishFilterLabel
                                            }
                                        >
                                            {
                                                finishObj.finish
                                                    .replace("MATT LACQ. ", "")
                                                    .split("-")[0]
                                            }
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default FinishesFilter;
