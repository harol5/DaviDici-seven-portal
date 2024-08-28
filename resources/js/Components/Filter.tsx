import classes from "../../css/express-program.module.css";
import type { sinkPosition, model } from "../Models/ExpressProgramModels";

interface FilterProps {
    filterTitle: string;
    contentType: "sizes" | "sink position" | "models";
    values: string[] | sinkPosition[];
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
                {crrValueSelected && (
                    <button onClick={() => handleFilter(contentType, "")}>
                        reset
                    </button>
                )}
            </div>

            {contentType === "sizes" && (
                <div className={classes.filterWrapper}>
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

            {contentType === "sink position" && (
                <div className={classes.filterWrapper}>
                    {values.map((value, index) => {
                        const sinkPosition = value as sinkPosition;
                        return (
                            <div
                                key={index}
                                className={
                                    crrValueSelected === sinkPosition.name
                                        ? `${classes.sinkPositionFilter} ${classes.sinkPositionFilterSelected} `
                                        : classes.sinkPositionFilter
                                }
                                onClick={() =>
                                    handleFilter(contentType, sinkPosition.name)
                                }
                            >
                                <div className={classes.imageAndOverlayWrapper}>
                                    <img
                                        src={sinkPosition.url}
                                        alt="picture of sink"
                                    />
                                    <div
                                        className={classes.filterOverlay}
                                    ></div>
                                </div>
                                <p>{sinkPosition.name}</p>
                            </div>
                        );
                    })}
                </div>
            )}

            {contentType === "models" && (
                <div className={classes.filterWrapper}>
                    {values.map((value, index) => {
                        const model = value as model;
                        return (
                            <div
                                key={index}
                                className={
                                    crrValueSelected === model.name
                                        ? `${classes.modelFilter} ${classes.modelFilterSelected} `
                                        : classes.modelFilter
                                }
                                onClick={() =>
                                    handleFilter(contentType, model.name)
                                }
                            >
                                <div className={classes.imageAndOverlayWrapper}>
                                    <img
                                        src={model.url}
                                        alt="picture of model"
                                        onError={(e) => {
                                            (
                                                e.target as HTMLImageElement
                                            ).onerror = null;
                                            (e.target as HTMLImageElement).src =
                                                "https://portal.davidici.com/images/express-program/not-image.jpg";
                                        }}
                                    />
                                    <div
                                        className={classes.filterOverlay}
                                    ></div>
                                </div>
                                <p>{model.name}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default Filter;
