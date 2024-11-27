import type {
    ShoppingCartComposition,
    ShoppingCartCompositionProduct,
} from "../Models/ExpressProgramModels";
import CustomQtyInput from "./CustomQtyInput";
import classes from "../../css/shoppingCartProductCard.module.css";
import USDollar from "../utils/currentFormatter";
import { memo } from "react";

interface ShoppingCartCompositionCardProps {
    composition: ShoppingCartComposition;
    compositionIndex: number;
    onRemoveProduct: (
        composition: ShoppingCartComposition,
        compositionIndex: number,
        product: ShoppingCartCompositionProduct | null,
        otherProductIndex: number | null,
        sideUnitIndex: number | null,
        removeAction: "composition" | "composition product"
    ) => void;
    onQtyUpdated: (
        composition: ShoppingCartComposition,
        compositionIndex: number,
        product: ShoppingCartCompositionProduct,
        otherProductIndex: number | null,
        sideUnitIndex: number | null,
        qty: number,
        type: "decrement" | "increment" | "changeValue"
    ) => void;
}

function ShoppingCartCompositionCard({
    composition,
    compositionIndex,
    onRemoveProduct: handleRemoveProduct,
    onQtyUpdated: handleQtyUpdated,
}: ShoppingCartCompositionCardProps) {
    const getGrandTotal = () => {
        return USDollar.format(composition.grandTotal);
    };

    return (
        <div className={classes.shoppingCartProductCard}>
            <div className={classes.productContent}>
                <div className={classes.productDescription}>
                    <h1>{`${composition.info.model} ${
                        composition.info.size ?? ""
                    } ${composition.info.sinkPosition ?? ""} ${
                        composition.washbasin
                            ? "SINK " + composition.washbasin.productObj?.model
                            : "NOT SINK"
                    }`}</h1>
                </div>
                <div className={classes.productDetails}>
                    <span className={classes.header}>
                        <h2>COMPOSITION NAME:</h2>
                        <p>{composition.label?.toUpperCase()}</p>
                    </span>

                    <section className={classes.products}>
                        {composition.vanity ? (
                            <span className={classes.compositionProductContent}>
                                <h2>VANITY:</h2>
                                <p className={classes.description}>{composition.vanity.productObj.descw}</p>
                                <p className={classes.productTotal}>
                                    ${composition.vanity.unitPrice} X{" "}
                                    {composition.vanity.quantity} = $
                                    {composition.vanity.total}
                                </p>
                                <CustomQtyInput
                                    composition={composition}
                                    compositionIndex={compositionIndex}
                                    product={composition.vanity}
                                    otherProductIndex={null}
                                    sideUnitIndex={null}
                                    onQtyUpdated={handleQtyUpdated}
                                    onRemove={handleRemoveProduct}
                                />
                            </span>
                        ) : null}

                        {composition.washbasin ? (
                            <span className={classes.compositionProductContent}>
                                <h2>WASHBASIN:</h2>
                                <p className={classes.description}>{composition.washbasin.productObj.descw}</p>
                                <p className={classes.productTotal}>
                                    ${composition.washbasin.unitPrice} X{" "}
                                    {composition.washbasin.quantity} = $
                                    {composition.washbasin.total}
                                </p>
                                <CustomQtyInput
                                    composition={composition}
                                    compositionIndex={compositionIndex}
                                    product={composition.washbasin}
                                    otherProductIndex={null}
                                    sideUnitIndex={null}
                                    onQtyUpdated={handleQtyUpdated}
                                    onRemove={handleRemoveProduct}
                                />
                            </span>
                        ) : null}

                        {composition.sideUnits.length > 0 ? (
                            <span className={classes.compositionProductContent}>
                                <h2>SIDE UNITS:</h2>
                                <div className={classes.sideUnitsWrapper}>
                                    {composition.sideUnits.map(
                                        (
                                            sideUnit: ShoppingCartCompositionProduct,
                                            index: number
                                        ) => (
                                            <div key={index}>
                                                <p className={classes.description}>
                                                    {sideUnit.productObj.descw}
                                                </p>
                                                <p className={classes.productTotal}>
                                                    ${sideUnit.unitPrice} X{" "}
                                                    {sideUnit.quantity} = $
                                                    {sideUnit.total}
                                                </p>
                                                <CustomQtyInput
                                                    composition={composition}
                                                    compositionIndex={
                                                        compositionIndex
                                                    }
                                                    product={sideUnit}
                                                    otherProductIndex={null}
                                                    sideUnitIndex={index}
                                                    onQtyUpdated={
                                                        handleQtyUpdated
                                                    }
                                                    onRemove={
                                                        handleRemoveProduct
                                                    }
                                                />
                                            </div>
                                        )
                                    )}
                                </div>
                            </span>
                        ) : null}

                        <OtherItems
                            composition={composition}
                            compositionIndex={compositionIndex}
                            onQtyUpdated={handleQtyUpdated}
                            onRemoveProduct={handleRemoveProduct}
                        />
                    </section>

                    <span className={classes.total}>
                        <h2>TOTAL:</h2>
                        <p>{getGrandTotal()}</p>
                    </span>

                    {location.pathname !== "/orders/create-so-num" && (
                        <span className={classes.inputAndRemoveButtonWrapper}>
                            <button
                                onClick={() =>
                                    handleRemoveProduct(
                                        composition,
                                        compositionIndex,
                                        null,
                                        null,
                                        null,
                                        "composition"
                                    )
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
                </div>
            </div>
        </div>
    );
}

export default ShoppingCartCompositionCard;

interface OtherItemsProps {
    composition: ShoppingCartComposition;
    compositionIndex: number;
    onRemoveProduct: (
        composition: ShoppingCartComposition,
        compositionIndex: number,
        product: ShoppingCartCompositionProduct | null,
        otherProductIndex: number | null,
        sideUnitIndex: number | null,
        removeAction: "composition" | "composition product"
    ) => void;
    onQtyUpdated: (
        composition: ShoppingCartComposition,
        compositionIndex: number,
        product: ShoppingCartCompositionProduct,
        otherProductIndex: number | null,
        sideUnitIndex: number | null,
        qty: number,
        type: "decrement" | "increment" | "changeValue"
    ) => void;
}

const OtherItems = memo(function ({
    composition,
    compositionIndex,
    onRemoveProduct: handleRemoveProduct,
    onQtyUpdated: handleQtyUpdated,
}: OtherItemsProps) {
    const items = composition.otherProducts;
    let validItems: {
        title: string;
        products: ShoppingCartCompositionProduct[];
    }[] = [];

    for (const item in items) {
        const products = items[item as keyof typeof items];
        if (products!.length !== 0) {
            validItems.push({
                title: item.toUpperCase(),
                products: products as ShoppingCartCompositionProduct[],
            });
        }
    }

    return (
        <>
            {validItems.map((item, index) => (
                <span key={index} className={classes.compositionProductContent}>
                    <h2>{item?.title}</h2>
                    <div className={classes.sideUnitsWrapper}>
                        {item?.products.map((product, index) => (
                            <div key={index}>
                                <p className={classes.description}>{product.productObj.descw}</p>
                                <p className={classes.productTotal}>
                                    ${product.unitPrice} X {product.quantity} =
                                    ${product.total}
                                </p>
                                <CustomQtyInput
                                    composition={composition}
                                    compositionIndex={compositionIndex}
                                    product={product}
                                    otherProductIndex={index}
                                    sideUnitIndex={null}
                                    onQtyUpdated={handleQtyUpdated}
                                    onRemove={handleRemoveProduct}
                                />
                            </div>
                        ))}
                    </div>
                </span>
            ))}
        </>
    );
});
