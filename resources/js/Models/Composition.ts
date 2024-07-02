import type { ProductInventory } from "./Product";

export type Composition = {
    name: string;
    size: string;
    vanities: ProductInventory[];
    sideUnits: ProductInventory[];
    washbasins: ProductInventory[];
};
