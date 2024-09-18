import * as Margi from "./MargiConfigTypes";
import * as NewYork from "./NewYorkConfigTypes";
import * as Mirror from "./MirrorConfigTypes";
import * as Elora from "./EloraConfigTypes";

type Item =
    | Margi.Vanity
    | Margi.OpenUnit
    | Margi.WallUnit
    | Margi.SideCabinet
    | NewYork.Vanity
    | NewYork.SideUnit
    | NewYork.WallUnit
    | NewYork.TallUnit
    | Elora.Vanity
    | {};

type Model =
    | typeof Margi.Name
    | typeof NewYork.Name
    | typeof Mirror.Name
    | typeof Elora.Name;
type SkuLengthObj =
    | typeof Margi.SkuLengths
    | typeof NewYork.SkuLengths
    | typeof Mirror.SkuLengths
    | typeof Elora.SkuLengths;

type ModelCurrConfig = {
    label: string;
    vanity: Margi.Vanity | NewYork.Vanity | Elora.Vanity;
    vanitySku: string;
    vanityPrice: number;
    washbasin: string;
    washbasinPrice: number;
    isDoubleSink: boolean;
};

export type { Item, Model, ModelCurrConfig };

export const SkuLengthModels: Record<Model, SkuLengthObj> = {
    MARGI: Margi.SkuLengths,
    "NEW YORK": NewYork.SkuLengths,
    MIRROR: Mirror.SkuLengths,
    ELORA: Elora.SkuLengths,
};
