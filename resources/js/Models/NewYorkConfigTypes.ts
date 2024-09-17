import type { Option } from "./ExpressProgramModels";
import { MirrorConfig } from "./MirrorConfigTypes";

export const Name = "NEW YORK";

type Vanity = {
    baseSku: string;
    handle: string;
    finish: string;
};

type SideUnit = {
    baseSku: string;
    handle: string;
    position: string;
    finish: string;
};

type WallUnit = {
    baseSku: string;
    handle: string;
    finish: string;
};

type TallUnit = {
    baseSku: string;
    handle: string;
    finish: string;
};

type VanityOptions = {
    baseSku: string;
    handleOptions: Option[];
    finishOptions: Option[];
};

type SideUnitOptions = {
    baseSku: string;
    handleOptions: Option[];
    position: string;
    finishOptions: Option[];
};

type WallUnitOptions = {
    baseSku: string;
    handleOptions: Option[];
    finishOptions: Option[];
};

type TallUnitOptions = {
    baseSku: string;
    handleOptions: Option[];
    finishOptions: Option[];
};

type CurrentConfiguration = MirrorConfig & {
    label: string;
    vanity: Vanity;
    vanitySku: string;
    vanityPrice: number;
    isDoubleSink: boolean;
    isDoubleSideUnit: boolean;
    sideUnit: SideUnit | null;
    sideUnitSku: string;
    sideUnitPrice: number;
    washbasin: string;
    washbasinPrice: number;
    wallUnit: WallUnit | null;
    wallUnitSku: string;
    wallUnitPrice: number;
    tallUnit: TallUnit | null;
    tallUnitSku: string;
    tallUnitPrice: number;
    accessory: string;
    accessoryPrice: number;
};

export type {
    Vanity,
    SideUnit,
    WallUnit,
    TallUnit,
    VanityOptions,
    SideUnitOptions,
    WallUnitOptions,
    TallUnitOptions,
    CurrentConfiguration,
};

export const SkuLengths = {
    vanity: 3,
    sideUnit: 4,
    wallUnit: 3,
    tallUnit: 3,
    mirrorCabinet: 3,
};
