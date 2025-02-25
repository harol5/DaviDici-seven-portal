import {
    Item,
    ItemObj,
    Model, ModelCurrentConfiguration,
    SkuLengthModels,
} from "../Models/ModelConfigTypes";
import { ProductInventory } from "../Models/Product";
import {Composition} from "../Models/Composition.ts";


export function isAlphanumericWithSpaces(str: string) {
    return /^[a-zA-Z0-9\s]*$/.test(str);
}

export const getSkuAndPrice = (
    model: Model,
    item: string,
    itemObj: ItemObj,
    products: ProductInventory[],
    wholeSku?: string
) => {
    const skuAndPrice = {
        sku: "",
        price: 0,
        product: null as ProductInventory | null,
    };
    const skuLengths = SkuLengthModels[model];

    if (wholeSku) {
        for (const crrProduct of products) {
            if (crrProduct.uscode === wholeSku) {
                skuAndPrice.price = crrProduct.sprice
                    ? crrProduct.sprice
                    : crrProduct.msrp;

                skuAndPrice.sku = wholeSku;
                skuAndPrice.product = crrProduct;
                break;
            }
        }
    } else {
        const itemCodesArray: string[] = [];

        for (const key in itemObj) {
            const property = key as keyof typeof itemObj;
            const code = itemObj[property];
            if (code) itemCodesArray.push(code);
        }

        if (
            itemCodesArray.length !==
            skuLengths[item as keyof typeof skuLengths]
        ) {
            return skuAndPrice;
        }

        const productSku = itemCodesArray.join("-");

        for (const crrProduct of products) {
            if (crrProduct.uscode === productSku) {
                skuAndPrice.price = crrProduct.sprice
                    ? crrProduct.sprice
                    : crrProduct.msrp;

                skuAndPrice.sku = productSku;
                skuAndPrice.product = crrProduct;
                break;
            }
        }
    }

    return skuAndPrice;
};


export const getFormattedDate = () => {
    const today = new Date();
    return `${String(today.getMonth() + 1).padStart(2, "0")}/${String(
        today.getDate()
    ).padStart(2, "0")}/${today.getFullYear()}`;

};

export const scrollToView = (item: Item | "compositionNameWrapper") => {
    const element = document.getElementById(item);
    if (element) {
        element.scrollIntoView({
            behavior: "smooth",
        });
    }
};

export const getConfigTitle = (composition: Composition, currentConfiguration: ModelCurrentConfiguration) => {
    let title = `${composition.model} ${composition.size}"`;
    if (currentConfiguration.washbasin) {
        composition.washbasins.forEach((washbasin) => {
            if (washbasin.uscode === currentConfiguration.washbasin) {
                title += ` Incl a ${washbasin.model} ${washbasin.finish} SINK`;
            }
        });
    }
    return title;
}
