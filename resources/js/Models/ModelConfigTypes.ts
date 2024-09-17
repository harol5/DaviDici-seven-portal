import * as Margi from "./MargiConfigTypes";
import * as NewYork from "./NewYorkConfigTypes";

type Item =
    | Margi.Vanity
    | Margi.OpenUnit
    | Margi.WallUnit
    | Margi.SideCabinet
    | NewYork.Vanity
    | NewYork.SideUnit
    | NewYork.WallUnit
    | NewYork.TallUnit
    | {};

type Model = typeof Margi.Name | typeof NewYork.Name;
type SkuLengthObj = typeof Margi.SkuLengths | typeof NewYork.SkuLengths;

export const SkuLengthModels: Record<Model, SkuLengthObj> = {
    MARGI: Margi.SkuLengths,
    "NEW YORK": NewYork.SkuLengths,
};

export type { Item, Model };
