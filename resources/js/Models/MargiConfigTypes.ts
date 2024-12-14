import type {Option} from "./ExpressProgramModels";
import {ProductInventory} from "./Product";

export const Name = "MARGI";

type VanityOptions = {
    baseSku: string;
    drawerOptions: Option[];
    handleOptions: Option[];
    finishOptions: Option[];
};

type WallUnitOptions = {
    baseSku: string;
    sizeOptions: Option[];
    doorStyleOptions: Option[];
    finishOptions: Option[];
};

type OpenUnitOptions = {
    baseSku: string;
    finishOptions: Option[];
};

type SideCabinetOptions = {
    baseSku: string;
    doorStyleAndHandleOptions: Option[];
    finishOptions: Option[];
};

type Vanity = {
    baseSku: string;
    drawer: string;
    handle: string;
    finish: string;
};

type OpenUnit = {
    baseSku: string;
    finish: string;
};

type SideCabinet = {
    baseSku: string;
    doorStyleAndHandle: string;
    finish: string;
};

type WallUnit = {
    baseSku: string;
    size: string;
    doorStyle: string;
    finish: string;
};

type CurrentConfiguration = {
    label: string;
    vanity: Vanity;
    vanitySku: string;
    vanityPrice: number;
    washbasin: string;
    washbasinPrice: number;
    isDoubleSink: boolean;
    sideUnit: OpenUnit | SideCabinet | null;
    sideUnitType: string;
    sideUnitSku: string;
    sideUnitPrice: number;
    wallUnit: WallUnit | null;
    wallUnitSku: string;
    wallUnitPrice: number;
    currentProducts: ProductInventory[];
};


export const SkuLengths = {
    wallUnit: 4,
    vanity: 4,
    openUnit: 2,
    sideCabinet: 3,
};

export type {
    Vanity,
    OpenUnit,
    SideCabinet,
    WallUnit,
    VanityOptions,
    WallUnitOptions,
    OpenUnitOptions,
    SideCabinetOptions,
    CurrentConfiguration,
};
