import type { ProductInventory } from "./Product";

export type Composition = {
    model: string;
    name: string;
    compositionImage: string;
    size: string;
    vanities: ProductInventory[];
    finishes: {
        finish: string;
        url: string;
    }[];
    sideUnits: ProductInventory[];
    washbasins: ProductInventory[];
    otherProductsAvailable: {} | null;
};
