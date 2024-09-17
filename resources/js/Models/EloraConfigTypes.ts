import { Option } from "./ExpressProgramModels";

export type Vanity = {
    baseSku: string;
    mattFinish: string;
    glassFinish: string;
};

export type CurrentConfiguration = {
    vanity: Vanity;
    isDoubleSink: boolean;
    washbasin: string;
    label: string;
};

export type VanityOptions = {
    baseSku: string;
    mattFinishOptions: Option[];
    glassFinishOptions: Option[];
};
