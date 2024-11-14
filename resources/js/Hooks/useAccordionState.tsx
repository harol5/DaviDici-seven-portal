import { useState } from "react";
import { Item } from "../Models/ModelConfigTypes";

function useAccordionState() {
    // |===== ACCORDION =====| (repeated logic)
    const [accordionState, setAccordionState] = useState<Record<Item, boolean>>(
        {
            vanity: true,
            sideUnit: false,
            washbasin: false,
            wallUnit: false,
            tallUnit: false,
            drawerBase: false,
            mirror: false,
            accessory: false,
        }
    );

    const handleAccordionState = (item: Item) => {
        const key = item as keyof typeof accordionState;
        const updatedAccordionState = structuredClone(accordionState);
        const crrItemAccordionState = updatedAccordionState[key];
        updatedAccordionState[key] = !crrItemAccordionState;
        setAccordionState(updatedAccordionState);
    };

    const handleOrderedAccordion = (
        item: Item,
        accordionsOrder: any,
        type: "previous" | "next"
    ) => {
        const itemIndex = accordionsOrder.indexOf(item);
        const orderedAccordion = {
            vanity: false,
            sideUnit: false,
            washbasin: false,
            wallUnit: false,
            tallUnit: false,
            drawerBase: false,
            mirror: false,
            accessory: false,
        };

        if (type === "previous") {
            const previousItem = accordionsOrder[itemIndex - 1] as Item;
            orderedAccordion[previousItem] = true;
        }

        if (type === "next") {
            const nextItem = accordionsOrder[itemIndex + 1] as Item;
            orderedAccordion[nextItem] = true;
        }

        orderedAccordion[item] = false;
        setAccordionState(orderedAccordion);
    };

    return { accordionState, handleAccordionState, handleOrderedAccordion };
}

export default useAccordionState;
