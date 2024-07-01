import classes from "../../css/express-program.module.css";

interface FilterProps {
    filterTitle: string;
    contentType: "images" | "sizes";
    values: string[];
    onFilter: (value: string) => void;
}

function Filter({
    filterTitle,
    contentType,
    values,
    onFilter: handleFilter,
}: FilterProps) {
    return (
        <section className={classes.titleAndFilterWrapper}>
            <div className={classes.titleWrapper}>
                <h1>{filterTitle}</h1>
            </div>

            {contentType === "sizes" && (
                <div className={classes.filterWrapper}>
                    {values.map((value, index) => (
                        <span
                            key={index}
                            className={classes.filter}
                            onClick={() => handleFilter(value)}
                        >
                            <p>{value}</p>
                        </span>
                    ))}
                </div>
            )}

            {contentType === "images" && (
                <div className={classes.filterWrapper}>
                    {values.map((value, index) => (
                        <img
                            key={index}
                            className={classes.filter}
                            src={value}
                            onClick={() => handleFilter(value)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default Filter;
