import { Item, Model, SkuLengthModels } from "../Models/ModelConfigTypes";
import { ProductInventory } from "../Models/Product";

export function isAlphanumericWithSpaces(str: string) {
    return /^[a-zA-Z0-9\s]*$/.test(str);
}

export const getSkuAndPrice = (
    model: Model,
    item: string,
    itemObj: Item,
    products: ProductInventory[],
    wholeSku?: string
) => {
    const skuAndPrice = { sku: "", price: 0 };
    const skuLengths = SkuLengthModels[model];

    if (wholeSku) {
        for (const crrProduct of products) {
            if (crrProduct.uscode === wholeSku) {
                skuAndPrice.price = crrProduct.msrp;
                skuAndPrice.sku = wholeSku;
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
            console.log("======= New getSkuAndPrice func ========");
            console.log(SkuLengthModels);
            console.log(model);
            console.log(item);
            console.log(itemObj);
            console.log(skuLengths);
            console.log(skuAndPrice);
            return skuAndPrice;
        }

        const productSku = itemCodesArray.join("-");

        for (const crrProduct of products) {
            if (crrProduct.uscode === productSku) {
                skuAndPrice.price = crrProduct.msrp;
                skuAndPrice.sku = productSku;
                break;
            }
        }
    }

    console.log("======= New getSkuAndPrice func ========");
    console.log(SkuLengthModels);
    console.log(model);
    console.log(item);
    console.log(itemObj);
    console.log(skuLengths);
    console.log(skuAndPrice);

    return skuAndPrice;
};
