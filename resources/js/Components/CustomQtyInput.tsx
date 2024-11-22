import type { ShoppingCartProduct } from "../Models/ExpressProgramModels";
import classes from "../../css/CustomQtyInput.module.css";
import { useEffect, useState } from "react";

interface CustomQtyInputProps {
    product: ShoppingCartProduct; // I MIGHT NEED TO CHAGE THIS OBJECT FOR ProductShoppingCart
    productIndex: number;
    onQtyUpdated: (
        product: ShoppingCartProduct,
        productIndex: number,
        qty: number,
        type: "decrement" | "increment" | "changeValue"
    ) => void;
}

function CustomQtyInput({
    product,
    productIndex,
    onQtyUpdated: handleQtyUpdated,
}: CustomQtyInputProps) {
    return (
        <section>
            <div className={classes.customQtyInput}>
                <button
                    disabled={
                        product.quantity <= 1 ||
                        location.pathname === "/orders/create-so-num"
                    }
                    className={classes.increment}
                    onClick={() => {
                        try {
                            handleQtyUpdated(
                                product,
                                productIndex,
                                product.quantity,
                                "decrement"
                            );
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                >
                    -
                </button>
                <input
                    className={
                        product.quantity === 0 || isNaN(product.quantity)
                            ? `${classes.inputQty} ${classes.notValid}`
                            : classes.inputQty
                    }
                    type="number"
                    name="qty"
                    value={product.quantity.toString()}
                    onChange={(e) => {
                        try {
                            handleQtyUpdated(
                                product,
                                productIndex,
                                Number.parseInt(e.target.value),
                                "changeValue"
                            );
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                    disabled={location.pathname === "/orders/create-so-num"}
                />
                <button
                    className={classes.increment}
                    onClick={() => {
                        try {
                            handleQtyUpdated(
                                product,
                                productIndex,
                                product.quantity,
                                "increment"
                            );
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                    disabled={location.pathname === "/orders/create-so-num"}
                >
                    +
                </button>
            </div>
            {product.quantity === 0 || isNaN(product.quantity) ? (
                <p className={classes.errorMessage}>
                    Quantity cannot be empty and must be greater than 0
                </p>
            ) : null}
        </section>
    );
}

export default CustomQtyInput;
