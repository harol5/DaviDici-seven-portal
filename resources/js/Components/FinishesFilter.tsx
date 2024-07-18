import { useMemo } from "react";
import classes from "../../css/express-program.module.css";
import type { finish } from "../Models/ExpressProgramModels";

interface FinishesFilterProps {
    filterTitle: string;
    contentType: "images" | "sizes";
    values: finish[];
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
            lacquered: [] as finish[],
            glass: [] as finish[],
            melamine: [] as finish[],
        };

        values.forEach((value) => {
            if (value.type === "LACQUERED") obj.lacquered.push(value);
            if (value.type === "LACQUERED / GLASS") obj.glass.push(value);
            if (value.type === "MELAMINE") obj.melamine.push(value);
        });

        return obj;
    }, [values]);

    return (
        <section className={classes.titleAndFinishesFilterWrapper}>
            <div className={classes.titleWrapper}>
                <h1>{filterTitle}</h1>
            </div>

            <div className={classes.allFinishTypesWrapper}>
                {finishTypes.melamine.length !== 0 && (
                    <div className={classes.finishTypeWrapper}>
                        <h1 className={classes.finishTypeLabel}>MELAMINE</h1>
                        <div className={classes.finishFilterWrapper}>
                            {finishTypes.melamine.map((value, index) => {
                                const finishObj = value as finish;
                                return (
                                    <div
                                        key={index}
                                        className={
                                            classes.labelAndFinishWrapper
                                        }
                                    >
                                        <img
                                            className={
                                                crrValueSelected ===
                                                finishObj.finish
                                                    ? `${classes.finishFilter} ${classes.finishFilterValueSelected} `
                                                    : classes.finishFilter
                                            }
                                            src={finishObj.url}
                                            onClick={() =>
                                                handleFilter(
                                                    contentType,
                                                    finishObj.finish
                                                )
                                            }
                                        />
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
                                const finishObj = value as finish;
                                return (
                                    <div
                                        key={index}
                                        className={
                                            classes.labelAndFinishWrapper
                                        }
                                    >
                                        <img
                                            className={
                                                crrValueSelected ===
                                                finishObj.finish
                                                    ? `${classes.finishFilter} ${classes.finishFilterValueSelected} `
                                                    : classes.finishFilter
                                            }
                                            src={finishObj.url}
                                            onClick={() =>
                                                handleFilter(
                                                    contentType,
                                                    finishObj.finish
                                                )
                                            }
                                        />
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
                                const finishObj = value as finish;
                                return (
                                    <div
                                        key={index}
                                        className={
                                            classes.labelAndFinishWrapper
                                        }
                                    >
                                        <img
                                            className={
                                                crrValueSelected ===
                                                finishObj.finish
                                                    ? `${classes.finishFilter} ${classes.finishFilterValueSelected} `
                                                    : classes.finishFilter
                                            }
                                            src={finishObj.url}
                                            onClick={() =>
                                                handleFilter(
                                                    contentType,
                                                    finishObj.finish
                                                )
                                            }
                                        />
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
            </div>
        </section>
    );
}

export default FinishesFilter;
