import { Composition } from "./Composition";
import { ProductInventory } from "./Product";

export type Option = {
    code: string;
    imgUrl: string;
    title: string;
    validSkus: string[];
    isDisabled: boolean;
};

export type FinishObj = {
    type: string;
    finish: string;
    url: string;
};

export type SinkPositionObj = {
    name: string;
    url: string;
};

export type ModelObj = {
    name: string;
    url: string;
};

export type OtherItems = {
    wallUnit: ProductInventory[];
    tallUnit: ProductInventory[];
    accessory: ProductInventory[];
    mirror: ProductInventory[];
};

export type ShoppingCartProduct = {
    composition: Composition;
    configuration: any;
    description: string;
    label: string;
    vanity: ProductInventory;
    sideUnits: ProductInventory[];
    washbasin: ProductInventory;
    otherProducts: OtherItems;
    isDoubleSink: boolean;
    isDoubleSideunit: boolean;
    quantity: number;
    grandTotal: number;
};

export type OtherProductsAvailable = {
    accessories: ProductInventory[];
    drawersVanities: ProductInventory[];
    mirrors: ProductInventory[];
    tallUnitsLinenClosets: ProductInventory[];
    tops: ProductInventory[];
    vesselSinks: ProductInventory[];
    wallUnits: ProductInventory[];
};

export const ModelsAvailable = {
    BRERA: 1,
    ELORA: 2,
    "FLORA 17": 3,
    "FLORA 20": 4,
    KORA: 5,
    "KORA XL": 6,
    MARGI: 7,
    MINI: 8,
    "NEW BALI": 9,
    "NEW YORK": 10,
    OPERA: 11,
    ORIALI: 12,
    PETRA: 13,
    RAFFAELLO: 14,
};

export type ModelsAvailableKeys = keyof typeof ModelsAvailable;
