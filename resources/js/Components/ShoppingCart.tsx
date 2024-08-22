import { useEffect, useState } from "react";
import { shoppingCartProduct as shoppingCartProductModel } from "../Models/ExpressProgramModels";
import User from "../Models/User";
import axios from "axios";
import ShoppingCartProductCard from "./ShoppingCartProductCard";
import classes from "../../css/shoppingCart.module.css";
import { router } from "@inertiajs/react";
import USDollar from "../utils/currentFormatter";

interface ShoppingCartProps {
    auth: User;
}

/**
 * TODO:
 * CREATE FUNCTION THAT GENERATES SKU STRING.
 *
 */

function ShoppingCart({ auth }: ShoppingCartProps) {
    const [crrShoppingCartProducts, setShoppingCartProducts] = useState<
        shoppingCartProductModel[]
    >([]);

    const handleRemoveProduct = async (product: shoppingCartProductModel) => {
        const filteredProducts = crrShoppingCartProducts.filter(
            (crrProduct) => crrProduct.description !== product.description
        );

        try {
            const response = await axios.post(
                "/express-program/shopping-cart/update",
                filteredProducts
            );

            if (response.data.message === "shopping cart updated")
                setShoppingCartProducts(filteredProducts);
        } catch (err) {
            console.log(err);
        }
    };

    const handleQtyUpdated = async (
        product: shoppingCartProductModel,
        qty: number | typeof NaN,
        type: "decrement" | "increment" | "changeValue"
    ) => {
        const updatedProducts = structuredClone(crrShoppingCartProducts);
        for (const crrProduct of updatedProducts) {
            if (crrProduct.description !== product.description) continue;

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

            skusArr.push(
                `${productConfig.vanity.uscode}!!${
                    productConfig.composition.model
                }${
                    productConfig.isDoubleSink
                        ? doubleItemFinalQty
                        : singleItemFinalQty
                }`
            );

            if (productConfig.washbasin) {
                skusArr.push(
                    `${productConfig.washbasin.uscode}!!${productConfig.composition.model}${singleItemFinalQty}`
                );
            }

            if (productConfig.sideUnits.length > 0) {
                productConfig.sideUnits.forEach((sideunit) => {
                    skusArr.push(
                        `${sideunit.uscode}!!${
                            productConfig.composition.model
                        }${
                            productConfig.isDoubleSideunit &&
                            productConfig.composition.model === "OPERA"
                                ? doubleItemFinalQty
                                : singleItemFinalQty
                        }`
                    );
                });
            }

            SKU.push(skusArr.join("~"));
        });

        router.get("/orders/create-so-num", { SKU: SKU.join("~") });
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

    console.log("====== SHOPPING CART COMPONENT========");
    console.log("current products", crrShoppingCartProducts);

    return (
        <section className={classes.shoppingCart}>
            <section className={classes.grandTotalAndPlaceOrderButtonWrapper}>
                <span className={classes.granTotalWrapper}>
                    <h1>GRAND TOTAL:</h1>
                    <p>{USDollar.format(calGrandTotal())}</p>
                </span>
                <button
                    className={classes.placeOrderButton}
                    onClick={handlePlaceOrder}
                >
                    PLACE ORDER
                </button>
            </section>
            <section className={classes.shoppingCartContent}>
                {crrShoppingCartProducts.map((product, index) => (
                    <ShoppingCartProductCard
                        product={product}
                        onRemoveProduct={handleRemoveProduct}
                        onQtyUpdated={handleQtyUpdated}
                        key={index}
                    />
                ))}
            </section>
            {crrShoppingCartProducts.length === 0 && (
                <p>YOU SHOPPING CART IS EMPTY.</p>
            )}
        </section>
    );
}

export default ShoppingCart;
