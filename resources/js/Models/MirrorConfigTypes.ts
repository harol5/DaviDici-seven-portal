import type { Option } from "./ExpressProgramModels";

export type mirrorCategories = "mirrorCabinet" | "ledMirror" | "openCompMirror";

export type MirrorCabinetsOptions = {
    baseSku: string;
    sizeOptions: Option[];
    finishOptions: Option[];
};
