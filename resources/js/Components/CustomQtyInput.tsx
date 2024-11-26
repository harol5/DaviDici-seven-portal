import type { ShoppingCartComposition, ShoppingCartCompositionProduct, ShoppingCartProduct } from "../Models/ExpressProgramModels";
import classes from "../../css/CustomQtyInput.module.css";
import { useEffect, useState } from "react";

interface CustomQtyInputProps {
    composition: ShoppingCartComposition; // I MIGHT NEED TO CHAGE THIS OBJECT FOR ProductShoppingCart
    compositionIndex: number;
    product: ShoppingCartCompositionProduct;
    otherProductIndex: number | null;
    sideUnitIndex: number | null;
    onQtyUpdated: (
        composition: ShoppingCartComposition,
        compositionIndex: number,
        product: ShoppingCartCompositionProduct,
        otherProductIndex: number | null,
        sideUnitIndex: number | null,
        qty: number,
        type: "decrement" | "increment" | "changeValue"
    ) => void;
    onRemove: (
        composition: ShoppingCartComposition,
        compositionIndex: number
    ) => void
}

function CustomQtyInput({
    composition,
    compositionIndex,
    product,
    otherProductIndex,
    sideUnitIndex,
    onQtyUpdated: handleQtyUpdated,
    onRemove: handleRemoveProduct
}: CustomQtyInputProps) {
    return (
        <>
        {location.pathname !== "/orders/create-so-num" && 

<span className={classes.inputAndRemoveButtonWrapper}>
    
    
<section>
            <div className={classes.customQtyInput}>
                <button
                    disabled={
                        product.quantity <= 1 
                    }
                    className={classes.increment}
                    onClick={() => {
                        try {
                            handleQtyUpdated(
                                composition,
                                compositionIndex,
                                product,
                                otherProductIndex,
                                sideUnitIndex,
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
                                composition,
                                compositionIndex,
                                product,
                                otherProductIndex,
                                sideUnitIndex,
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
                                composition,
                                compositionIndex,
                                product,
                                otherProductIndex,
                                sideUnitIndex,
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
    

        <button
                                onClick={() =>
                                    handleRemoveProduct(composition,
                                        compositionIndex,)
                                }
                                disabled={
                                    location.pathname ===
                                    "/orders/create-so-num"
                                }
                            >
                                REMOVE
                            </button>
    
     </span>

            }
        </>        
    );
}

export default CustomQtyInput;
