import type { Option } from "./ExpressProgramModels";
import { MirrorConfig } from "./MirrorConfigTypes";

export const Name = "MARGI";

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

type CurrentConfiguration = MirrorConfig & {
    vanity: Vanity;
    vanitySku: string;
    vanityPrice: number;
    isDoubleSink: boolean;
    sideUnit: OpenUnit | SideCabinet | null;
    sideUnitType: string;
    sideUnitSku: string;
    sideUnitPrice: number;
    washbasin: string;
    washbasinPrice: number;
    wallUnit: WallUnit | null;
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
