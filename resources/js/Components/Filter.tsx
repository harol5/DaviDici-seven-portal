import classes from "../../css/express-program.module.css";
import type { finish } from "../Models/ExpressProgramModels";

interface FilterProps {
    filterTitle: string;
    contentType: "images" | "sizes";
    values: string[] | { finish: string; url: string }[];
    crrValueSelected: string;
    onFilter: (filter: string, value: string) => void;
}

function Filter({
    filterTitle,
    contentType,
    values,
    crrValueSelected,
    onFilter: handleFilter,
}: FilterProps) {
    return (
        <section className={classes.titleAndFilterWrapper}>
            <div className={classes.titleWrapper}>
                <h1>{filterTitle}</h1>
            </div>

            {contentType === "sizes" && (
                <div className={classes.sizeFilterWrapper}>
                    {values.map((value, index) => {
                        const size = value as string;
                        return (
                            <span
                                key={index}
                                className={
                                    crrValueSelected === size
                                        ? `${classes.sizeFilter} ${classes.sizeFilterValueSelected} `
                                        : classes.sizeFilter
                                }
                                onClick={() => handleFilter(contentType, size)}
                            >
                                <p>{size}</p>
                            </span>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default Filter;
