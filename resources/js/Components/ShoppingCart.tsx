import { useEffect, useState } from "react";
import { shoppingCartProduct as shoppingCartProductModel } from "../Models/ExpressProgramModels";
import User from "../Models/User";
import axios from "axios";
import ShoppingCartProductCard from "./ShoppingCartProductCard";
import classes from "../../css/shoppingCart.module.css";

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

    const handlePlaceOrder = () => {};

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
        <section>
            <section>
                {crrShoppingCartProducts.map((product, index) => (
                    <ShoppingCartProductCard
                        product={product}
                        onRemoveProduct={handleRemoveProduct}
                        onQtyUpdated={handleQtyUpdated}
                        key={index}
                    />
                ))}
            </section>
            <section>
                <button className={classes.placeOrderButton}>
                    PLACE ORDER
                </button>
            </section>

            {crrShoppingCartProducts.length === 0 && (
                <p>YOU SHOPPING CART IS EMPTY.</p>
            )}
        </section>
    );
}

export default ShoppingCart;
