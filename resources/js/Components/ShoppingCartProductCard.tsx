import type { shoppingCartProduct } from "../Models/ExpressProgramModels";
import CustomQtyInput from "./CustomQtyInput";
import classes from "../../css/shoppingCartProductCard.module.css";
import { useMemo } from "react";
import USDollar from "../utils/currentFormatter";

interface ShoppingCartProductCardProps {
    product: shoppingCartProduct;
    onRemoveProduct: (product: shoppingCartProduct) => void;
    onQtyUpdated: (
        product: shoppingCartProduct,
        qty: number,
        type: "decrement" | "increment" | "changeValue"
    ) => void;
}

function ShoppingCartProductCard({
    product,
    onRemoveProduct: handleRemoveProduct,
    onQtyUpdated: handleQtyUpdated,
}: ShoppingCartProductCardProps) {
    const grandTotal = useMemo(() => {
        let crrTotal = product.grandTotal;
        if (product.quantity !== 0 && !isNaN(product.quantity)) {
            crrTotal = crrTotal * product.quantity;
        }
        return USDollar.format(crrTotal);
    }, [product.quantity]);

    return (
        <div className={classes.shoppingCartProductCard}>
            <div className={classes.productContent}>
                <div className={classes.productDescription}>
                    <h1>{`${product.composition.model} ${
                        product.composition.size
                    } ${product.composition.sinkPosition} SINK ${
                        product.washbasin ? product.washbasin.model : "NOT SINK"
                    }`}</h1>
                </div>
                <div className={classes.productDetails}>
                    <span>
                        <h2>VANITY:</h2>
                        <p>{product.vanity.descw}</p>
                    </span>
                    <span>
                        <h2>WASHBASIN:</h2>
                        <p>{product.washbasin?.descw ?? "NONE"}</p>
                    </span>
                    <span>
                        <h2>SIDE UNITS:</h2>
                        <div className={classes.sideUnitsWrapper}>
                            {product.sideUnits.map((sideUnit, index) => (
                                <p key={index}>{sideUnit.descw}</p>
                            ))}
                            {product.sideUnits.length === 0 && "NONE"}
                        </div>
                    </span>
                    <span>
                        <h2>TOTAL:</h2>
                        <p>{grandTotal}</p>
                    </span>
                    <span className={classes.inputAndRemoveButtonWrapper}>
                        <CustomQtyInput
                            product={product}
                            onQtyUpdated={handleQtyUpdated}
                        />
                        <button onClick={() => handleRemoveProduct(product)}>
                            REMOVE
                        </button>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ShoppingCartProductCard;
