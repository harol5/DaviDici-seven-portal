import { ReactNode } from "react";
import classes from "../../../css/item-properties-accordion.module.css";

interface ItemPropertiesAccordionProps {
    children?: ReactNode;
    headerTitle: string;
}

function ItemPropertiesAccordion({
    children,
    headerTitle,
}: ItemPropertiesAccordionProps) {
    return (
        <section className={classes.itemPropertiesAccordion}>
            <div className={classes.itemPropertiesHeader}>
                <h2 className={classes.headerTitle}>{headerTitle}</h2>
                <img
                    className={classes.triangleDownIcon}
                    src={`https://${location.hostname}/images/triangle-down.svg`}
                    alt="triangle pointing down"
                />
            </div>
            <div className={classes.propertiesWrapper}>{children}</div>
        </section>
    );
}

export default ItemPropertiesAccordion;
