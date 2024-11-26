import { useEffect, useState } from "react";

// THIS WILL CHANGE TO "ShoppingCartComposition"
import { ShoppingCartComposition, ShoppingCartCompositionProduct } from "../Models/ExpressProgramModels";

import axios from "axios";
import ShoppingCartCompositionCard from "./ShoppingCartCompositionCard";
import classes from "../../css/shoppingCart.module.css";
import { router } from "@inertiajs/react";
import USDollar from "../utils/currentFormatter";
import { ProductInventory } from "../Models/Product";
import { getShoppingCartCompositions } from "../utils/shoppingCartUtils";

interface ShoppingCartProps {
    onShoppingSize: (numOfProducts: number) => void;
    onClose: () => void;
}

function ShoppingCart({
    onShoppingSize: handleShoppingCartSize,
    onClose: handleCloseShoppingCartModal,
}: ShoppingCartProps) {    
    const [crrShoppingCartCompositions, setShoppingCartCompositions] = useState<        
        ShoppingCartComposition[]
    >([]);

    const handleRemoveProduct = async (
        product: ShoppingCartComposition,
        productIndex: number
    ) => {
        const filteredProducts = crrShoppingCartCompositions.filter(
            (crrProduct, index) => {
                return (
                    crrProduct.description !== product.description ||
                    productIndex !== index
                );
            }
        );

        try {
            const response = await axios.post(
                "/express-program/shopping-cart/update",
                filteredProducts
            );

            if (response.data.message === "shopping cart updated") {
                handleShoppingCartSize(filteredProducts.length);
                setShoppingCartCompositions(filteredProducts);
            }
        } catch (err) {
            console.log(err);
        }
    };

    /**
     * TODO: DONE!!
     *
     * 1. must pass the exact item (vanity,washbasin,tall unit, etc...) inside the "product" object needs to be updated.
     * 2. i might need to chage the shopping cart product object so it can reflect the qty and total for each item.
     *
     */
    const handleQtyUpdated = async (
        composition: ShoppingCartComposition, // THIS WILL CHANGE TO "composition: ShoppingCartComposition"
        compositionIndex: number, // THIS WILL CHANGE TO "compositionIndex: number"
        product: ShoppingCartCompositionProduct,//"product: string" -> EXTRA PARAM FOR THE ACTUAL PRODUCT INSIDE THE COMPOSTION
        otherProductIndex: number | null, //"otherProductIndex: number | null" -> EXTRA PARAM TO LOOK FOR PRODUCT INSIDE THE 'otherProducts' OBJ.
        sideUnitIndex: number | null,//"sideUnitIndex: number | null" -> EXTRA PARAM TO LOOK FOR SIDE UNIT INSIDE ARRAY.
        qty: number | typeof NaN,
        type: "decrement" | "increment" | "changeValue"
    ) => {                
        const updatedShoppingCartCompositions = structuredClone(crrShoppingCartCompositions);
        
        for (let i = 0; i < updatedShoppingCartCompositions.length; i++) {            
            const crrComposition = updatedShoppingCartCompositions[i];

            // THIS MAKES SURE TO SEARCH FOR THE CORRECT COMPOSITION INSIDE THE SHOPPING CART.
            if (
                crrComposition.description !== composition.description ||
                compositionIndex !== i
            )
                continue;

            console.log("========= handleQtyUpdated ===========");
            console.log("composition to be update:",crrComposition);
            console.log("compositionIndex:",compositionIndex)
            console.log("product:",product)
            console.log("otherProductIndex:",otherProductIndex)
            console.log("sideUnitIndex:",sideUnitIndex)
            console.log("qty:",qty)
            console.log("type:",type)

            // THIS LOGIC MUST BE CHANGE, BECAUSE NOW WE NEED TO UPDATE THE QTY FOR THE CORRESPONDING
            // PRODUCT INSIDE THE COMPOSITION.

            // THIS BECOMES MORE COMPLEX WHEN PRODUCTS INSIDE THE "otherProducts" OBJECT OR SIDE UNIT
            // ARRAY ARE UPDATED.

            // I WILL USE THE EXTRA PARAMS MENTIONS ABOVE TO WRITE CONDITIONS THAT WILL CHECK:
            /**
             * if (otherProductIndex) -> crrComposition.otherProducts[product][otherProductIndex].quantity = qty;
             *                           crrComposition.otherProducts[product][otherProductIndex].total = ?
             *
             * else if (sideUnitIndex) -> crrComposition[product][sideUnitIndex].quantity = qty;
             *                            crrComposition[product][sideUnitIndex].total = ?;
             *
             * else crrComposition[product].quantity = qty;
             *      crrComposition[product].total = ?;
             */

            let crrProduct: ShoppingCartCompositionProduct;

            if (otherProductIndex !== null) {
                // crrProduct = crrComposition.otherProducts[product.type as keyof typeof crrComposition.otherProducts][otherProductIndex];
                crrProduct = crrComposition.otherProducts[product.type as keyof typeof crrComposition.otherProducts]![otherProductIndex];
            }else if (sideUnitIndex !== null){
                crrProduct = crrComposition[product.type as keyof typeof crrComposition][sideUnitIndex]
            }else {
                crrProduct = crrComposition[product.type as keyof typeof crrComposition]
            }

            console.log("product to be updated:",crrProduct);



            switch (type) {
                case "changeValue":
                    crrProduct.quantity = qty;
                    crrProduct.total = qty * crrProduct.unitPrice;
                    break;
                case "decrement":
                    crrProduct.quantity = qty === 1 ? qty : --qty;
                    crrProduct.total = qty * crrProduct.unitPrice;
                    break;
                case "increment":
                    crrProduct.quantity = ++qty;
                    crrProduct.total = qty * crrProduct.unitPrice;
                    break;
                default:
                    throw new Error("invalid type");
            }

            console.log("composition updated:",crrComposition);
            console.log("updatedShoppingCartCompositions:",updatedShoppingCartCompositions);
            console.log("updated qty global:",qty)

        }        

        setShoppingCartCompositions(updatedShoppingCartCompositions);
        if (qty <= 0 || isNaN(qty)) return;

        try {
            await axios.post(
                "/express-program/shopping-cart/update",
                updatedShoppingCartCompositions
            );            
        } catch (err) {
            console.log(err);
        }
    };

    const handlePlaceOrder = () => {
        let SKU: string[] = [];

        // crrShoppingCartCompositions.forEach((productConfig) => {
        //     const skusArr: string[] = [];
        //     const doubleItemFinalQty = `--${productConfig.quantity * 2}`;
        //     const singleItemFinalQty = `--${productConfig.quantity * 1}`;

        //     if (productConfig.vanity) {
        //         skusArr.push(
        //             `${productConfig.vanity.uscode}!!${
        //                 productConfig.composition.model
        //             }${
        //                 productConfig.isDoubleSink
        //                     ? doubleItemFinalQty
        //                     : singleItemFinalQty
        //             }##${productConfig.label}`
        //         );
        //     }

        //     if (productConfig.washbasin) {
        //         skusArr.push(
        //             `${productConfig.washbasin.uscode}!!${productConfig.composition.model}${singleItemFinalQty}##${productConfig.label}`
        //         );
        //     }

        //     if (productConfig.sideUnits.length > 0) {
        //         productConfig.sideUnits.forEach(
        //             (sideunit: ProductInventory) => {
        //                 skusArr.push(
        //                     `${sideunit.uscode}!!${
        //                         productConfig.composition.model
        //                     }${
        //                         productConfig.isDoubleSideunit &&
        //                         productConfig.composition.model === "OPERA"
        //                             ? doubleItemFinalQty
        //                             : singleItemFinalQty
        //                     }##${productConfig.label}`
        //                 );
        //             }
        //         );
        //     }

        //     for (const item in productConfig.otherProducts) {
        //         const itemProducts = productConfig.otherProducts[
        //             item as keyof typeof productConfig.otherProducts
        //         ] as ProductInventory[];
        //         itemProducts.forEach((product: ProductInventory) => {
        //             skusArr.push(
        //                 `${product.uscode}!!${productConfig.composition.model}${singleItemFinalQty}##${productConfig.label}`
        //             );
        //         });
        //     }

        //     SKU.push(skusArr.join("~"));
        // });

        router.get("/orders/create-so-num", {
            SKU: SKU.join("~"),
            isShoppingCart: true,
        });
    };

    // NEXT!!
    const calGrandTotal = (): number => {
        // return crrShoppingCartCompositions.reduce((prev, crr) => {
        //     return prev + crr.grandTotal * crr.quantity;
        // }, 0);

        return 0
    };

    // DONE!!
    useEffect(() => {        
        const getShoppingCartProducts = async () => {
            try {                
                const {compositions} = await getShoppingCartCompositions();                                                
                setShoppingCartCompositions(compositions);                               
            } catch (err) {                
                console.error(err);
            }
        };
        getShoppingCartProducts();   
    }, []);

    console.log("==== ShoppingCart ====");
    console.log("shopping cart products:", crrShoppingCartCompositions);

    return (
        <section className={classes.shoppingCart}>
            <section className={classes.grandTotalAndPlaceOrderButtonWrapper}>
                <span className={classes.granTotalWrapper}>
                    <h1>GRAND TOTAL:</h1>
                    <p>{USDollar.format(calGrandTotal())}</p>
                </span>
                {location.pathname !== "/orders/create-so-num" && (
                    <button
                        className={classes.placeOrderButton}
                        onClick={handlePlaceOrder}
                        disabled={crrShoppingCartCompositions.length === 0}
                    >
                        PLACE ORDER
                    </button>
                )}
                <button
                    className={classes.placeOrderButton}
                    onClick={handleCloseShoppingCartModal}
                >
                    CLOSE CART
                </button>
            </section>
            <section className={classes.shoppingCartContent}>
                {crrShoppingCartCompositions.map((composition, index) => (
                    <ShoppingCartCompositionCard
                        key={index}
                        composition={composition}
                        compositionIndex={index}
                        onRemoveProduct={handleRemoveProduct}
                        onQtyUpdated={handleQtyUpdated}
                    />
                ))}
            </section>
            {crrShoppingCartCompositions.length === 0 && (
                <p>YOUR SHOPPING CART IS EMPTY.</p>
            )}
        </section>
    );
}

export default ShoppingCart;
