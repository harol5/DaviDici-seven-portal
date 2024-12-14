import type { Option } from "../../Models/ExpressProgramModels";
import classes from "../../../css/product-configurator.module.css";

interface OptionsProps {
    item: string;
    property: string;
    title: string;
    options?: Option[];
    crrOptionSelected?: string;
    onOptionSelected: (item: string, property: string, option: string) => void;
}

function Options({
    item,
    property,
    title,
    options,
    crrOptionSelected,
    onOptionSelected: handleOptionSelected,
}: OptionsProps) {
    const getClassName = (option: Option): string => {
        let finalClasses = "";

        if (
            property === "finish" ||
            property === "mattFinish" ||
            property === "glassFinish"
        )
            finalClasses += `${classes.finishOption} ${classes.option}`;
        else finalClasses += `${classes.option}`;

        if (option.code === crrOptionSelected && !option.isDisabled)
            finalClasses += ` ${classes.optionSelected}`;

        if (option.isDisabled) finalClasses += ` ${classes.optionDisabled}`;

        return finalClasses;
    };

    return (
        <section className={classes.headerAndOptionsWrapper}>
            <h1 className={classes.title}>{title}</h1>
            <div className={classes.OptionsWrapper}>
                {options!.map((option, index) => {
                    return (
                        <div
                            key={index}
                            className={getClassName(option)}
                            onClick={() => {
                                !option.isDisabled
                                    ? handleOptionSelected(
                                          item,
                                          property,
                                          option.code
                                      )
                                    : null;
                            }}
                        >
                            <div className={classes.imageAndOverlayWrapper}>
                                <img
                                    src={option.imgUrl}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).onerror =
                                            null;
                                        (e.target as HTMLImageElement).src =
                                            "https://portal.davidici.com/images/express-program/not-image.jpg";
                                    }}
                                />
                                <div className={classes.imageOverlay}></div>
                            </div>
                            <p>{option.title}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default Options;
