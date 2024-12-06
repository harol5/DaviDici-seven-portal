import * as Margi from "./MargiConfigTypes";
import * as NewYork from "./NewYorkConfigTypes";
import * as Elora from "./EloraConfigTypes";
import * as NewBali from "./NewBaliConfigTypes";
import * as Opera from "./OperaConfigTypes";
import * as Kora from "./KoraConfigTypes";
import * as KoraXl from "./KoraXlConfigTypes";
import {Option} from "./ExpressProgramModels.ts";

type ItemOptions =
    Margi.VanityOptions
    | NewYork.VanityOptions
    | Elora.VanityOptions
    | NewBali.VanityOptions
    | Opera.VanityOptions
    | Kora.VanityOptions
    | KoraXl.VanityOptions
    | Option[]
    | Margi.OpenUnitOptions
    | Margi.SideCabinetOptions
    | NewBali.SideUnitOptions
    | NewYork.SideUnitOptions
    | Opera.SideUnitOptions
    | Margi.WallUnitOptions
    | NewBali.WallUnitOptions
    | NewYork.WallUnitOptions
    | Opera.WallUnitOptions
    | Elora.WallUnitOptions
    | Elora.TallUnitOptions
    | NewYork.TallUnitOptions
    | NewBali.DrawerBaseOptions
    | Opera.DrawerBaseOptions;

type MainConfig =
    Margi.CurrentConfiguration
    | NewYork.CurrentConfiguration
    | Elora.CurrentConfiguration
    | NewBali.CurrentConfiguration
    | Opera.CurrentConfiguration
    | Kora.CurrentConfiguration
    | KoraXl.CurrentConfiguration;

type ItemConfig = VanityConfig | WashbasinConfig | SideUnitConfig | WallUnitConfig | AccessoryConfig | TallUnitConfig | DrawerBaseConfig;

type VanityConfig = {
    config: {
        vanityObj: Margi.Vanity | NewYork.Vanity | Elora.Vanity | NewBali.Vanity | Opera.Vanity | Kora.Vanity | KoraXl.Vanity;
        vanitySku: string;
        vanityPrice: number;
    };
    options: Margi.VanityOptions | NewYork.VanityOptions | Elora.VanityOptions | NewBali.VanityOptions | Opera.VanityOptions | Kora.VanityOptions | KoraXl.VanityOptions;
    isSelected: boolean;
    isValid: boolean;
}

type WashbasinConfig = {
    config: {
        washbasinSku: string;
        washbasinPrice: number;
    };
    options: Option[];
    isSelected: boolean;
    isValid: boolean;
}

type SideUnitConfig = {
    config: {
        sideUnitObj: Margi.OpenUnit | Margi.SideCabinet | NewBali.SideUnit | NewYork.SideUnit | Opera.SideUnit;
        sideUnitSku: string;
        sideUnitPrice: number;
    };
    options: Margi.OpenUnitOptions | Margi.SideCabinetOptions | NewBali.SideUnitOptions | NewYork.SideUnitOptions | Opera.SideUnitOptions;
    isSelected: boolean;
    isValid: boolean;
}

type WallUnitConfig = {
    config: {
        wallUnitObj: Margi.WallUnit | NewBali.WallUnit | NewYork.WallUnit | Opera.WallUnit | Elora.WallUnit;
        wallUnitSku: string;
        wallUnitPrice: number;
    };
    options: Margi.WallUnitOptions | NewBali.WallUnitOptions | NewYork.WallUnitOptions | Opera.WallUnitOptions | Elora.WallUnitOptions;
    isSelected: boolean;
    isValid: boolean;
}

type AccessoryConfig = {
    config: {
        accessorySku: string;
        accessoryPrice: number;
    };
    options: Option[];
    isSelected: boolean;
    isValid: boolean;
}

type TallUnitConfig = {
    config: {
        tallUnitObj: Elora.TallUnit | NewYork.TallUnit | null; // it could be null because in some models it is simple.
        tallUnitSku: string;
        tallUnitPrice: number;
    };
    options: Elora.TallUnitOptions | NewYork.TallUnitOptions | Option[];
    isSelected: boolean;
    isValid: boolean;
}

type DrawerBaseConfig = {
    config: {
        drawerBaseObj: NewBali.DrawerBase | Opera.DrawerBase;
        drawerBaseSku: string;
        drawerBasePrice: number;
    };
    options: NewBali.DrawerBaseOptions | Opera.DrawerBaseOptions;
    isSelected: boolean;
    isValid: boolean;
}

type ExtraItems = {
    vanity: {
        currentlyDisplay: number;
        configurations: VanityConfig[];
    };
    washbasin: {
        currentlyDisplay: number;
        configurations: WashbasinConfig[];
    };
    sideUnit: {
        currentlyDisplay: number;
        configurations: SideUnitConfig[];
    };
    wallUnit: {
        currentlyDisplay: number;
        configurations: WallUnitConfig[];
    };
    tallUnit: {
        currentlyDisplay: number;
        configurations: TallUnitConfig[];
    };
    accessory: {
        currentlyDisplay: number;
        configurations: AccessoryConfig[];
    };
    drawerBase: {
        currentlyDisplay: number;
        configurations: DrawerBaseConfig[];
    };
}

export type {
    ExtraItems,
    VanityConfig,
    WashbasinConfig,
    SideUnitConfig,
    WallUnitConfig,
    AccessoryConfig,
    TallUnitConfig,
    DrawerBaseConfig,
    ItemOptions,
    MainConfig,
    ItemConfig
};
