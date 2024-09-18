import type { Option } from "./ExpressProgramModels";
import { ProductInventory } from "./Product";

export const Name = "MIRROR";

type MirrorCategory = "mirrorCabinet" | "ledMirror" | "openCompMirror";

type MirrorCategoriesObj = {
    mirrorCabinets: ProductInventory[];
    openCompMirrors: ProductInventory[];
    ledMirrors: ProductInventory[];
};

type MirrorCabinetsOptions = {
    baseSku: string;
    sizeOptions: Option[];
    finishOptions: Option[];
};

type MirrorCabinet = {
    baseSku: string;
    size: string;
    finish: string;
};

type MirrorConfig = {
    mirrorCabinet: MirrorCabinet;
    mirrorCabinetSku: string;
    mirrorCabinetPrice: number;
    ledMirror: string;
    ledMirrorPrice: number;
    openCompMirror: string;
    openCompMirrorPrice: number;
};

export type {
    MirrorCategory,
    MirrorCategoriesObj,
    MirrorCabinetsOptions,
    MirrorConfig,
    MirrorCabinet,
};

export const SkuLengths = {
    mirrorCabinet: 3,
};
