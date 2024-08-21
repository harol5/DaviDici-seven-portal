import type { shoppingCartProduct } from "../Models/ExpressProgramModels";
import CustomQtyInput from "./CustomQtyInput";
import classes from "../../css/CustomQtyInput.module.css";

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
        <div>
            <p>{product.vanity.descw}</p>
            <p>{product.washbasin?.descw}</p>
            <div>
                {product.sideUnits.map((sideUnit, index) => (
                    <p key={index}>{sideUnit.descw}</p>
                ))}
            </div>
            <CustomQtyInput product={product} onQtyUpdated={handleQtyUpdated} />
            <p>{product.grandTotal}</p>
            <button onClick={() => handleRemoveProduct(product)}>REMOVE</button>
        </div>
    );
}

export default ShoppingCartProductCard;
