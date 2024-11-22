import { Composition } from "./Composition";
import { ProductInventory } from "./Product";

export type Option = {
    code: string;
    imgUrl: string;
    title: string;
    validSkus: string[];
    isDisabled: boolean;
};

export type FinishObj = {
    type: string;
    finish: string;
    url: string;
};

export type SinkPositionObj = {
    name: string;
    url: string;
};

export type ModelObj = {
    name: string;
    url: string;
};

// export type OtherItems = {
//     wallUnit: ProductInventory[];
//     tallUnit: ProductInventory[];
//     accessory: ProductInventory[];
//     mirror: ProductInventory[];
//     drawerBase?: ProductInventory[];
// };

export type ShoppingCartProduct = {
    composition: Composition;
    configuration: any;
    description: string;
    label: string;
    vanity: ProductInventory | null; // CHANGED
    sideUnits: ProductInventory[]; // CHANGED
    washbasin: ProductInventory | null; // CHANGED
    otherProducts: OtherItems; // CHANGED
    isDoubleSink: boolean;
    isDoubleSideunit: boolean;
    quantity: number; // REMOVED
    grandTotal: number;
};

//===============================================

export type ShoppingCartCompositionProduct = {
    type: string;
    productObj: ProductInventory | null;
    quantity: number;
    unitPrice: number;
    total: number;
};
export type OtherItems = {
    wallUnit: ShoppingCartCompositionProduct[];
    tallUnit: ShoppingCartCompositionProduct[];
    accessory: ShoppingCartCompositionProduct[];
    mirror: ShoppingCartCompositionProduct[];
    drawerBase?: ShoppingCartCompositionProduct[];
};
export const OtherItemsLoopUp = {
    "WALL UNIT": "wallUnit",
    "TALL UNIT/LINEN CLOSET": "tallUnit",
    ACCESSORY: "accessory",
    MIRROR: "mirror",
    "DRAWER/VANITY": "drawerBase",
    TOP: "top",
    "VESSEL SINK": "vesselSink",
};
export type ShoppingCartComposition = {
    composition: Composition;
    configuration: any;
    description: string;
    label: string;
    vanity?: ShoppingCartCompositionProduct | undefined | null;
    sideUnits: ShoppingCartCompositionProduct[];
    washbasin?: ShoppingCartCompositionProduct | undefined | null;
    otherProducts: OtherItems;
    isDoubleSink: boolean;
    isDoubleSideUnit: boolean;
    grandTotal: number;
};

//===============================================

export type OtherProductsAvailable = {
    accessories: ProductInventory[];
    drawersVanities: ProductInventory[];
    mirrors: ProductInventory[];
    tallUnitsLinenClosets: ProductInventory[];
    tops: ProductInventory[];
    vesselSinks: ProductInventory[];
    wallUnits: ProductInventory[];
};

export type ExpressProgramMaps = {
    vanitiesAndSideUnitsMap: Map<any, any>;
    validCompositionSizesMap: Map<any, any>;
    otherProductsMap: Map<any, any>;
    sharedItemsMap: Map<any, any>;
};

export type ExpressProgramData = {
    initialCompositions: Composition[];
    initialSizesForFilter: string[];
    initialFinishesForFilter: FinishObj[];
    initialSinkPositionsForFilter: SinkPositionObj[];
    initialModelsForFilter: ModelObj[];
};

export type ListingType = "fullInventory" | "onSale";

export const ModelsAvailable = {
    BRERA: 1,
    ELORA: 2,
    "FLORA 17": 3,
    "FLORA 20": 4,
    KORA: 5,
    "KORA XL": 6,
    MARGI: 7,
    MINI: 8,
    "NEW BALI": 9,
    "NEW YORK": 10,
    OPERA: 11,
    ORIALI: 12,
    PETRA: 13,
    RAFFAELLO: 14,
};

export type ModelsAvailableKeys = keyof typeof ModelsAvailable;
