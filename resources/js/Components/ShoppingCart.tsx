import { useEffect, useState } from "react";
import {
    ShoppingCartComposition,
    ShoppingCartCompositionProduct,
} from "../Models/ExpressProgramModels";
import axios from "axios";
import ShoppingCartCompositionCard from "./ShoppingCartCompositionCard";
import classes from "../../css/shoppingCart.module.css";
import { router } from "@inertiajs/react";
import USDollar from "../utils/currentFormatter";
import { getShoppingCartCompositions } from "../utils/shoppingCartUtils";


interface ShoppingCartProps {
    onShoppingSize: (numOfProducts: number) => void;
    onClose: () => void;
}

function ShoppingCart({
    onShoppingSize: handleShoppingCartSize,
    onClose: handleCloseShoppingCartModal,
}: ShoppingCartProps) {
    const [crrShoppingCartCompositions, setShoppingCartCompositions] = useState<
        ShoppingCartComposition[]
    >([]);

    const getCompositionAndProduct = (
        composition: ShoppingCartComposition,
        compositionIndex: number,
        product: ShoppingCartCompositionProduct | null,
        otherProductIndex: number | null,
        sideUnitIndex: number | null
    ) => {
        const updatedShoppingCartCompositions = structuredClone(
            crrShoppingCartCompositions
        );
        let crrComposition: ShoppingCartComposition | null = null;
        let crrProduct: ShoppingCartCompositionProduct | null = null;

        for (let i = 0; i < updatedShoppingCartCompositions.length; i++) {
            if (
                updatedShoppingCartCompositions[i].description ===
                    composition.description &&
                compositionIndex === i
            ) {
                crrComposition = updatedShoppingCartCompositions[i];
            }
        }

        if (product && crrComposition) {
            if (otherProductIndex !== null) {
                crrProduct =
                    crrComposition!.otherProducts[
                        product.type as keyof typeof crrComposition.otherProducts
                    ]![otherProductIndex];
            } else if (sideUnitIndex !== null) {
                crrProduct =
                    crrComposition![
                        product.type as keyof typeof crrComposition
                    ][sideUnitIndex];
            } else {
                crrProduct =
                    crrComposition![
                        product.type as keyof typeof crrComposition
                    ];
            }
        }

        return {
            shoppingCartCompositionsCopy: updatedShoppingCartCompositions,
            crrComposition,
            crrProduct,
        };
    };

    // DONE!!
    const handleRemoveProduct = async (
        composition: ShoppingCartComposition,
        compositionIndex: number,
        product: ShoppingCartCompositionProduct | null,
        otherProductIndex: number | null,
        sideUnitIndex: number | null,
        removeAction: "composition" | "composition product",
    ) => {
        const { shoppingCartCompositionsCopy, crrComposition, crrProduct } =
            getCompositionAndProduct(
                composition,
                compositionIndex,
                product,
                otherProductIndex,
                sideUnitIndex
            );

        if (removeAction === "composition") {
            shoppingCartCompositionsCopy.splice(compositionIndex,1);
        }


        if (removeAction === "composition product" && crrComposition && crrProduct) {
            crrComposition.grandTotal -= crrProduct.total;

            if (otherProductIndex !== null) {
                crrComposition.otherProducts[crrProduct.type as keyof typeof crrComposition.otherProducts]!.splice(otherProductIndex,1);
            }else if (sideUnitIndex !== null){
                crrComposition[crrProduct.type as keyof typeof crrComposition].splice(sideUnitIndex,1);
            }else if (crrProduct.type === "washbasin") {
                crrComposition.washbasin = null;
            }else {
                crrComposition.vanity = null;
            }
        }

        try {
            const response = await axios.post(
                "/express-program/shopping-cart/update",
                shoppingCartCompositionsCopy
            );

            if (response.data.message === "shopping cart updated") {
                handleShoppingCartSize(shoppingCartCompositionsCopy.length);
                setShoppingCartCompositions(shoppingCartCompositionsCopy);
            }
        } catch (err) {
            console.log(err);
        }
    };


    const handleQtyUpdated = async (
        composition: ShoppingCartComposition,
        compositionIndex: number,
        product: ShoppingCartCompositionProduct,
        otherProductIndex: number | null,
        sideUnitIndex: number | null,
        qty: number | typeof NaN,
        type: "decrement" | "increment" | "changeValue"
    ) => {
        const { shoppingCartCompositionsCopy, crrComposition, crrProduct } =
            getCompositionAndProduct(
                composition,
                compositionIndex,
                product,
                otherProductIndex,
                sideUnitIndex
            );

        if (crrComposition && crrProduct) {
            crrComposition.grandTotal -= crrProduct.total;
            switch (type) {
                case "changeValue":
                    crrProduct.quantity = qty;
                    crrProduct.total = qty * crrProduct.unitPrice;
                    break;
                case "decrement":
                    crrProduct.quantity = qty === 1 ? qty : --qty;
                    crrProduct.total = qty * crrProduct.unitPrice;
                    break;
                case "increment":
                    crrProduct.quantity = ++qty;
                    crrProduct.total = qty * crrProduct.unitPrice;
                    break;
                default:
                    throw new Error("invalid type");
            }
            crrComposition.grandTotal += crrProduct.total;
        }

        setShoppingCartCompositions(shoppingCartCompositionsCopy);
        if (qty <= 0 || isNaN(qty)) return;

        try {
            await axios.post(
                "/express-program/shopping-cart/update",
                shoppingCartCompositionsCopy
            );
        } catch (err) {
            console.log(err);
        }
    };

    const handlePlaceOrder = () => {
        let SKU: string[] = [];

        crrShoppingCartCompositions.forEach((composition) => {
            const skusArr: string[] = [];

            if (composition.vanity) {
                skusArr.push(
                    `${composition.vanity.productObj.uscode}!!${
                        composition.info.model
                    }--${
                        composition.vanity.quantity
                    }##${composition.label}`
                );
            }

            if (composition.washbasin) {
                skusArr.push(
                    `${composition.washbasin.productObj.uscode}!!${composition.info.model}--${composition.washbasin.quantity}##${composition.label}`
                );
            }

            if (composition.sideUnits.length > 0) {
                composition.sideUnits.forEach(
                    (sideunit: ShoppingCartCompositionProduct) => {
                        skusArr.push(
                            `${sideunit.productObj.uscode}!!${
                                composition.info.model
                            }--${
                                sideunit.quantity
                            }##${composition.label}`
                        );
                    }
                );
            }

            for (const item in composition.otherProducts) {
                const itemProducts = composition.otherProducts[
                    item as keyof typeof composition.otherProducts
                ] as ShoppingCartCompositionProduct[];
                itemProducts.forEach((product: ShoppingCartCompositionProduct) => {
                    skusArr.push(
                        `${product.productObj.uscode}!!${composition.info.model}--${product.quantity}##${composition.label}`
                    );
                });
            }

            SKU.push(skusArr.join("~"));
        });

        router.get("/orders/create-so-num", {
            SKU: SKU.join("~"),
            isShoppingCart: true,
        });
    };

    const calGrandTotal = (): number => {
        return crrShoppingCartCompositions.reduce((prev, crr) => {
            return prev + crr.grandTotal;
        }, 0);
    };

    useEffect(() => {
        const getShoppingCartProducts = async () => {
            try {
                const { compositions } = await getShoppingCartCompositions();
                setShoppingCartCompositions(compositions);
            } catch (err) {
                console.error(err);
            }
        };
        getShoppingCartProducts();
    }, []);

    return (
        <section className={classes.shoppingCart}>
            <section className={classes.grandTotalAndPlaceOrderButtonWrapper}>
                <span className={classes.granTotalWrapper}>
                    <h1>GRAND TOTAL:</h1>
                    <p>{USDollar.format(calGrandTotal())}</p>
                </span>
                {location.pathname !== "/orders/create-so-num" && (
                    <button
                        className={classes.placeOrderButton}
                        onClick={handlePlaceOrder}
                        disabled={crrShoppingCartCompositions.length === 0}
                    >
                        PLACE ORDER
                    </button>
                )}
                <button
                    className={classes.placeOrderButton}
                    onClick={handleCloseShoppingCartModal}
                >
                    CLOSE CART
                </button>
            </section>
            <section className={classes.shoppingCartContent}>
                {crrShoppingCartCompositions.map((composition, index) => (
                    <ShoppingCartCompositionCard
                        key={index}
                        composition={composition}
                        compositionIndex={index}
                        onRemoveProduct={handleRemoveProduct}
                        onQtyUpdated={handleQtyUpdated}
                    />
                ))}
            </section>
            {crrShoppingCartCompositions.length === 0 && (
                <p>YOUR SHOPPING CART IS EMPTY.</p>
            )}
        </section>
    );
}

export default ShoppingCart;
