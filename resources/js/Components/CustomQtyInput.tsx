import type { shoppingCartProduct } from "../Models/ExpressProgramModels";
import classes from "../../css/CustomQtyInput.module.css";
import { useEffect, useState } from "react";

interface CustomQtyInputProps {
    product: shoppingCartProduct;
    onQtyUpdated: (
        product: shoppingCartProduct,
        qty: number,
        type: "decrement" | "increment" | "changeValue"
    ) => void;
}

function CustomQtyInput({
    product,
    onQtyUpdated: handleQtyUpdated,
}: CustomQtyInputProps) {
    console.log("=== CustomQtyInput ===");
    console.log(product);

    return (
        <section>
            <div className={classes.customQtyInput}>
                <button
                    disabled={product.quantity <= 1}
                    className={classes.increment}
                    onClick={() => {
                        try {
                            handleQtyUpdated(
                                product,
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
                                Number.parseInt(e.target.value),
                                "changeValue"
                            );
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                />
                <button
                    className={classes.increment}
                    onClick={() => {
                        try {
                            handleQtyUpdated(
                                product,
                                product.quantity,
                                "increment"
                            );
                        } catch (error) {
                            console.log(error);
                        }
                    }}
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
