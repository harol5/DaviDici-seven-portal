import type { Option } from "./ExpressProgramModels";
import { ProductInventory } from "./Product";
import { MirrorConfig } from "./MirrorConfigTypes";

export type vanityOptions = {
    baseSku: string;
    drawerOptions: Option[];
    handleOptions: Option[];
    finishOptions: Option[];
};

export type otherMargiProducts = {
    "WALL UNIT": ProductInventory[];
};

export type wallUnitOptions = {
    baseSku: string;
    sizeOptions: Option[];
    doorStyleOptions: Option[];
    finishOptions: Option[];
};

export type margiOpenUnitOptions = {
    baseSku: string;
    finishOptions: Option[];
};

export type margiSideCabinetOptions = {
    baseSku: string;
    doorStyleAndHandleOptions: Option[];
    finishOptions: Option[];
};

export type vanity = {
    baseSku: string;
    drawer: string;
    handle: string;
    finish: string;
};

export type margiOpenUnit = {
    baseSku: string;
    finish: string;
};

export type margiSideCabinet = {
    baseSku: string;
    doorStyleAndHandle: string;
    finish: string;
};

export type wallUnit = {
    baseSku: string;
    size: string;
    doorStyle: string;
    finish: string;
};

export type CurrentConfiguration = MirrorConfig & {
    vanity: vanity;
    vanitySku: string;
    vanityPrice: number;
    isDoubleSink: boolean;
    sideUnit: margiOpenUnit | margiSideCabinet | null;
    sideUnitType: string;
    sideUnitSku: string;
    sideUnitPrice: number;
    washbasin: string;
    washbasinPrice: number;
    wallUnit: wallUnit | null;
    wallUnitSku: string;
    wallUnitPrice: number;
    label: string;
};

export const SkuLengths = {
    wallUnit: 4,
    vanity: 4,
    openUnit: 2,
    sideCabinet: 3,
    mirrorCabinet: 3,
};
