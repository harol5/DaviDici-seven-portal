import classes from "../../css/express-program.module.css";

interface FilterProps {
    filterTitle: string;
    contentType: "images" | "sizes";
    values: string[] | { finish: string; url: string }[];
    crrValueSelected: string;
    onFilter: (value: string) => void;
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
                <div className={classes.filterWrapper}>
                    {values.map((value, index) => {
                        const size = value as string;
                        return (
                            <span
                                key={index}
                                className={
                                    crrValueSelected === value
                                        ? `${classes.filter} ${classes.filterValueSelected} `
                                        : classes.filter
                                }
                                onClick={() => handleFilter(size)}
                            >
                                <p>{size}</p>
                            </span>
                        );
                    })}
                </div>
            )}

            {contentType === "images" && (
                <div className={classes.filterWrapper}>
                    {values.map((value, index) => {
                        const finishObj = value as {
                            finish: string;
                            url: string;
                        };
                        return (
                            <div key={index}>
                                <img
                                    className={classes.filter}
                                    src={finishObj.url}
                                    onClick={() =>
                                        handleFilter(finishObj.finish)
                                    }
                                />
                                <p>{finishObj.finish}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default Filter;
