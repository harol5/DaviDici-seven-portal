import type { Option } from "../../Models/ExpressProgramModels";
import classes from "../../../css/product-configurator.module.css";

interface OptionsProps {
    item: string;
    property: string;
    title: string;
    options: Option[];
    crrOptionSelected: string;
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
    return (
        <section className={classes.titleAndOptionsWrapper}>
            <h1 className={classes.title}>{title}</h1>
            <div className={classes.OptionsWrapper}>
                {options.map((option, index) => {
                    return (
                        <div
                            key={index}
                            className={
                                crrOptionSelected === option.code
                                    ? `${classes.optionSelected} ${classes.option}`
                                    : `${classes.option}`
                            }
                            onClick={() =>
                                handleOptionSelected(
                                    item,
                                    property,
                                    option.code
                                )
                            }
                        >
                            <div className={classes.imageAndOverlayWrapper}>
                                <div className={classes.imageOverlay}></div>
                                <img src={option.imgUrl} />
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
