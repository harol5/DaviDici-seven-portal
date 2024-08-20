import { useEffect, useState } from "react";
import { shoppingCartProduct as shoppingCartProductModel } from "../Models/ExpressProgramModels";
import User from "../Models/User";
import axios from "axios";
import ShoppingCartProductCard from "./ShoppingCartProductCard";

interface ShoppingCartProps {
    auth: User;
}

/**
 * TODO:
 * CREATE FUNCTION THAT UPDATES QTY OF PRODUCT.
 * CREATE FUNCTION THAT DELETES PRODUCT.
 * CREATE FUNCTION THAT GENERATES SKU STRING.
 *
 */

function ShoppingCart({ auth }: ShoppingCartProps) {
    const [crrShoppingCartProducts, setShoppingCartProducts] = useState<
        shoppingCartProductModel[]
    >([]);

    const handleRemoveProduct = async (product: shoppingCartProductModel) => {
        const filteredProducts = crrShoppingCartProducts.filter(
            (crrProduct) => crrProduct.description !== product.description
        );

        try {
            const response = await axios.post(
                "/express-program/shopping-cart/update",
                filteredProducts
            );

            if (response.data.message === "shopping cart updated")
                setShoppingCartProducts(filteredProducts);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const getShoppingCartProducts = async () => {
            try {
                // GET SHOPPING CART PRODUTS FROM SERVER.
                const response = await axios.get(
                    "/express-program/shopping-cart/products"
                );

                const shoppingCartProductsServer =
                    response.data.shoppingCartProducts;

                setShoppingCartProducts(shoppingCartProductsServer);
            } catch (err) {}
        };
        getShoppingCartProducts();
    }, []);

    console.log("====== SHOPPING CART COMPONENT========");
    console.log("current products", crrShoppingCartProducts);

    return (
        <section>
            {crrShoppingCartProducts.map((product, index) => (
                <ShoppingCartProductCard
                    product={product}
                    onRemoveProduct={handleRemoveProduct}
                    key={index}
                />
            ))}
        </section>
    );
}

export default ShoppingCart;
