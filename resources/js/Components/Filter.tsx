import classes from "../../css/express-program.module.css";

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

            {contentType === "images" && (
                <div className={classes.finishFilterWrapper}>
                    {values.map((value, index) => {
                        const finishObj = value as {
                            finish: string;
                            url: string;
                        };
                        return (
                            <div
                                key={index}
                                className={classes.labelAndFinishWrapper}
                            >
                                <img
                                    className={
                                        crrValueSelected === finishObj.finish
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
                                <p className={classes.finishFilterLabel}>
                                    {finishObj.finish}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default Filter;
