import { ReactNode } from "react";
import classes from "../../../css/item-properties-accordion.module.css";
import type { Item } from "../../Models/ModelConfigTypes";

interface ItemPropertiesAccordionProps {
    children?: ReactNode;
    headerTitle: string;
    item: Item;
    isOpen: boolean;
    onClick: (item: Item) => void;
}

function ItemPropertiesAccordion({
    children,
    headerTitle,
    item,
    isOpen,
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
        <section className={classes.itemPropertiesAccordion}>
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
            <div className={getAccordionClasses()}>{children}</div>
        </section>
    );
}

export default ItemPropertiesAccordion;
