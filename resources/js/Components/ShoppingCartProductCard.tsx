import type { shoppingCartProduct } from "../Models/ExpressProgramModels";
import CustomQtyInput from "./CustomQtyInput";
import classes from "../../css/shoppingCartProductCard.module.css";

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
                        <div>
                            {product.sideUnits.map((sideUnit, index) => (
                                <p key={index}>{sideUnit.descw}</p>
                            ))}
                            {product.sideUnits.length === 0 && "NONE"}
                        </div>
                    </span>
                    <span>
                        <h2>TOTAL:</h2>
                        <p>{product.grandTotal}</p>
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
