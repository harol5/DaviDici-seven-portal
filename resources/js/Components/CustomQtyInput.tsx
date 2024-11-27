import type {
    ShoppingCartComposition,
    ShoppingCartCompositionProduct,    
} from "../Models/ExpressProgramModels";
import classes from "../../css/CustomQtyInput.module.css";


interface CustomQtyInputProps {
    composition: ShoppingCartComposition;
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
        compositionIndex: number,
        product: ShoppingCartCompositionProduct | null,
        otherProductIndex: number | null,
        sideUnitIndex: number | null,
        removeAction: "composition" | "composition product",
    ) => void;
}

function CustomQtyInput({
    composition,
    compositionIndex,
    product,
    otherProductIndex,
    sideUnitIndex,
    onQtyUpdated: handleQtyUpdated,
    onRemove: handleRemoveProduct,
}: CustomQtyInputProps) {
    return (
        <>
            {location.pathname !== "/orders/create-so-num" && (
                <span className={classes.inputAndRemoveButtonWrapper}>
                    <section className={classes.errorMsgAndQtyInputWrapper}>
                        <div className={classes.customQtyInput}>
                            <button
                                disabled={product.quantity <= 1}
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
                                    product.quantity === 0 ||
                                    isNaN(product.quantity)
                                        ? `${classes.inputQty} ${classes.notValid}`
                                        : classes.inputQty
                                }
                                type="number"
                                name="qty"
                                value={product.quantity.toString()}
                                readOnly                                
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
                                Quantity cannot be empty and must be greater
                                than 0
                            </p>
                        ) : null}
                    </section>

                    <button
                        onClick={() =>
                            handleRemoveProduct(composition, compositionIndex,product,otherProductIndex,sideUnitIndex,"composition product")
                        }
                        disabled={location.pathname === "/orders/create-so-num"}
                        className={classes.removeButton}
                    >
                        REMOVE
                    </button>
                </span>
            )}
        </>
    );
}

export default CustomQtyInput;
