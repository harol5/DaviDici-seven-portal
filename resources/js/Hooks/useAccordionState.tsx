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

    return { accordionState, handleAccordionState };
}

export default useAccordionState;
