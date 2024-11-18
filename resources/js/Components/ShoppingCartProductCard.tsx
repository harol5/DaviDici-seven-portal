import type { ShoppingCartProduct } from "../Models/ExpressProgramModels";
import CustomQtyInput from "./CustomQtyInput";
import classes from "../../css/shoppingCartProductCard.module.css";
import USDollar from "../utils/currentFormatter";
import { memo } from "react";
import { ProductInventory } from "../Models/Product";

interface ShoppingCartProductCardProps {
    product: ShoppingCartProduct;
    productIndex: number;
    onRemoveProduct: (
        product: ShoppingCartProduct,
        productIndex: number
    ) => void;
    onQtyUpdated: (
        product: ShoppingCartProduct,
        productIndex: number,
        qty: number,
        type: "decrement" | "increment" | "changeValue"
    ) => void;
}

function ShoppingCartProductCard({
    product,
    productIndex,
    onRemoveProduct: handleRemoveProduct,
    onQtyUpdated: handleQtyUpdated,
}: ShoppingCartProductCardProps) {
    const getGrandTotal = () => {
        let crrTotal = product.grandTotal;
        if (product.quantity !== 0 && !isNaN(product.quantity)) {
            crrTotal = crrTotal * product.quantity;
        }
        return USDollar.format(crrTotal);
    };

    return (
        <div className={classes.shoppingCartProductCard}>
            <div className={classes.productContent}>
                <div className={classes.productDescription}>
                    <h1>{`${product.composition.model} ${
                        product.composition.size ?? ""
                    } ${product.composition.sinkPosition ?? ""} ${
                        product.washbasin
                            ? "SINK " + product.washbasin.model
                            : "NOT SINK"
                    }`}</h1>
                </div>
                <div className={classes.productDetails}>
                    <span>
                        <h2>COMPOSITION NAME:</h2>
                        <p>{product.label?.toUpperCase()}</p>
                    </span>
                    <span>
                        <h2>VANITY:</h2>
                        <p>{product.vanity?.descw ?? "NONE"}</p>
                        <p>
                            $
                            {product.vanity?.sprice
                                ? product.vanity?.sprice
                                : product.vanity?.msrp
                                ? product.vanity?.msrp
                                : "NONE"}
                        </p>
                    </span>
                    <span>
                        <h2>WASHBASIN:</h2>
                        <p>{product.washbasin?.descw ?? "NONE"}</p>
                        <p>
                            $
                            {product.washbasin?.sprice
                                ? product.washbasin?.sprice
                                : product.washbasin?.msrp
                                ? product.washbasin?.msrp
                                : "NONE"}
                        </p>
                    </span>
                    <span>
                        <h2>SIDE UNITS:</h2>
                        <div className={classes.sideUnitsWrapper}>
                            {product.sideUnits.map(
                                (sideUnit: ProductInventory, index: number) => (
                                    <div key={index}>
                                        <p>{sideUnit.descw}</p>
                                        <p>
                                            $
                                            {sideUnit.sprice
                                                ? sideUnit.sprice
                                                : sideUnit.msrp
                                                ? sideUnit.msrp
                                                : ""}
                                        </p>
                                    </div>
                                )
                            )}
                            {product.sideUnits.length === 0 && "NONE"}
                        </div>
                    </span>
                    <OtherItems product={product} />
                    <span>
                        <h2>TOTAL:</h2>
                        <p>{getGrandTotal()}</p>
                    </span>
                    {location.pathname !== "/orders/create-so-num" && (
                        <span className={classes.inputAndRemoveButtonWrapper}>
                            <CustomQtyInput
                                product={product}
                                productIndex={productIndex}
                                onQtyUpdated={handleQtyUpdated}
                            />
                            <button
                                onClick={() =>
                                    handleRemoveProduct(product, productIndex)
                                }
                                disabled={
                                    location.pathname ===
                                    "/orders/create-so-num"
                                }
                            >
                                REMOVE
                            </button>
                        </span>
                    )}
                    {location.pathname === "/orders/create-so-num" && (
                        <span>
                            <h2>QUANTITY:</h2>
                            <p>{product.quantity.toString()}</p>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ShoppingCartProductCard;

const OtherItems = memo(function ({
    product,
}: {
    product: ShoppingCartProduct;
}) {
    const items = product.otherProducts;
    let validItems: { title: string; products: ProductInventory[] }[] = [];
    for (const item in items) {
        const products = items[item as keyof typeof items];
        if (products!.length !== 0) {
            validItems.push({
                title: item.toUpperCase(),
                products: products as ProductInventory[],
            });
        }
    }

    return (
        <>
            {validItems.map((item, index) => (
                <span key={index}>
                    <h2>{item?.title}</h2>
                    <div className={classes.sideUnitsWrapper}>
                        {item?.products.map((product, index) => (
                            <div key={index}>
                                <p>{product.descw}</p>
                                <p>
                                    $
                                    {product.sprice
                                        ? product.sprice
                                        : product.msrp
                                        ? product.msrp
                                        : ""}
                                </p>
                            </div>
                        ))}
                    </div>
                </span>
            ))}
        </>
    );
});
