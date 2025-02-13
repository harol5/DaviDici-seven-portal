import * as Margi from "./MargiConfigTypes";
import * as NewYork from "./NewYorkConfigTypes";
import * as Mirror from "./MirrorConfigTypes";
import * as Elora from "./EloraConfigTypes";
import * as NewBali from "./NewBaliConfigTypes";
import * as Opera from "./OperaConfigTypes";
import * as Kora from "./KoraConfigTypes";
import * as KoraXl from "./KoraXlConfigTypes";

type ModelCurrentConfiguration = Margi.CurrentConfiguration | NewYork.CurrentConfiguration |  Elora.CurrentConfiguration | NewBali.CurrentConfiguration | Opera.CurrentConfiguration | Kora.CurrentConfiguration | KoraXl.CurrentConfiguration;

type ItemObj =
    | Margi.Vanity
    | Margi.OpenUnit
    | Margi.WallUnit
    | Margi.SideCabinet
    | NewYork.Vanity
    | NewYork.SideUnit
    | NewYork.WallUnit
    | NewYork.TallUnit
    | Elora.Vanity
    | Elora.WallUnit
    | Elora.TallUnit
    | NewBali.Vanity
    | NewBali.SideUnit
    | NewBali.DrawerBase
    | NewBali.WallUnit
    | Opera.Vanity
    | Opera.SideUnit
    | Kora.Vanity
    | KoraXl.Vanity
    | {};

type Item = Opera.Item | NewYork.Item;

type ItemFoxPro =
    | "VANITY"
    | "SIDE UNIT"
    | "ACCESSORY"
    | "DRAWER/VANITY"
    | "MIRROR"
    | "TALL UNIT/LINEN CLOSET"
    | "TOP"
    | "VESSEL SINK"
    | "WALL UNIT"
    | "WASHBASIN/SINK";

type Model =
    | typeof Margi.Name
    | typeof NewYork.Name
    | typeof Mirror.Name
    | typeof Elora.Name
    | typeof NewBali.Name
    | typeof Opera.Name
    | typeof Kora.Name
    | typeof KoraXl.Name;

type SkuLengthObj =
    | typeof Margi.SkuLengths
    | typeof NewYork.SkuLengths
    | typeof Mirror.SkuLengths
    | typeof Elora.SkuLengths
    | typeof NewBali.SkuLengths
    | typeof Opera.SkuLengths
    | typeof Kora.SkuLengths
    | typeof KoraXl.SkuLengths;

type ModelCurrConfig = {
    label: string;
    vanity:
        | Margi.Vanity
        | NewYork.Vanity
        | Elora.Vanity
        | NewBali.Vanity
        | Opera.Vanity
        | Kora.Vanity
        | KoraXl.Vanity;
    vanitySku: string;
    vanityPrice: number;
    washbasin: string;
    washbasinPrice: number;
    isDoubleSink: boolean;
};

export type {ItemObj, Model, ModelCurrConfig, Item, ItemFoxPro, ModelCurrentConfiguration};

export const SkuLengthModels: Record<Model, SkuLengthObj> = {
    MARGI: Margi.SkuLengths,
    "NEW YORK": NewYork.SkuLengths,
    MIRROR: Mirror.SkuLengths,
    ELORA: Elora.SkuLengths,
    "NEW BALI": NewBali.SkuLengths,
    OPERA: Opera.SkuLengths,
    KORA: Kora.SkuLengths,
    "KORA XL": KoraXl.SkuLengths,
};
