import type { ProductInventory } from "./Product";

export type Composition = {
    model: string;
    name: string;
    compositionImage: string;
    size: string;
    startingPrice: number;
    vanities: ProductInventory[];
    finishes: {
        finish: string;
        url: string;
    }[];
    sideUnits: ProductInventory[];
    washbasins: ProductInventory[];
    otherProductsAvailable: {} | null;
};
