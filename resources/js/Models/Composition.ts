import type { ProductInventory } from "./Product";
import type { FinishObj, OtherProductsAvailable } from "./ExpressProgramModels";

export type Composition = {
    model: string;
    name: string;
    compositionImage: string;
    size: string;
    sinkPosition: string;
    startingPrice: number;
    vanities: ProductInventory[];
    finishes: FinishObj[];
    sideUnits: ProductInventory[];
    washbasins: ProductInventory[];
    otherProductsAvailable: OtherProductsAvailable;
};
