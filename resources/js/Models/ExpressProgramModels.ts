import { Composition } from "./Composition";
import { ProductInventory } from "./Product";

export type Option = {
    code: string;
    imgUrl: string;
    title: string;
    validSkus: string[];
    isDisabled: boolean;
};

export type finish = {
    type: string;
    finish: string;
    url: string;
};

export type sinkPosition = {
    name: string;
    url: string;
};

export type model = {
    name: string;
    url: string;
};

export type shoppingCartProduct = {
    composition: Composition;
    description: string;
    label: string;
    vanity: ProductInventory;
    sideUnits: ProductInventory[];
    washbasin: ProductInventory;
    otherProducts: ProductInventory[];
    isDoubleSink: boolean;
    isDoubleSideunit: boolean;
    quantity: number;
    grandTotal: number;
};
