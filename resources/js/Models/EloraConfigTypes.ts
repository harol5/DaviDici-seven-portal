import { Option } from "./ExpressProgramModels";

export const Name = "ELORA";

type Vanity = {
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
};

type VanityOptions = {
    baseSku: string;
    mattFinishOptions: Option[];
    glassFinishOptions: Option[];
};

export type { Vanity, CurrentConfiguration, VanityOptions };

export const SkuLengths = {
    vanity: 3,
};
