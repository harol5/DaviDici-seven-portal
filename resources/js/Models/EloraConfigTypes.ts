import { Option } from "./ExpressProgramModels";

export const Name = "ELORA";

type Vanity = {
    baseSku: string;
    mattFinish: string;
    glassFinish: string;
};

type WallUnit = {
    baseSku: string;
    mattFinish: string;
    glassFinish: string;
};

type TallUnit = {
    baseSku: string;
    mattFinish: string;
    glassFinish: string;
};

type CurrentConfiguration = {
    label: string;
    vanity: Vanity;
    vanitySku: string;
    vanityPrice: number;
    washbasin: string;
    washbasinPrice: number;
    isDoubleSink: boolean;
    wallUnit: WallUnit | null;
    wallUnitSku: string;
    wallUnitPrice: number;
    tallUnit: TallUnit | null;
    tallUnitSku: string;
    tallUnitPrice: number;
    accessory: string;
    accessoryPrice: number;
};

type VanityOptions = {
    baseSku: string;
    mattFinishOptions: Option[];
    glassFinishOptions: Option[];
};

type WallUnitOptions = {
    baseSku: string;
    mattFinishOptions: Option[];
    glassFinishOptions: Option[];
};

type TallUnitOptions = {
    baseSku: string;
    mattFinishOptions: Option[];
    glassFinishOptions: Option[];
};

export type {
    Vanity,
    WallUnit,
    TallUnit,
    CurrentConfiguration,
    VanityOptions,
    WallUnitOptions,
    TallUnitOptions,
};

export const SkuLengths = {
    vanity: 3,
    wallUnit: 3,
    tallUnit: 3,
};
