import axios from "axios";
import {
    OtherItemsLoopUp,
    ShoppingCartComposition,
    ShoppingCartCustomError,
} from "../Models/ExpressProgramModels";
import { ProductInventory } from "../Models/Product";

export async function getShoppingCartCompositions() {
    try {
        // 201 | 401 | 500
        const getShoppingCartCompositionsRes = await axios.get(
            "/express-program/shopping-cart/products"
        );

        return {
            compositions:
                getShoppingCartCompositionsRes.data.shoppingCartProducts,
            status: 201,
        };
    } catch (err: any) {
        let error;
        if (err.response.status === 401) {
            error = new ShoppingCartCustomError("user no available", {
                status: 401,
            });
        } else {
            error = new ShoppingCartCustomError("internal error", {
                status: err.response.status,
            });
        }
        throw error;
    }
}

export async function updateShoppingCartCompositions(
    shoppingCartComposition: ShoppingCartComposition
) {
    try {
        const compositionsResObj = await getShoppingCartCompositions();
        const shoppingCartCompositionsServer: ShoppingCartComposition[] =
            compositionsResObj.compositions;

        shoppingCartCompositionsServer.push(shoppingCartComposition);

        // 201 | 401 | 500
        await axios.post(
            "/express-program/shopping-cart/update",
            shoppingCartCompositionsServer
        );

        return {
            compositions: shoppingCartCompositionsServer,
            status: 201,
        };
    } catch (err: any) {
        throw err;
    }
}

export function generateShoppingCartCompositionProductObjs(
    allConfigs: any,
    shoppingCartObj: ShoppingCartComposition,
    sideUnitsArr: ProductInventory[] | null,
    isDoubleSideUnit: boolean,
    isDoubleSink: boolean
) {
    for (const configType in allConfigs) {
        const crrConfig = allConfigs[configType as keyof typeof allConfigs];
        for (const product of crrConfig.currentProducts) {
            const finalPrice:number = product.sprice ? product.sprice : product.msrp;

            const otherProductsItemAsKey = OtherItemsLoopUp[
                product.item as keyof typeof OtherItemsLoopUp
            ] as keyof typeof shoppingCartObj.otherProducts;

            if (configType !== "extraItemsConfig") {
                if (otherProductsItemAsKey !== "vanity" && otherProductsItemAsKey !== "washbasin" && otherProductsItemAsKey !== "sideUnit") {
                    shoppingCartObj.otherProducts[otherProductsItemAsKey]?.push({
                        type: otherProductsItemAsKey,
                        productObj: product,
                        quantity: 1,
                        unitPrice: finalPrice,
                        total: finalPrice,
                    });
                }

                if (
                    sideUnitsArr &&
                    product.item === "SIDE UNIT" &&
                    product.model === "NEW YORK"
                ) {
                    sideUnitsArr.forEach((sideUnit) => {
                        const finalPrice = sideUnit.sprice
                            ? sideUnit.sprice
                            : sideUnit.msrp;
                        shoppingCartObj.sideUnits.push({
                            type: "sideUnits",
                            productObj: sideUnit,
                            quantity: 1,
                            unitPrice: finalPrice,
                            total: finalPrice,
                        });
                    });
                }

                if (product.item === "SIDE UNIT" && product.model !== "NEW YORK") {
                    shoppingCartObj.sideUnits.push({
                        type: "sideUnits",
                        productObj: product,
                        quantity: isDoubleSideUnit ? 2 : 1,
                        unitPrice: finalPrice,
                        total: isDoubleSideUnit ? finalPrice * 2 : finalPrice,
                    });
                }

                if (product.item === "WASHBASIN/SINK") {
                    shoppingCartObj["washbasin"] = {
                        type: "washbasin",
                        productObj: product,
                        quantity: 1,
                        unitPrice: finalPrice,
                        total: finalPrice,
                    };
                }

                if (product.item === "VANITY") {
                    shoppingCartObj["vanity"] = {
                        type: "vanity",
                        productObj: product,
                        quantity: isDoubleSink ? 2 : 1,
                        unitPrice: finalPrice,
                        total: isDoubleSink ? finalPrice * 2 : finalPrice,
                    };
                }
            } else {
                shoppingCartObj.otherProducts[otherProductsItemAsKey]?.push({
                    type: otherProductsItemAsKey,
                    productObj: product,
                    quantity: 1,
                    unitPrice: finalPrice,
                    total: finalPrice,
                });
            }
        }
    }

    return shoppingCartObj;
}
