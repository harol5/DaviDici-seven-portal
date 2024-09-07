import type { ProductInventory } from "./Product";
import type { finish, otherProductsAvailable } from "./ExpressProgramModels";

export type Composition = {
    model: string;
    name: string;
    compositionImage: string;
    size: string;
    sinkPosition: string;
    startingPrice: number;
    vanities: ProductInventory[];
    finishes: finish[];
    sideUnits: ProductInventory[];
    washbasins: ProductInventory[];
    otherProductsAvailable: otherProductsAvailable;
};
