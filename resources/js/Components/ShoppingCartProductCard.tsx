import type { shoppingCartProduct } from "../Models/ExpressProgramModels";

interface ShoppingCartProductCardProps {
    product: shoppingCartProduct;
    onRemoveProduct: (product: shoppingCartProduct) => void;
}

function ShoppingCartProductCard({
    product,
    onRemoveProduct: handleRemoveProduct,
}: ShoppingCartProductCardProps) {
    return (
        <div>
            <p>{product.vanity.descw}</p>
            <p>{product.washbasin.descw}</p>
            <div>
                {product.sideUnits.map((sideUnit, index) => (
                    <p key={index}>{sideUnit.descw}</p>
                ))}
            </div>
            <p>{product.quantity}</p>
            <p>{product.grandTotal}</p>
            <button onClick={() => handleRemoveProduct(product)}>REMOVE</button>
        </div>
    );
}

export default ShoppingCartProductCard;
