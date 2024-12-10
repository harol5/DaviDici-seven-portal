import type {
    ExtraItems,
    ItemOptions,
    MainConfig,
} from "../Models/ExtraItemsHookModels.ts";
import type {Model} from "../Models/ModelConfigTypes.ts";
import {useState} from "react";
import {Option} from "../Models/ExpressProgramModels.ts";
import * as Margi from "../Models/MargiConfigTypes.ts";
import * as NewYork from "../Models/NewYorkConfigTypes";
import * as Elora from "../Models/EloraConfigTypes";
import * as NewBali from "../Models/NewBaliConfigTypes";
import * as Opera from "../Models/OperaConfigTypes";
import * as Kora from "../Models/KoraConfigTypes";
import * as KoraXl from "../Models/KoraXlConfigTypes";
import {ProductInventory} from "../Models/Product.ts";

function useExtraProductsExpressProgram(model: Model, initialMainConfig: MainConfig, mainItemsCurrentState: any ) {
    console.log("=== useExtraProductsExpressProgram ===");
    console.log("model: ", model);
    console.log("initialMainConfig: ", initialMainConfig);
    console.log("mainItemsOptions: ", mainItemsCurrentState);

    const [extraItems, setExtraItems] = useState<ExtraItems>({
        accessory: {configurations: [], currentlyDisplay: -1, currentOptions: mainItemsCurrentState.accessory?.options, currentConfig: mainItemsCurrentState.accessory?.config},
        drawerBase: {configurations: [], currentlyDisplay: -1, currentOptions: mainItemsCurrentState.drawerBase?.options, currentConfig: mainItemsCurrentState.drawerBase?.config},
        sideUnit: {configurations: [], currentlyDisplay: -1, currentOptions: mainItemsCurrentState.sideUnit?.options, currentConfig: mainItemsCurrentState.sideUnit?.config},
        tallUnit: {configurations: [], currentlyDisplay: -1, currentOptions: mainItemsCurrentState.tallUnit?.options, currentConfig: mainItemsCurrentState.tallUnit?.config},
        vanity: {configurations: [], currentlyDisplay: -1, currentOptions: mainItemsCurrentState.vanity?.options, currentConfig: mainItemsCurrentState.vanity?.config},
        wallUnit: {configurations: [], currentlyDisplay: -1, currentOptions: mainItemsCurrentState.wallUnit?.options, currentConfig: mainItemsCurrentState.wallUnit?.config},
        washbasin: {configurations: [], currentlyDisplay: -1, currentOptions: mainItemsCurrentState.washbasin?.options, currentConfig: mainItemsCurrentState.washbasin?.config},
    });

    const [extraItemsCurrentProducts, setExtraItemsCurrentProducts] = useState({
        accessory: [] as ProductInventory[],
        drawerBase: [] as ProductInventory[],
        sideUnit: [] as ProductInventory[],
        tallUnit: [] as ProductInventory[],
        vanity: [] as ProductInventory[],
        wallUnit: [] as ProductInventory[],
        washbasin: [] as ProductInventory[],
    });

    const handleAddExtraProduct = (item: keyof typeof extraItems, initialOptions: ItemOptions) => {
        const updatedExtraItems = structuredClone(extraItems);

        if (model === "KORA") {
            const mainConfig = initialMainConfig as Kora.CurrentConfiguration;
            switch (item) {
                case "vanity":
                    updatedExtraItems.vanity.configurations.push({
                        initialConfig: {
                            vanityObj: mainConfig.vanity,
                            vanitySku: mainConfig.vanitySku,
                            vanityPrice: mainConfig.vanityPrice
                        },
                        config: {
                            vanityObj: mainConfig.vanity,
                            vanitySku: mainConfig.vanitySku,
                            vanityPrice: mainConfig.vanityPrice
                        },
                        initialOptions: initialOptions as Kora.VanityOptions,
                        options: initialOptions as Kora.VanityOptions,
                        isSelected: false,
                        isValid: false
                    })
                    updatedExtraItems.vanity.currentlyDisplay = updatedExtraItems.vanity.configurations.length - 1;
                    break;
                case "washbasin":
                    updatedExtraItems.washbasin.configurations.push({
                        initialConfig: {
                            washbasinSku: mainConfig.washbasin,
                            washbasinPrice: mainConfig.washbasinPrice,
                        },
                        config: {
                            washbasinSku: mainConfig.washbasin,
                            washbasinPrice: mainConfig.washbasinPrice,
                        },
                        initialOptions: initialOptions as Option[],
                        options: initialOptions as Option[],
                        isSelected: false,
                        isValid: false,
                    })
                    updatedExtraItems.washbasin.currentlyDisplay = updatedExtraItems.washbasin.configurations.length - 1;
                    break;
                case "accessory":
                    updatedExtraItems.accessory.configurations.push({
                        initialConfig: {
                            accessorySku: mainConfig.accessory,
                            accessoryPrice: mainConfig.accessoryPrice,
                        },
                        config: {
                            accessorySku: mainConfig.accessory,
                            accessoryPrice: mainConfig.accessoryPrice,
                        },
                        initialOptions: initialOptions as Option[],
                        options: initialOptions as Option[],
                        isSelected: false,
                        isValid: false,
                    })
                    break;
                default:
                    throw new Error("Invalid item");
            }
        }

        if (model === "KORA XL") {
            const mainConfig = initialMainConfig as KoraXl.CurrentConfiguration;
            switch (item) {
                case "vanity":
                    updatedExtraItems.vanity.configurations.push({
                        initialConfig: {
                            vanityObj: mainConfig.vanity,
                            vanitySku: mainConfig.vanitySku,
                            vanityPrice: mainConfig.vanityPrice
                        },
                        config: {
                            vanityObj: mainConfig.vanity,
                            vanitySku: mainConfig.vanitySku,
                            vanityPrice: mainConfig.vanityPrice
                        },
                        initialOptions: initialOptions as KoraXl.VanityOptions,
                        options: initialOptions as KoraXl.VanityOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.vanity.currentlyDisplay = updatedExtraItems.vanity.configurations.length - 1;
                    break;
                case "washbasin":
                    updatedExtraItems.washbasin.configurations.push({
                        initialConfig: {
                            washbasinSku: mainConfig.washbasin,
                            washbasinPrice: mainConfig.washbasinPrice,
                        },
                        config: {
                            washbasinSku: mainConfig.washbasin,
                            washbasinPrice: mainConfig.washbasinPrice,
                        },
                        initialOptions: initialOptions as Option[],
                        options: initialOptions as Option[],
                        isSelected: false,
                        isValid: false,
                    })
                    updatedExtraItems.washbasin.currentlyDisplay = updatedExtraItems.washbasin.configurations.length - 1;
                    break;
                case "tallUnit":
                    updatedExtraItems.tallUnit.configurations.push({
                        initialConfig: {
                            tallUnitObj: null,
                            tallUnitSku: mainConfig.tallUnit,
                            tallUnitPrice: mainConfig.tallUnitPrice,
                        },
                        config: {
                            tallUnitObj: null,
                            tallUnitSku: mainConfig.tallUnit,
                            tallUnitPrice: mainConfig.tallUnitPrice,
                        },
                        initialOptions: initialOptions as Option[],
                        options: initialOptions as Option[],
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.tallUnit.currentlyDisplay = updatedExtraItems.tallUnit.configurations.length - 1;
                    break;
                default:
                    throw new Error("Invalid item");
            }

        }

        if (model === "ELORA") {
            const mainConfig = initialMainConfig as Elora.CurrentConfiguration;
            switch (item) {
                case "vanity":
                    updatedExtraItems.vanity.configurations.push({
                        initialConfig: {
                            vanityObj: mainConfig.vanity,
                            vanitySku: mainConfig.vanitySku,
                            vanityPrice: mainConfig.vanityPrice
                        },
                        config: {
                            vanityObj: mainConfig.vanity,
                            vanitySku: mainConfig.vanitySku,
                            vanityPrice: mainConfig.vanityPrice
                        },
                        initialOptions: initialOptions as Elora.VanityOptions,
                        options: initialOptions as Elora.VanityOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.vanity.currentlyDisplay = updatedExtraItems.vanity.configurations.length - 1;
                    break;
                case "washbasin":
                    updatedExtraItems.washbasin.configurations.push({
                        initialConfig: {
                            washbasinSku: mainConfig.washbasin,
                            washbasinPrice: mainConfig.washbasinPrice,
                        },
                        config: {
                            washbasinSku: mainConfig.washbasin,
                            washbasinPrice: mainConfig.washbasinPrice,
                        },
                        initialOptions: initialOptions as Option[],
                        options: initialOptions as Option[],
                        isSelected: false,
                        isValid: false,
                    });
                    updatedExtraItems.washbasin.currentlyDisplay = updatedExtraItems.washbasin.configurations.length - 1;
                    break;
                case "wallUnit":
                    updatedExtraItems.wallUnit.configurations.push({
                        initialConfig: {
                            wallUnitObj: mainConfig.wallUnit as Elora.WallUnit,
                            wallUnitSku: mainConfig.wallUnitSku,
                            wallUnitPrice: mainConfig.wallUnitPrice,
                        },
                        config: {
                            wallUnitObj: mainConfig.wallUnit as Elora.WallUnit,
                            wallUnitSku: mainConfig.wallUnitSku,
                            wallUnitPrice: mainConfig.wallUnitPrice,
                        },
                        initialOptions: initialOptions as Elora.WallUnitOptions,
                        options: initialOptions as Elora.WallUnitOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.wallUnit.currentlyDisplay = updatedExtraItems.wallUnit.configurations.length - 1;
                    break;
                case "tallUnit":
                    updatedExtraItems.tallUnit.configurations.push({
                        initialConfig: {
                            tallUnitObj: mainConfig.tallUnit as Elora.TallUnit,
                            tallUnitSku: mainConfig.tallUnitSku,
                            tallUnitPrice: mainConfig.tallUnitPrice,
                        },
                        config: {
                            tallUnitObj: mainConfig.tallUnit as Elora.TallUnit,
                            tallUnitSku: mainConfig.tallUnitSku,
                            tallUnitPrice: mainConfig.tallUnitPrice,
                        },
                        initialOptions: initialOptions as Elora.TallUnitOptions,
                        options: initialOptions as Elora.TallUnitOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.tallUnit.currentlyDisplay = updatedExtraItems.tallUnit.configurations.length - 1;
                    break;
                case "accessory":
                    updatedExtraItems.accessory.configurations.push({
                        initialConfig: {
                            accessorySku: mainConfig.accessory,
                            accessoryPrice: mainConfig.accessoryPrice,
                        },
                        config: {
                            accessorySku: mainConfig.accessory,
                            accessoryPrice: mainConfig.accessoryPrice,
                        },
                        initialOptions: initialOptions as Option[],
                        options: initialOptions as Option[],
                        isSelected: false,
                        isValid: false,
                    });
                    updatedExtraItems.accessory.currentlyDisplay = updatedExtraItems.accessory.configurations.length - 1;
                    break;
                default:
                    throw new Error("Invalid item");
            }
        }

        if (model === "MARGI") {
            const mainConfig = initialMainConfig as Margi.CurrentConfiguration;
            switch (item) {
                case "vanity":
                    updatedExtraItems.vanity.configurations.push({
                        initialConfig: {
                            vanityObj: mainConfig.vanity,
                            vanitySku: mainConfig.vanitySku,
                            vanityPrice: mainConfig.vanityPrice
                        },
                        config: {
                            vanityObj: mainConfig.vanity,
                            vanitySku: mainConfig.vanitySku,
                            vanityPrice: mainConfig.vanityPrice
                        },
                        initialOptions: initialOptions as Margi.VanityOptions,
                        options: initialOptions as Margi.VanityOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.vanity.currentlyDisplay = updatedExtraItems.vanity.configurations.length - 1;
                    break;
                case "washbasin":
                    updatedExtraItems.washbasin.configurations.push({
                        initialConfig: {
                            washbasinSku: mainConfig.washbasin,
                            washbasinPrice: mainConfig.washbasinPrice,
                        },
                        config: {
                            washbasinSku: mainConfig.washbasin,
                            washbasinPrice: mainConfig.washbasinPrice,
                        },
                        initialOptions: initialOptions as Option[],
                        options: initialOptions as Option[],
                        isSelected: false,
                        isValid: false,
                    });
                    updatedExtraItems.washbasin.currentlyDisplay = updatedExtraItems.washbasin.configurations.length - 1;
                    break;
                case "sideUnit":
                    updatedExtraItems.sideUnit.configurations.push({
                        initialConfig: {
                            sideUnitObj: mainConfig.sideUnit as Margi.SideCabinet | Margi.OpenUnit,
                            sideUnitSku: mainConfig.sideUnitSku,
                            sideUnitPrice: mainConfig.sideUnitPrice,
                        },
                        config: {
                            sideUnitObj: mainConfig.sideUnit as Margi.SideCabinet | Margi.OpenUnit,
                            sideUnitSku: mainConfig.sideUnitSku,
                            sideUnitPrice: mainConfig.sideUnitPrice,
                        },
                        initialOptions: initialOptions as Margi.SideCabinetOptions | Margi.OpenUnitOptions,
                        options: initialOptions as Margi.SideCabinetOptions | Margi.OpenUnitOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.sideUnit.currentlyDisplay = updatedExtraItems.sideUnit.configurations.length - 1;
                    break;
                case "wallUnit":
                    updatedExtraItems.wallUnit.configurations.push({
                        initialConfig: {
                            wallUnitObj: mainConfig.wallUnit as Margi.WallUnit,
                            wallUnitSku: mainConfig.wallUnitSku,
                            wallUnitPrice: mainConfig.wallUnitPrice,
                        },
                        config: {
                            wallUnitObj: mainConfig.wallUnit as Margi.WallUnit,
                            wallUnitSku: mainConfig.wallUnitSku,
                            wallUnitPrice: mainConfig.wallUnitPrice,
                        },
                        initialOptions: initialOptions as Margi.WallUnitOptions,
                        options: initialOptions as Margi.WallUnitOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.wallUnit.currentlyDisplay = updatedExtraItems.wallUnit.configurations.length - 1;
                    break;
                default:
                    throw new Error("Invalid item");
            }
        }

        if (model === "NEW YORK") {
            const mainConfig = initialMainConfig as NewYork.CurrentConfiguration;
            switch (item) {
                case "vanity":
                    updatedExtraItems.vanity.configurations.push({
                        initialConfig: {
                            vanityObj: mainConfig.vanity,
                            vanitySku: mainConfig.vanitySku,
                            vanityPrice: mainConfig.vanityPrice
                        },
                        config: {
                            vanityObj: mainConfig.vanity,
                            vanitySku: mainConfig.vanitySku,
                            vanityPrice: mainConfig.vanityPrice
                        },
                        initialOptions: initialOptions as NewYork.VanityOptions,
                        options: initialOptions as NewYork.VanityOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.vanity.currentlyDisplay = updatedExtraItems.vanity.configurations.length - 1;
                    break;
                case "washbasin":
                    updatedExtraItems.washbasin.configurations.push({
                        initialConfig: {
                            washbasinSku: mainConfig.washbasin,
                            washbasinPrice: mainConfig.washbasinPrice,
                        },
                        config: {
                            washbasinSku: mainConfig.washbasin,
                            washbasinPrice: mainConfig.washbasinPrice,
                        },
                        initialOptions: initialOptions as Option[],
                        options: initialOptions as Option[],
                        isSelected: false,
                        isValid: false,
                    });
                    updatedExtraItems.washbasin.currentlyDisplay = updatedExtraItems.washbasin.configurations.length - 1;
                    break;
                case "sideUnit":
                    updatedExtraItems.sideUnit.configurations.push({
                        initialConfig: {
                            sideUnitObj: mainConfig.sideUnit as NewYork.SideUnit,
                            sideUnitSku: mainConfig.sideUnitSku,
                            sideUnitPrice: mainConfig.sideUnitPrice,
                        },
                        config: {
                            sideUnitObj: mainConfig.sideUnit as NewYork.SideUnit,
                            sideUnitSku: mainConfig.sideUnitSku,
                            sideUnitPrice: mainConfig.sideUnitPrice,
                        },
                        initialOptions: initialOptions as NewYork.SideUnitOptions,
                        options: initialOptions as NewYork.SideUnitOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.sideUnit.currentlyDisplay = updatedExtraItems.sideUnit.configurations.length - 1;
                    break;
                case "wallUnit":
                    updatedExtraItems.wallUnit.configurations.push({
                        initialConfig: {
                            wallUnitObj: mainConfig.wallUnit as NewYork.WallUnit,
                            wallUnitSku: mainConfig.wallUnitSku,
                            wallUnitPrice: mainConfig.wallUnitPrice,
                        },
                        config: {
                            wallUnitObj: mainConfig.wallUnit as NewYork.WallUnit,
                            wallUnitSku: mainConfig.wallUnitSku,
                            wallUnitPrice: mainConfig.wallUnitPrice,
                        },
                        initialOptions: initialOptions as NewYork.WallUnitOptions,
                        options: initialOptions as NewYork.WallUnitOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.wallUnit.currentlyDisplay = updatedExtraItems.wallUnit.configurations.length - 1;
                    break;
                case "tallUnit":
                    updatedExtraItems.tallUnit.configurations.push({
                        initialConfig: {
                            tallUnitObj: mainConfig.tallUnit as NewYork.TallUnit,
                            tallUnitSku: mainConfig.tallUnitSku,
                            tallUnitPrice: mainConfig.tallUnitPrice,
                        },
                        config: {
                            tallUnitObj: mainConfig.tallUnit as NewYork.TallUnit,
                            tallUnitSku: mainConfig.tallUnitSku,
                            tallUnitPrice: mainConfig.tallUnitPrice,
                        },
                        initialOptions: initialOptions as NewYork.TallUnitOptions,
                        options: initialOptions as NewYork.TallUnitOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.tallUnit.currentlyDisplay = updatedExtraItems.tallUnit.configurations.length - 1;
                    break;
                case "accessory":
                    updatedExtraItems.accessory.configurations.push({
                        initialConfig: {
                            accessorySku: mainConfig.accessory,
                            accessoryPrice: mainConfig.accessoryPrice,
                        },
                        config: {
                            accessorySku: mainConfig.accessory,
                            accessoryPrice: mainConfig.accessoryPrice,
                        },
                        initialOptions: initialOptions as Option[],
                        options: initialOptions as Option[],
                        isSelected: false,
                        isValid: false,
                    });
                    updatedExtraItems.accessory.currentlyDisplay = updatedExtraItems.accessory.configurations.length - 1;
                    break;
                default:
                    throw new Error("Invalid item");
            }
        }

        if (model === "NEW BALI") {
            const mainConfig = initialMainConfig as NewBali.CurrentConfiguration;
            switch (item) {
                case "vanity":
                    updatedExtraItems.vanity.configurations.push({
                        initialConfig: {
                            vanityObj: mainConfig.vanity,
                            vanitySku: mainConfig.vanitySku,
                            vanityPrice: mainConfig.vanityPrice
                        },
                        config: {
                            vanityObj: mainConfig.vanity,
                            vanitySku: mainConfig.vanitySku,
                            vanityPrice: mainConfig.vanityPrice
                        },
                        initialOptions: initialOptions as NewBali.VanityOptions,
                        options: initialOptions as NewBali.VanityOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.vanity.currentlyDisplay = updatedExtraItems.vanity.configurations.length - 1;
                    break;
                case "washbasin":
                    updatedExtraItems.washbasin.configurations.push({
                        initialConfig: {
                            washbasinSku: mainConfig.washbasin,
                            washbasinPrice: mainConfig.washbasinPrice,
                        },
                        config: {
                            washbasinSku: mainConfig.washbasin,
                            washbasinPrice: mainConfig.washbasinPrice,
                        },
                        initialOptions: initialOptions as Option[],
                        options: initialOptions as Option[],
                        isSelected: false,
                        isValid: false,
                    });
                    updatedExtraItems.washbasin.currentlyDisplay = updatedExtraItems.washbasin.configurations.length - 1;
                    break;
                case "sideUnit":
                    updatedExtraItems.sideUnit.configurations.push({
                        initialConfig: {
                            sideUnitObj: mainConfig.sideUnit as NewBali.SideUnit,
                            sideUnitSku: mainConfig.sideUnitSku,
                            sideUnitPrice: mainConfig.sideUnitPrice,
                        },
                        config: {
                            sideUnitObj: mainConfig.sideUnit as NewBali.SideUnit,
                            sideUnitSku: mainConfig.sideUnitSku,
                            sideUnitPrice: mainConfig.sideUnitPrice,
                        },
                        initialOptions: initialOptions as NewBali.SideUnitOptions,
                        options: initialOptions as NewBali.SideUnitOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.sideUnit.currentlyDisplay = updatedExtraItems.sideUnit.configurations.length - 1;
                    break;
                case "drawerBase":
                    updatedExtraItems.drawerBase.configurations.push({
                        initialConfig: {
                            drawerBaseObj: mainConfig.drawerBase as NewBali.DrawerBase,
                            drawerBaseSku: mainConfig.drawerBaseSku,
                            drawerBasePrice: mainConfig.drawerBasePrice,
                        },
                        config: {
                            drawerBaseObj: mainConfig.drawerBase as NewBali.DrawerBase,
                            drawerBaseSku: mainConfig.drawerBaseSku,
                            drawerBasePrice: mainConfig.drawerBasePrice,
                        },
                        initialOptions: initialOptions as NewBali.DrawerBaseOptions,
                        options: initialOptions as NewBali.DrawerBaseOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.drawerBase.currentlyDisplay = updatedExtraItems.drawerBase.configurations.length - 1;
                    break;
                case "wallUnit":
                    updatedExtraItems.wallUnit.configurations.push({
                        initialConfig: {
                            wallUnitObj: mainConfig.wallUnit as NewBali.WallUnit,
                            wallUnitSku: mainConfig.wallUnitSku,
                            wallUnitPrice: mainConfig.wallUnitPrice,
                        },
                        config: {
                            wallUnitObj: mainConfig.wallUnit as NewBali.WallUnit,
                            wallUnitSku: mainConfig.wallUnitSku,
                            wallUnitPrice: mainConfig.wallUnitPrice,
                        },
                        initialOptions: initialOptions as NewBali.WallUnitOptions,
                        options: initialOptions as NewBali.WallUnitOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.wallUnit.currentlyDisplay = updatedExtraItems.wallUnit.configurations.length - 1;
                    break;
                default:
                    throw new Error("Invalid item");
            }
        }

        if (model === "OPERA") {
            const mainConfig = initialMainConfig as Opera.CurrentConfiguration;
            switch (item) {
                case "vanity":
                    updatedExtraItems.vanity.configurations.push({
                        initialConfig: {
                            vanityObj: mainConfig.vanity,
                            vanitySku: mainConfig.vanitySku,
                            vanityPrice: mainConfig.vanityPrice
                        },
                        config: {
                            vanityObj: mainConfig.vanity,
                            vanitySku: mainConfig.vanitySku,
                            vanityPrice: mainConfig.vanityPrice
                        },
                        initialOptions: initialOptions as Opera.VanityOptions,
                        options: initialOptions as Opera.VanityOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.vanity.currentlyDisplay = updatedExtraItems.vanity.configurations.length - 1;
                    break;
                case "washbasin":
                    updatedExtraItems.washbasin.configurations.push({
                        initialConfig: {
                            washbasinSku: mainConfig.washbasin,
                            washbasinPrice: mainConfig.washbasinPrice,
                        },
                        config: {
                            washbasinSku: mainConfig.washbasin,
                            washbasinPrice: mainConfig.washbasinPrice,
                        },
                        initialOptions: initialOptions as Option[],
                        options: initialOptions as Option[],
                        isSelected: false,
                        isValid: false,
                    });
                    updatedExtraItems.washbasin.currentlyDisplay = updatedExtraItems.washbasin.configurations.length - 1;
                    break;
                case "sideUnit":
                    updatedExtraItems.sideUnit.configurations.push({
                        initialConfig: {
                            sideUnitObj: mainConfig.sideUnit as Opera.SideUnit,
                            sideUnitSku: mainConfig.sideUnitSku,
                            sideUnitPrice: mainConfig.sideUnitPrice,
                        },
                        config: {
                            sideUnitObj: mainConfig.sideUnit as Opera.SideUnit,
                            sideUnitSku: mainConfig.sideUnitSku,
                            sideUnitPrice: mainConfig.sideUnitPrice,
                        },
                        initialOptions: initialOptions as Opera.SideUnitOptions,
                        options: initialOptions as Opera.SideUnitOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.sideUnit.currentlyDisplay = updatedExtraItems.sideUnit.configurations.length - 1;
                    break;
                case "wallUnit":
                    updatedExtraItems.wallUnit.configurations.push({
                        initialConfig: {
                            wallUnitObj: mainConfig.wallUnit as Opera.WallUnit,
                            wallUnitSku: mainConfig.wallUnitSku,
                            wallUnitPrice: mainConfig.wallUnitPrice,
                        },
                        config: {
                            wallUnitObj: mainConfig.wallUnit as Opera.WallUnit,
                            wallUnitSku: mainConfig.wallUnitSku,
                            wallUnitPrice: mainConfig.wallUnitPrice,
                        },
                        initialOptions: initialOptions as Opera.WallUnitOptions,
                        options: initialOptions as Opera.WallUnitOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.wallUnit.currentlyDisplay = updatedExtraItems.wallUnit.configurations.length - 1;
                    break;
                case "tallUnit":
                    updatedExtraItems.tallUnit.configurations.push({
                        initialConfig: {
                            tallUnitObj: null,
                            tallUnitSku: mainConfig.tallUnit,
                            tallUnitPrice: mainConfig.tallUnitPrice,
                        },
                        config: {
                            tallUnitObj: null,
                            tallUnitSku: mainConfig.tallUnit,
                            tallUnitPrice: mainConfig.tallUnitPrice,
                        },
                        initialOptions: initialOptions as Option[],
                        options: initialOptions as Option[],
                        isSelected: false,
                        isValid: false,
                    });
                    updatedExtraItems.tallUnit.currentlyDisplay = updatedExtraItems.tallUnit.configurations.length - 1;
                    break;
                case "drawerBase":
                    updatedExtraItems.drawerBase.configurations.push({
                        initialConfig: {
                            drawerBaseObj: mainConfig.drawerBase as Opera.DrawerBase,
                            drawerBaseSku: mainConfig.drawerBaseSku,
                            drawerBasePrice: mainConfig.drawerBasePrice,
                        },
                        config: {
                            drawerBaseObj: mainConfig.drawerBase as Opera.DrawerBase,
                            drawerBaseSku: mainConfig.drawerBaseSku,
                            drawerBasePrice: mainConfig.drawerBasePrice,
                        },
                        initialOptions: initialOptions as Opera.DrawerBaseOptions,
                        options: initialOptions as Opera.DrawerBaseOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.drawerBase.currentlyDisplay = updatedExtraItems.drawerBase.configurations.length - 1;
                    break;
                default:
                    throw new Error("Invalid item");
            }
        }

        if (model === "MIRROR") {
            console.log("MIRROR");
        }

        setCurrentOptionsAndConfiguration(
            item,
            updatedExtraItems[item].currentlyDisplay,
            updatedExtraItems,
        );
        setExtraItems(updatedExtraItems);
    }

    const setCurrentDisplayItem = (item: keyof typeof extraItems, index: number) => {
        console.log("setCurrentDisplayItem")
        const updatedExtraItems = structuredClone(extraItems);
        updatedExtraItems[item].currentlyDisplay = index;
        setCurrentOptionsAndConfiguration(
            item,
            index,
            updatedExtraItems,
        );
        setExtraItems(updatedExtraItems);
    }

    const removeConfiguration = (item: keyof typeof extraItems, index: number) => {
        const updatedExtraItems = structuredClone(extraItems);
        updatedExtraItems[item].configurations.splice(index, 1);
        updatedExtraItems[item].currentlyDisplay = updatedExtraItems[item].configurations.length - 1;

        setExtraItemsCurrentProducts(prevState => {
            const updatedProducts = structuredClone(prevState);
            updatedProducts[item].splice(index, 1);
            return updatedProducts;
        });

        setCurrentOptionsAndConfiguration(
            item,
            updatedExtraItems[item].currentlyDisplay,
            updatedExtraItems,
        );

        setExtraItems(updatedExtraItems);
    }

    const handleOptionSelected = (
        item: keyof typeof extraItems,
        index: number,
        updatedConfig: any,
        updatedOptions:any,
        isValid:boolean,
        product: ProductInventory | null
    ) => {
        const updatedExtraItems = structuredClone(extraItems);
        updatedExtraItems[item].configurations[index].config = updatedConfig;
        updatedExtraItems[item].configurations[index].options = updatedOptions;
        updatedExtraItems[item].configurations[index].isSelected = true;
        updatedExtraItems[item].configurations[index].isValid = isValid;

        if (product) setExtraItemsCurrentProducts(prevState => {
            const updatedProducts = structuredClone(prevState);
            updatedProducts[item][index] = product;
            return updatedProducts;
        });

        setCurrentOptionsAndConfiguration(
            item,
            index,
            updatedExtraItems,
        );

        setExtraItems(updatedExtraItems);
    }

    const clearExtraProduct = (item: keyof typeof extraItems, index: number) => {
        const updatedExtraItems = structuredClone(extraItems);
        updatedExtraItems[item].configurations[index].config = updatedExtraItems[item].configurations[index].initialConfig;
        updatedExtraItems[item].configurations[index].options = updatedExtraItems[item].configurations[index].initialOptions;
        updatedExtraItems[item].configurations[index].isSelected = false;
        updatedExtraItems[item].configurations[index].isValid = false;

        setExtraItemsCurrentProducts(prevState => {
            const updatedProducts = structuredClone(prevState);
            updatedProducts[item].splice(index, 1);
            return updatedProducts;
        });

        setCurrentOptionsAndConfiguration(
            item,
            index,
            updatedExtraItems,
        );

        setExtraItems(updatedExtraItems);
    }

    const setCurrentOptionsAndConfiguration = (item: keyof typeof extraItems, index: number, updatedExtraItems:ExtraItems) => {
        if (index !== -1) {
            updatedExtraItems[item].currentOptions = updatedExtraItems[item].configurations[index].options;
            updatedExtraItems[item].currentConfig = updatedExtraItems[item].configurations[index].config;
        }else {
            updatedExtraItems[item].currentOptions = mainItemsCurrentState[item].options;
            updatedExtraItems[item].currentConfig = mainItemsCurrentState[item].config;
        }
    }

    const updateOnMainConfigChanges = (item: keyof typeof extraItems, options:any, config: any) => {
        const updatedExtraItems = structuredClone(extraItems);
        updatedExtraItems[item].currentConfig = config;
        updatedExtraItems[item].currentOptions = options;
        setExtraItems(updatedExtraItems);
    }

    return {extraItems,extraItemsCurrentProducts,handleAddExtraProduct,setCurrentDisplayItem,removeConfiguration,handleOptionSelected, updateOnMainConfigChanges,clearExtraProduct};
}

export default useExtraProductsExpressProgram;
