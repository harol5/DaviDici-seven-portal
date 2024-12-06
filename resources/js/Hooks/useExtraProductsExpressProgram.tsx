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

/*
* TODO:
*  - add button to each item section to test the handleAddExtraProduct.
*  - think how to generate the list that displays the # of products configs per item.
*  - continue working on the methods that will hook to ech event handlers on the main configurator.
*
* */

function useExtraProductsExpressProgram(model: Model, initialMainConfig: MainConfig) {
    const [extraItems, setExtraItems] = useState<ExtraItems>({
        accessory: {configurations: [], currentlyDisplay: -1},
        drawerBase: {configurations: [], currentlyDisplay: -1},
        sideUnit: {configurations: [], currentlyDisplay: -1},
        tallUnit: {configurations: [], currentlyDisplay: -1},
        vanity: {configurations: [], currentlyDisplay: -1},
        wallUnit: {configurations: [], currentlyDisplay: -1},
        washbasin: {configurations: [], currentlyDisplay: -1}
    });
    const handleAddExtraProduct = (item: keyof typeof extraItems, initialOptions: ItemOptions) => {
        const updatedExtraItems = structuredClone(extraItems);

        if (model === "KORA") {
            const mainConfig = initialMainConfig as Kora.CurrentConfiguration;
            switch (item) {
                case "vanity":
                    updatedExtraItems.vanity.configurations.push({
                        config: {
                            vanityObj: mainConfig.vanity,
                            vanitySku: mainConfig.vanitySku,
                            vanityPrice: mainConfig.vanityPrice
                        },
                        options: initialOptions as Kora.VanityOptions,
                        isSelected: false,
                        isValid: false
                    })
                    updatedExtraItems.vanity.currentlyDisplay = updatedExtraItems.vanity.configurations.length - 1;
                    break;
                case "washbasin":
                    updatedExtraItems.washbasin.configurations.push({
                        config: {
                            washbasinSku: mainConfig.washbasin,
                            washbasinPrice: mainConfig.washbasinPrice,
                        },
                        options: initialOptions as Option[],
                        isSelected: false,
                        isValid: false,
                    })
                    updatedExtraItems.washbasin.currentlyDisplay = updatedExtraItems.washbasin.configurations.length - 1;
                    break;
                case "accessory":
                    updatedExtraItems.accessory.configurations.push({
                        config: {
                            accessorySku: mainConfig.accessory,
                            accessoryPrice: mainConfig.accessoryPrice,
                        },
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
                        config: {
                            vanityObj: mainConfig.vanity,
                            vanitySku: mainConfig.vanitySku,
                            vanityPrice: mainConfig.vanityPrice
                        },
                        options: initialOptions as KoraXl.VanityOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.vanity.currentlyDisplay = updatedExtraItems.vanity.configurations.length - 1;
                    break;
                case "washbasin":
                    updatedExtraItems.washbasin.configurations.push({
                        config: {
                            washbasinSku: mainConfig.washbasin,
                            washbasinPrice: mainConfig.washbasinPrice,
                        },
                        options: initialOptions as Option[],
                        isSelected: false,
                        isValid: false,
                    })
                    updatedExtraItems.washbasin.currentlyDisplay = updatedExtraItems.washbasin.configurations.length - 1;
                    break;
                case "tallUnit":
                    updatedExtraItems.tallUnit.configurations.push({
                        config: {
                            tallUnitObj: null,
                            tallUnitSku: mainConfig.tallUnit,
                            tallUnitPrice: mainConfig.tallUnitPrice,
                        },
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
                        config: {
                            vanityObj: mainConfig.vanity,
                            vanitySku: mainConfig.vanitySku,
                            vanityPrice: mainConfig.vanityPrice
                        },
                        options: initialOptions as Elora.VanityOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.vanity.currentlyDisplay = updatedExtraItems.vanity.configurations.length - 1;
                    break;
                case "washbasin":
                    updatedExtraItems.washbasin.configurations.push({
                        config: {
                            washbasinSku: mainConfig.washbasin,
                            washbasinPrice: mainConfig.washbasinPrice,
                        },
                        options: initialOptions as Option[],
                        isSelected: false,
                        isValid: false,
                    });
                    updatedExtraItems.washbasin.currentlyDisplay = updatedExtraItems.washbasin.configurations.length - 1;
                    break;
                case "wallUnit":
                    updatedExtraItems.wallUnit.configurations.push({
                        config: {
                            wallUnitObj: mainConfig.wallUnit as Elora.WallUnit,
                            wallUnitSku: mainConfig.wallUnitSku,
                            wallUnitPrice: mainConfig.wallUnitPrice,
                        },
                        options: initialOptions as Elora.WallUnitOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.wallUnit.currentlyDisplay = updatedExtraItems.wallUnit.configurations.length - 1;
                    break;
                case "tallUnit":
                    updatedExtraItems.tallUnit.configurations.push({
                        config: {
                            tallUnitObj: mainConfig.tallUnit as Elora.TallUnit,
                            tallUnitSku: mainConfig.tallUnitSku,
                            tallUnitPrice: mainConfig.tallUnitPrice,
                        },
                        options: initialOptions as Elora.TallUnitOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.tallUnit.currentlyDisplay = updatedExtraItems.tallUnit.configurations.length - 1;
                    break;
                case "accessory":
                    updatedExtraItems.accessory.configurations.push({
                        config: {
                            accessorySku: mainConfig.accessory,
                            accessoryPrice: mainConfig.accessoryPrice,
                        },
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
                        config: {
                            vanityObj: mainConfig.vanity,
                            vanitySku: mainConfig.vanitySku,
                            vanityPrice: mainConfig.vanityPrice
                        },
                        options: initialOptions as Margi.VanityOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.vanity.currentlyDisplay = updatedExtraItems.vanity.configurations.length - 1;
                    break;
                case "washbasin":
                    updatedExtraItems.washbasin.configurations.push({
                        config: {
                            washbasinSku: mainConfig.washbasin,
                            washbasinPrice: mainConfig.washbasinPrice,
                        },
                        options: initialOptions as Option[],
                        isSelected: false,
                        isValid: false,
                    });
                    updatedExtraItems.washbasin.currentlyDisplay = updatedExtraItems.washbasin.configurations.length - 1;
                    break;
                case "sideUnit":
                    updatedExtraItems.sideUnit.configurations.push({
                        config: {
                            sideUnitObj: mainConfig.sideUnit as Margi.SideCabinet | Margi.OpenUnit,
                            sideUnitSku: mainConfig.sideUnitSku,
                            sideUnitPrice: mainConfig.sideUnitPrice,
                        },
                        options: initialOptions as Margi.SideCabinetOptions | Margi.OpenUnitOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.sideUnit.currentlyDisplay = updatedExtraItems.sideUnit.configurations.length - 1;
                    break;
                case "wallUnit":
                    updatedExtraItems.wallUnit.configurations.push({
                        config: {
                            wallUnitObj: mainConfig.wallUnit as Margi.WallUnit,
                            wallUnitSku: mainConfig.wallUnitSku,
                            wallUnitPrice: mainConfig.wallUnitPrice,
                        },
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
                        config: {
                            vanityObj: mainConfig.vanity,
                            vanitySku: mainConfig.vanitySku,
                            vanityPrice: mainConfig.vanityPrice
                        },
                        options: initialOptions as NewYork.VanityOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.vanity.currentlyDisplay = updatedExtraItems.vanity.configurations.length - 1;
                    break;
                case "washbasin":
                    updatedExtraItems.washbasin.configurations.push({
                        config: {
                            washbasinSku: mainConfig.washbasin,
                            washbasinPrice: mainConfig.washbasinPrice,
                        },
                        options: initialOptions as Option[],
                        isSelected: false,
                        isValid: false,
                    });
                    updatedExtraItems.washbasin.currentlyDisplay = updatedExtraItems.washbasin.configurations.length - 1;
                    break;
                case "sideUnit":
                    updatedExtraItems.sideUnit.configurations.push({
                        config: {
                            sideUnitObj: mainConfig.sideUnit as NewYork.SideUnit,
                            sideUnitSku: mainConfig.sideUnitSku,
                            sideUnitPrice: mainConfig.sideUnitPrice,
                        },
                        options: initialOptions as NewYork.SideUnitOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.sideUnit.currentlyDisplay = updatedExtraItems.sideUnit.configurations.length - 1;
                    break;
                case "wallUnit":
                    updatedExtraItems.wallUnit.configurations.push({
                        config: {
                            wallUnitObj: mainConfig.wallUnit as NewYork.WallUnit,
                            wallUnitSku: mainConfig.wallUnitSku,
                            wallUnitPrice: mainConfig.wallUnitPrice,
                        },
                        options: initialOptions as NewYork.WallUnitOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.wallUnit.currentlyDisplay = updatedExtraItems.wallUnit.configurations.length - 1;
                    break;
                case "tallUnit":
                    updatedExtraItems.tallUnit.configurations.push({
                        config: {
                            tallUnitObj: mainConfig.tallUnit as NewYork.TallUnit,
                            tallUnitSku: mainConfig.tallUnitSku,
                            tallUnitPrice: mainConfig.tallUnitPrice,
                        },
                        options: initialOptions as NewYork.TallUnitOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.tallUnit.currentlyDisplay = updatedExtraItems.tallUnit.configurations.length - 1;
                    break;
                case "accessory":
                    updatedExtraItems.accessory.configurations.push({
                        config: {
                            accessorySku: mainConfig.accessory,
                            accessoryPrice: mainConfig.accessoryPrice,
                        },
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
                        config: {
                            vanityObj: mainConfig.vanity,
                            vanitySku: mainConfig.vanitySku,
                            vanityPrice: mainConfig.vanityPrice
                        },
                        options: initialOptions as NewBali.VanityOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.vanity.currentlyDisplay = updatedExtraItems.vanity.configurations.length - 1;
                    break;
                case "washbasin":
                    updatedExtraItems.washbasin.configurations.push({
                        config: {
                            washbasinSku: mainConfig.washbasin,
                            washbasinPrice: mainConfig.washbasinPrice,
                        },
                        options: initialOptions as Option[],
                        isSelected: false,
                        isValid: false,
                    });
                    updatedExtraItems.washbasin.currentlyDisplay = updatedExtraItems.washbasin.configurations.length - 1;
                    break;
                case "sideUnit":
                    updatedExtraItems.sideUnit.configurations.push({
                        config: {
                            sideUnitObj: mainConfig.sideUnit as NewBali.SideUnit,
                            sideUnitSku: mainConfig.sideUnitSku,
                            sideUnitPrice: mainConfig.sideUnitPrice,
                        },
                        options: initialOptions as NewBali.SideUnitOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.sideUnit.currentlyDisplay = updatedExtraItems.sideUnit.configurations.length - 1;
                    break;
                case "drawerBase":
                    updatedExtraItems.drawerBase.configurations.push({
                        config: {
                            drawerBaseObj: mainConfig.drawerBase as NewBali.DrawerBase,
                            drawerBaseSku: mainConfig.drawerBaseSku,
                            drawerBasePrice: mainConfig.drawerBasePrice,
                        },
                        options: initialOptions as NewBali.DrawerBaseOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.drawerBase.currentlyDisplay = updatedExtraItems.drawerBase.configurations.length - 1;
                    break;
                case "wallUnit":
                    updatedExtraItems.wallUnit.configurations.push({
                        config: {
                            wallUnitObj: mainConfig.wallUnit as NewBali.WallUnit,
                            wallUnitSku: mainConfig.wallUnitSku,
                            wallUnitPrice: mainConfig.wallUnitPrice,
                        },
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
                        config: {
                            vanityObj: mainConfig.vanity,
                            vanitySku: mainConfig.vanitySku,
                            vanityPrice: mainConfig.vanityPrice
                        },
                        options: initialOptions as Opera.VanityOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.vanity.currentlyDisplay = updatedExtraItems.vanity.configurations.length - 1;
                    break;
                case "washbasin":
                    updatedExtraItems.washbasin.configurations.push({
                        config: {
                            washbasinSku: mainConfig.washbasin,
                            washbasinPrice: mainConfig.washbasinPrice,
                        },
                        options: initialOptions as Option[],
                        isSelected: false,
                        isValid: false,
                    });
                    updatedExtraItems.washbasin.currentlyDisplay = updatedExtraItems.washbasin.configurations.length - 1;
                    break;
                case "sideUnit":
                    updatedExtraItems.sideUnit.configurations.push({
                        config: {
                            sideUnitObj: mainConfig.sideUnit as Opera.SideUnit,
                            sideUnitSku: mainConfig.sideUnitSku,
                            sideUnitPrice: mainConfig.sideUnitPrice,
                        },
                        options: initialOptions as Opera.SideUnitOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.sideUnit.currentlyDisplay = updatedExtraItems.sideUnit.configurations.length - 1;
                    break;
                case "wallUnit":
                    updatedExtraItems.wallUnit.configurations.push({
                        config: {
                            wallUnitObj: mainConfig.wallUnit as Opera.WallUnit,
                            wallUnitSku: mainConfig.wallUnitSku,
                            wallUnitPrice: mainConfig.wallUnitPrice,
                        },
                        options: initialOptions as Opera.WallUnitOptions,
                        isSelected: false,
                        isValid: false
                    });
                    updatedExtraItems.wallUnit.currentlyDisplay = updatedExtraItems.wallUnit.configurations.length - 1;
                    break;
                case "tallUnit":
                    updatedExtraItems.tallUnit.configurations.push({
                        config: {
                            tallUnitObj: null,
                            tallUnitSku: mainConfig.tallUnit,
                            tallUnitPrice: mainConfig.tallUnitPrice,
                        },
                        options: initialOptions as Option[],
                        isSelected: false,
                        isValid: false,
                    });
                    updatedExtraItems.tallUnit.currentlyDisplay = updatedExtraItems.tallUnit.configurations.length - 1;
                    break;
                case "drawerBase":
                    updatedExtraItems.drawerBase.configurations.push({
                        config: {
                            drawerBaseObj: mainConfig.drawerBase as Opera.DrawerBase,
                            drawerBaseSku: mainConfig.drawerBaseSku,
                            drawerBasePrice: mainConfig.drawerBasePrice,
                        },
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

        setExtraItems(updatedExtraItems);
    }

    return {extraItems, handleAddExtraProduct};

}

export default useExtraProductsExpressProgram;
