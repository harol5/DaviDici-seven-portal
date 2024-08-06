import { useEffect, useState } from "react";
import { shoppingCartProduct as shoppingCartProductModel } from "../Models/ExpressProgramModels";
import User from "../Models/User";
import axios from "axios";

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

    useEffect(() => {
        const getShoppingCartProducts = async () => {
            console.log("useEffectsync local server Ran!!");
            // GET SHOPPING CART PRODUTS FROM LOCAL STORAGE.
            if (!localStorage.getItem("shoppingCartProducts"))
                localStorage.setItem(
                    "shoppingCartProducts",
                    JSON.stringify([])
                );

            const shoppingCartProductsLocalStorage: shoppingCartProductModel[] =
                JSON.parse(localStorage.getItem("shoppingCartProducts")!);

            try {
                // GET SHOPPING CART PRODUTS FROM SERVER.
                const response = await axios.get(
                    "/express-program/shopping-cart/products"
                );

                const shoppingCartProductsServer =
                    response.data.shoppingCartProducts;
                console.log(shoppingCartProductsServer);
                // sync local and server shopping cart.
                if (
                    shoppingCartProductsLocalStorage.length === 0 &&
                    shoppingCartProductsServer.length !== 0
                ) {
                    localStorage.setItem(
                        "shoppingCartProducts",
                        JSON.stringify(shoppingCartProductsServer)
                    );

                    setShoppingCartProducts(shoppingCartProductsServer);
                } else if (
                    shoppingCartProductsServer.length === 0 &&
                    shoppingCartProductsLocalStorage.length !== 0
                ) {
                    setShoppingCartProducts(shoppingCartProductsLocalStorage);
                    if (auth.user) {
                        axios
                            .post(
                                "/express-program/shopping-cart/update",
                                shoppingCartProductsLocalStorage
                            )
                            .then((res) => console.log(res))
                            .catch((err) => console.log(err));
                    }
                } else {
                    localStorage.setItem(
                        "shoppingCartProducts",
                        JSON.stringify(shoppingCartProductsServer)
                    );

                    setShoppingCartProducts(shoppingCartProductsServer);
                }
            } catch (err) {}
        };

        getShoppingCartProducts();
    }, []);

    console.log("====== SHOPPING CART COMPONENT========");
    console.log("current products", crrShoppingCartProducts);
    console.log("user", auth);
    return <h1>shopping cart</h1>;
}

export default ShoppingCart;
