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

    const handleOrderedAccordion = (item: Item, nextItem: Item) => {
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
        orderedAccordion[item] = false;
        orderedAccordion[nextItem] = true;
        setAccordionState(orderedAccordion);
    };

    return { accordionState, handleAccordionState, handleOrderedAccordion };
}

export default useAccordionState;
