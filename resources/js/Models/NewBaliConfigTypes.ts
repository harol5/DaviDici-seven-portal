import type { Option } from "./ExpressProgramModels";
import { ProductInventory } from "./Product";

export const Name = "NEW BALI";

type Vanity = {
    baseSku: string;
    drawer: string;
    vanityBase: string;
    finish: string;
};

type SideUnit = { baseSku: string; finish: string };

type DrawerBase = {
    baseSku: string;
    drawer: string;
    staticVanityDrawerCode: string;
    finish: string;
};

type WallUnit = {
    baseSku: string;
    size: string;
    type: string;
    finish: string;
};

type VanityOptions = {
    baseSku: string;
    drawerOptions: Option[];
    vanityBaseOptions: Option[];
    finishOptions: Option[];
};

type SideUnitOptions = {
    baseSku: string;
    finishOptions: Option[];
};

type DrawerBaseOptions = {
    baseSku: string;
    drawerOptions: Option[];
    staticVanityDrawerCode: string;
    finishOptions: Option[];
};

type WallUnitOptions = {
    baseSku: string;
    sizeOptions: Option[];
    typeOptions: Option[];
    finishOptions: Option[];
};

type CurrentConfiguration = {
    label: string;
    vanity: Vanity;
    vanitySku: string;
    vanityPrice: number;
    washbasin: string;
    washbasinPrice: number;
    isDoubleSink: boolean;
    sideUnit: SideUnit | null;
    sideUnitSku: string;
    sideUnitPrice: number;
    drawerBase: DrawerBase | null;
    drawerBaseSku: string;
    drawerBasePrice: number;
    wallUnit: WallUnit | null;
    wallUnitSku: string;
    wallUnitPrice: number;
    currentProducts: ProductInventory[];
};

export type {
    CurrentConfiguration,
    VanityOptions,
    SideUnitOptions,
    DrawerBaseOptions,
    WallUnitOptions,
    Vanity,
    SideUnit,
    DrawerBase,
    WallUnit,
};

export const SkuLengths = {
    vanity: 4,
    sideUnit: 2,
    drawerBase: 4,
    wallUnit: 4,
};
