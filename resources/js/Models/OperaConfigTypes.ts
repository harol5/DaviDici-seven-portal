import type { Option } from "./ExpressProgramModels";

export const Name = "OPERA";

type Vanity = { baseSku: string; finish: string };

type SideUnit = {
    baseSku: string;
    type: string;
    size: string;
    finish: string;
};

type WallUnit = {
    baseSku: string;
    type: string;
    size: string;
    finish: string;
};

type DrawerBase = {
    baseSku: string;
    type: string;
    size: string;
    finish: string;
};

type CurrentConfiguration = {
    label: string;
    vanity: Vanity;
    vanitySku: string;
    vanityPrice: number;
    sideUnit: SideUnit | null;
    sideUnitSku: string;
    sideUnitPrice: number;
    isDoubleSideUnit: boolean;
    washbasin: string;
    washbasinPrice: number;
    isDoubleSink: boolean;
    wallUnit: WallUnit | null;
    wallUnitSku: string;
    wallUnitPrice: number;
    tallUnit: string;
    tallUnitPrice: number;
    drawerBase: DrawerBase | null;
    drawerBaseSku: string;
    drawerBasePrice: number;
};

type VanityOptions = {
    baseSku: string;
    finishOptions: Option[];
};

type SideUnitOptions = {
    baseSku: string;
    typeOptions: Option[];
    size: string;
    finishOptions: Option[];
};

type WallUnitOptions = {
    baseSku: string;
    typeOptions: Option[];
    sizeOptions: Option[];
    finishOptions: Option[];
};

type DrawerBaseOptions = {
    baseSku: string;
    type: string;
    sizeOptions: Option[];
    finishOptions: Option[];
};

export type {
    Vanity,
    VanityOptions,
    SideUnit,
    SideUnitOptions,
    WallUnit,
    WallUnitOptions,
    DrawerBase,
    DrawerBaseOptions,
    CurrentConfiguration,
};

export const SkuLengths = {
    vanity: 2,
    sideUnit: 4,
    wallUnit: 4,
};
