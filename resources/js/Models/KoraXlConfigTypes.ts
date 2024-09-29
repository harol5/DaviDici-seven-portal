import type { Option } from "./ExpressProgramModels";

export const Name = "KORA XL";

type Vanity = { baseSku: string; finish: string };

type CurrentConfiguration = {
    label: string;
    vanity: Vanity;
    vanitySku: string;
    vanityPrice: number;
    washbasin: string;
    washbasinPrice: number;
    isDoubleSink: boolean;
    tallUnit: string;
    tallUnitPrice: number;
};

type VanityOptions = {
    baseSku: string;
    finishOptions: Option[];
};

export type { Vanity, VanityOptions, CurrentConfiguration };

export const SkuLengths = {
    vanity: 2,
};
