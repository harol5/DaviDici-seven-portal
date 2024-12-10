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
    initialConfig: {
        vanityObj: Margi.Vanity | NewYork.Vanity | Elora.Vanity | NewBali.Vanity | Opera.Vanity | Kora.Vanity | KoraXl.Vanity;
        vanitySku: string;
        vanityPrice: number;
    };
    config: {
        vanityObj: Margi.Vanity | NewYork.Vanity | Elora.Vanity | NewBali.Vanity | Opera.Vanity | Kora.Vanity | KoraXl.Vanity;
        vanitySku: string;
        vanityPrice: number;
    };
    initialOptions: Margi.VanityOptions | NewYork.VanityOptions | Elora.VanityOptions | NewBali.VanityOptions | Opera.VanityOptions | Kora.VanityOptions | KoraXl.VanityOptions;
    options: Margi.VanityOptions | NewYork.VanityOptions | Elora.VanityOptions | NewBali.VanityOptions | Opera.VanityOptions | Kora.VanityOptions | KoraXl.VanityOptions;
    isSelected: boolean;
    isValid: boolean;
}

type WashbasinConfig = {
    initialConfig: {
        washbasinSku: string;
        washbasinPrice: number;
    };
    config: {
        washbasinSku: string;
        washbasinPrice: number;
    };
    initialOptions: Option[];
    options: Option[];
    isSelected: boolean;
    isValid: boolean;
}

type SideUnitConfig = {
    initialConfig: {
        sideUnitObj: Margi.OpenUnit | Margi.SideCabinet | NewBali.SideUnit | NewYork.SideUnit | Opera.SideUnit;
        sideUnitSku: string;
        sideUnitPrice: number;
    };
    config: {
        sideUnitObj: Margi.OpenUnit | Margi.SideCabinet | NewBali.SideUnit | NewYork.SideUnit | Opera.SideUnit;
        sideUnitSku: string;
        sideUnitPrice: number;
    };
    initialOptions: Margi.OpenUnitOptions | Margi.SideCabinetOptions | NewBali.SideUnitOptions | NewYork.SideUnitOptions | Opera.SideUnitOptions;
    options: Margi.OpenUnitOptions | Margi.SideCabinetOptions | NewBali.SideUnitOptions | NewYork.SideUnitOptions | Opera.SideUnitOptions;
    isSelected: boolean;
    isValid: boolean;
}

type WallUnitConfig = {
    initialConfig: {
        wallUnitObj: Margi.WallUnit | NewBali.WallUnit | NewYork.WallUnit | Opera.WallUnit | Elora.WallUnit;
        wallUnitSku: string;
        wallUnitPrice: number;
    };
    config: {
        wallUnitObj: Margi.WallUnit | NewBali.WallUnit | NewYork.WallUnit | Opera.WallUnit | Elora.WallUnit;
        wallUnitSku: string;
        wallUnitPrice: number;
    };
    initialOptions: Margi.WallUnitOptions | NewBali.WallUnitOptions | NewYork.WallUnitOptions | Opera.WallUnitOptions | Elora.WallUnitOptions;
    options: Margi.WallUnitOptions | NewBali.WallUnitOptions | NewYork.WallUnitOptions | Opera.WallUnitOptions | Elora.WallUnitOptions;
    isSelected: boolean;
    isValid: boolean;
}

type AccessoryConfig = {
    initialConfig: {
        accessorySku: string;
        accessoryPrice: number;
    };
    config: {
        accessorySku: string;
        accessoryPrice: number;
    };
    initialOptions: Option[];
    options: Option[];
    isSelected: boolean;
    isValid: boolean;
}

type TallUnitConfig = {
    initialConfig: {
        tallUnitObj: Elora.TallUnit | NewYork.TallUnit | null; // it could be null because in some models it is simple.
        tallUnitSku: string;
        tallUnitPrice: number;
    };
    config: {
        tallUnitObj: Elora.TallUnit | NewYork.TallUnit | null; // it could be null because in some models it is simple.
        tallUnitSku: string;
        tallUnitPrice: number;
    };
    initialOptions: Elora.TallUnitOptions | NewYork.TallUnitOptions | Option[];
    options: Elora.TallUnitOptions | NewYork.TallUnitOptions | Option[];
    isSelected: boolean;
    isValid: boolean;
}

type DrawerBaseConfig = {
    initialConfig: {
        drawerBaseObj: NewBali.DrawerBase | Opera.DrawerBase;
        drawerBaseSku: string;
        drawerBasePrice: number;
    };
    config: {
        drawerBaseObj: NewBali.DrawerBase | Opera.DrawerBase;
        drawerBaseSku: string;
        drawerBasePrice: number;
    };
    initialOptions: NewBali.DrawerBaseOptions | Opera.DrawerBaseOptions;
    options: NewBali.DrawerBaseOptions | Opera.DrawerBaseOptions;
    isSelected: boolean;
    isValid: boolean;
}

type ExtraItems = {
    vanity: {
        currentlyDisplay: number;
        configurations: VanityConfig[];
        currentOptions: any;
        currentConfig: any;
    };
    washbasin: {
        currentlyDisplay: number;
        configurations: WashbasinConfig[];
        currentOptions: any;
        currentConfig: any;
    };
    sideUnit: {
        currentlyDisplay: number;
        configurations: SideUnitConfig[];
        currentOptions: any;
        currentConfig: any;
    };
    wallUnit: {
        currentlyDisplay: number;
        configurations: WallUnitConfig[];
        currentOptions: any;
        currentConfig: any;
    };
    tallUnit: {
        currentlyDisplay: number;
        configurations: TallUnitConfig[];
        currentOptions: any;
        currentConfig: any;
    };
    accessory: {
        currentlyDisplay: number;
        configurations: AccessoryConfig[];
        currentOptions: any;
        currentConfig: any;
    };
    drawerBase: {
        currentlyDisplay: number;
        configurations: DrawerBaseConfig[];
        currentOptions: any;
        currentConfig: any;
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
