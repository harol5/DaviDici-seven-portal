import { ReactNode } from "react";
import classes from "../../../css/item-properties-accordion.module.css";
import type { Item } from "../../Models/ModelConfigTypes";
import { MirrorCategory } from "../../Models/MirrorConfigTypes";

type onNextSignature = (
    item: Item,
    accordionsOrder: any,
    type: "previous" | "next"
) => void;
type onClearSignature = (item: Item | MirrorCategory) => void;
type ButtonType =
    | "next"
    | "clear"
    | "previous"
    | "next and clear"
    | "next and previous"
    | "clear and previous"
    | "next, clear and previous"
    | "none";

interface ItemPropertiesAccordionProps {
    children?: ReactNode;
    headerTitle: string;
    item: Item;
    isOpen: boolean;
    buttons: ButtonType;
    accordionsOrder: string[];
    onNavigation?: onNextSignature;
    onClear?: onClearSignature;
    onClick: (item: Item) => void;
}

function ItemPropertiesAccordion({
    children,
    headerTitle,
    item,
    isOpen,
    buttons,
    accordionsOrder,
    onNavigation: handleOrderedAccordion = () => {},
    onClear: handleClearItem = () => {},
    onClick: handleAccordionState,
}: ItemPropertiesAccordionProps) {
    const getAccordionClasses = () => {
        let base = classes.propertiesWrapper;
        base += isOpen ? ` ${classes.activeAccordion}` : "";
        return base;
    };

    const getTriangleIconClasses = () => {
        let base = classes.triangleDownIcon;
        base += isOpen ? ` ${classes.rotateTriangle}` : "";
        return base;
    };

    return (
        <section className={classes.itemPropertiesAccordion} id={item}>
            <div
                className={classes.itemPropertiesHeader}
                onClick={() => handleAccordionState(item)}
            >
                <h2 className={classes.headerTitle}>{headerTitle}</h2>
                <img
                    className={getTriangleIconClasses()}
                    src={`https://${location.hostname}/images/triangle-down.svg`}
                    alt="triangle pointing down"
                />
            </div>
            <div className={getAccordionClasses()}>
                {children}
                <section className={classes.accordionButtonsWrapper}>
                    {buttons && buttons === "next" ? (
                        <button
                            className={`${classes.nextButton} ${classes.alone}`}
                            onClick={() =>
                                handleOrderedAccordion(
                                    item,
                                    accordionsOrder,
                                    "next"
                                )
                            }
                        >
                            NEXT
                        </button>
                    ) : buttons === "clear" ? (
                        <button
                            className={`${classes.clearButton} ${classes.alone}`}
                            onClick={() => handleClearItem(item)}
                        >
                            CLEAR
                        </button>
                    ) : buttons === "previous" ? (
                        <button
                            className={`${classes.nextButton} ${classes.alone}`}
                            onClick={() =>
                                handleOrderedAccordion(
                                    item,
                                    accordionsOrder,
                                    "previous"
                                )
                            }
                        >
                            PREVIOUS
                        </button>
                    ) : buttons === "next and clear" ? (
                        <>
                            <button
                                className={`${classes.clearButton} ${classes.groupedTwo}`}
                                onClick={() => handleClearItem(item)}
                            >
                                CLEAR
                            </button>
                            <button
                                className={`${classes.nextButton} ${classes.groupedTwo}`}
                                onClick={() =>
                                    handleOrderedAccordion(
                                        item,
                                        accordionsOrder,
                                        "next"
                                    )
                                }
                            >
                                NEXT
                            </button>
                        </>
                    ) : buttons === "next and previous" ? (
                        <>
                            <button
                                className={`${classes.nextButton} ${classes.groupedTwo}`}
                                onClick={() =>
                                    handleOrderedAccordion(
                                        item,
                                        accordionsOrder,
                                        "previous"
                                    )
                                }
                            >
                                PREVIOUS
                            </button>
                            <button
                                className={`${classes.nextButton} ${classes.groupedTwo}`}
                                onClick={() =>
                                    handleOrderedAccordion(
                                        item,
                                        accordionsOrder,
                                        "next"
                                    )
                                }
                            >
                                NEXT
                            </button>
                        </>
                    ) : buttons === "clear and previous" ? (
                        <>
                            <button
                                className={`${classes.nextButton} ${classes.groupedTwo}`}
                                onClick={() =>
                                    handleOrderedAccordion(
                                        item,
                                        accordionsOrder,
                                        "previous"
                                    )
                                }
                            >
                                PREVIOUS
                            </button>
                            <button
                                className={`${classes.clearButton} ${classes.groupedTwo}`}
                                onClick={() => handleClearItem(item)}
                            >
                                CLEAR
                            </button>
                        </>
                    ) : buttons === "next, clear and previous" ? (
                        <>
                            <button
                                className={`${classes.nextButton} ${classes.groupedThree}`}
                                onClick={() =>
                                    handleOrderedAccordion(
                                        item,
                                        accordionsOrder,
                                        "previous"
                                    )
                                }
                            >
                                PREVIOUS
                            </button>
                            <button
                                className={`${classes.clearButton} ${classes.groupedThree}`}
                                onClick={() => handleClearItem(item)}
                            >
                                CLEAR
                            </button>
                            <button
                                className={`${classes.nextButton} ${classes.groupedThree}`}
                                onClick={() =>
                                    handleOrderedAccordion(
                                        item,
                                        accordionsOrder,
                                        "next"
                                    )
                                }
                            >
                                NEXT
                            </button>
                        </>
                    ) : null}
                </section>
            </div>
        </section>
    );
}

export default ItemPropertiesAccordion;
