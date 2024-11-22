import { useEffect, useState } from "react";

// THIS WILL CHANGE TO "ShoppingCartComposition"
import { ShoppingCartProduct as shoppingCartProductModel } from "../Models/ExpressProgramModels";

import axios from "axios";
import ShoppingCartProductCard from "./ShoppingCartProductCard";
import classes from "../../css/shoppingCart.module.css";
import { router } from "@inertiajs/react";
import USDollar from "../utils/currentFormatter";
import { ProductInventory } from "../Models/Product";

interface ShoppingCartProps {
    onShoppingSize: (numOfProducts: number) => void;
    onClose: () => void;
}

function ShoppingCart({
    onShoppingSize: handleShoppingCartSize,
    onClose: handleCloseShoppingCartModal,
}: ShoppingCartProps) {
    // THIS WILL CHANGE TO "crrShoppingCartCompositions: ShoppingCartComposition"
    const [crrShoppingCartProducts, setShoppingCartProducts] = useState<
        // THIS WILL CHANGE TO "ShoppingCartComposition[]"
        shoppingCartProductModel[]
    >([]);

    const handleRemoveProduct = async (
        product: shoppingCartProductModel,
        productIndex: number
    ) => {
        const filteredProducts = crrShoppingCartProducts.filter(
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
                setShoppingCartProducts(filteredProducts);
            }
        } catch (err) {
            console.log(err);
        }
    };

    /**
     * TODO:
     *
     * 1. must pass the exact item (vanity,washbasin,tall unit, etc...) inside the "product" object needs to be updated.
     * 2. i might need to chage the shopping cart product object so it can reflect the qty and total for each item.
     *
     */
    const handleQtyUpdated = async (
        product: shoppingCartProductModel, // THIS WILL CHANGE TO "composition: ShoppingCartComposition"
        productIndex: number, // THIS WILL CHANGE TO "compositionIndex: number"
        //"product: string" -> EXTRA PARAM FOR THE ACTUAL PRODUCT INSIDE THE COMPOSTION
        //"otherProductIndex: number | null" -> EXTRA PARAM TO LOOK FOR PRODUCT INSIDE THE 'otherProducts' OBJ.
        //"sideUnitIndex: number | null" -> EXTRA PARAM TO LOOK FOR SIDE UNIT INSIDE ARRAY.
        qty: number | typeof NaN,
        type: "decrement" | "increment" | "changeValue"
    ) => {
        // THIS WILL CHANGE TO "updatedShoppingCartCompositions"  and  "crrShoppingCartCompositions"
        const updatedProducts = structuredClone(crrShoppingCartProducts);

        // THIS WILL CHANGE TO "updatedShoppingCartCompositions"
        for (let i = 0; i < updatedProducts.length; i++) {
            // THIS WILL CHANGE TO "crrComposition" and "updatedShoppingCartCompositions"
            const crrProduct = updatedProducts[i];

            // THIS MAKES SURE TO SEARCH FOR THE CORRECT COMPOSITION INSIDE THE SHOPPING CART.
            if (
                crrProduct.description !== product.description ||
                productIndex !== i
            )
                continue;

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

            switch (type) {
                case "changeValue":
                    crrProduct.quantity = qty;
                    break;
                case "decrement":
                    crrProduct.quantity = qty === 1 ? qty : --qty;
                    break;
                case "increment":
                    crrProduct.quantity = ++qty;
                    break;
                default:
                    throw new Error("invalid type");
            }
        }

        setShoppingCartProducts(updatedProducts);
        if (qty <= 0 || isNaN(qty)) return;

        try {
            const response = await axios.post(
                "/express-program/shopping-cart/update",
                updatedProducts
            );

            if (response.status !== 200)
                console.log("could not updated server state");
        } catch (err) {
            console.log(err);
        }
    };

    const handlePlaceOrder = () => {
        let SKU: string[] = [];
        crrShoppingCartProducts.forEach((productConfig) => {
            const skusArr: string[] = [];
            const doubleItemFinalQty = `--${productConfig.quantity * 2}`;
            const singleItemFinalQty = `--${productConfig.quantity * 1}`;

            if (productConfig.vanity) {
                skusArr.push(
                    `${productConfig.vanity.uscode}!!${
                        productConfig.composition.model
                    }${
                        productConfig.isDoubleSink
                            ? doubleItemFinalQty
                            : singleItemFinalQty
                    }##${productConfig.label}`
                );
            }

            if (productConfig.washbasin) {
                skusArr.push(
                    `${productConfig.washbasin.uscode}!!${productConfig.composition.model}${singleItemFinalQty}##${productConfig.label}`
                );
            }

            if (productConfig.sideUnits.length > 0) {
                productConfig.sideUnits.forEach(
                    (sideunit: ProductInventory) => {
                        skusArr.push(
                            `${sideunit.uscode}!!${
                                productConfig.composition.model
                            }${
                                productConfig.isDoubleSideunit &&
                                productConfig.composition.model === "OPERA"
                                    ? doubleItemFinalQty
                                    : singleItemFinalQty
                            }##${productConfig.label}`
                        );
                    }
                );
            }

            for (const item in productConfig.otherProducts) {
                const itemProducts = productConfig.otherProducts[
                    item as keyof typeof productConfig.otherProducts
                ] as ProductInventory[];
                itemProducts.forEach((product: ProductInventory) => {
                    skusArr.push(
                        `${product.uscode}!!${productConfig.composition.model}${singleItemFinalQty}##${productConfig.label}`
                    );
                });
            }

            SKU.push(skusArr.join("~"));
        });

        router.get("/orders/create-so-num", {
            SKU: SKU.join("~"),
            isShoppingCart: true,
        });
    };

    const calGrandTotal = (): number => {
        return crrShoppingCartProducts.reduce((prev, crr) => {
            return prev + crr.grandTotal * crr.quantity;
        }, 0);
    };

    useEffect(() => {
        const getShoppingCartProducts = async () => {
            try {
                // GET SHOPPING CART PRODUTS FROM SERVER.
                const response = await axios.get(
                    "/express-program/shopping-cart/products"
                );

                const shoppingCartProductsServer =
                    response.data.shoppingCartProducts;

                setShoppingCartProducts(shoppingCartProductsServer);
            } catch (err) {}
        };
        getShoppingCartProducts();
    }, []);

    console.log("==== ShoppingCart ====");
    console.log("shopping cart products:", crrShoppingCartProducts);

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
                        disabled={crrShoppingCartProducts.length === 0}
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
                {crrShoppingCartProducts.map((product, index) => (
                    <ShoppingCartProductCard
                        key={index}
                        product={product}
                        productIndex={index}
                        onRemoveProduct={handleRemoveProduct}
                        onQtyUpdated={handleQtyUpdated}
                    />
                ))}
            </section>
            {crrShoppingCartProducts.length === 0 && (
                <p>YOUR SHOPPING CART IS EMPTY.</p>
            )}
        </section>
    );
}

export default ShoppingCart;
