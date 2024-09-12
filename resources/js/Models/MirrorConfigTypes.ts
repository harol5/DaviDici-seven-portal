import type { Option } from "./ExpressProgramModels";

export type mirrorCategories = "mirrorCabinet" | "ledMirror" | "openCompMirror";

export type MirrorCabinetsOptions = {
    baseSku: string;
    sizeOptions: Option[];
    finishOptions: Option[];
};

export type MirrorCabinet = {
    baseSku: string;
    size: string;
    finish: string;
};

export type MirrorConfig = {
    mirrorCabinet: MirrorCabinet;
    mirrorCabinetSku: string;
    mirrorCabinetPrice: number;
    ledMirror: string;
    ledMirrorPrice: number;
    openCompMirror: string;
    openCompMirrorPrice: number;
};
