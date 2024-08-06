import { useEffect, useState } from "react";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import User from "../../Models/User";
import { Composition } from "../../Models/Composition";
import MargiConfigurator from "../../Components/ExpressProgramConfigurator/MargiConfigurator";
import NewBaliConfigurator from "../../Components/ExpressProgramConfigurator/NewBaliConfigurator";
import NewYorkConfigurator from "../../Components/ExpressProgramConfigurator/NewYorkConfigurator";
import EloraConfigurator from "../../Components/ExpressProgramConfigurator/EloraConfigurator";
import OtherModelsConfigurator from "../../Components/ExpressProgramConfigurator/OtherModelsConfigurator";
import { shoppingCartProduct as shoppingCartProductModel } from "../../Models/ExpressProgramModels";
import axios from "axios";

interface ProductConfiguratorProps {
    auth: User;
    composition: Composition;
}

function ProductConfigurator({ auth, composition }: ProductConfiguratorProps) {
    const handleShoppingCartProduct = async (
        shoppingCartProduct: shoppingCartProductModel
    ) => {
        let updatedShoppingCart = [];
        // GET SHOPPING CART PRODUTS FROM LOCAL STORAGE.
        if (!localStorage.getItem("shoppingCartProducts"))
            localStorage.setItem("shoppingCartProducts", JSON.stringify([]));

        const shoppingCartProductsLocalStorage: shoppingCartProductModel[] =
            JSON.parse(localStorage.getItem("shoppingCartProducts")!);

        try {
            // GET SHOPPING CART PRODUTS FROM SERVER.
            const response = await axios.get(
                "/express-program/shopping-cart/products"
            );

            const shoppingCartProductsServer: shoppingCartProductModel[] =
                response.data.shoppingCartProducts;

            // sync local and server shopping cart.
            if (
                shoppingCartProductsLocalStorage.length === 0 &&
                shoppingCartProductsServer.length !== 0
            ) {
                shoppingCartProductsServer.push(shoppingCartProduct);
                updatedShoppingCart = [...shoppingCartProductsServer];
            } else if (
                shoppingCartProductsServer.length === 0 &&
                shoppingCartProductsLocalStorage.length !== 0
            ) {
                shoppingCartProductsLocalStorage.push(shoppingCartProduct);
                updatedShoppingCart = [...shoppingCartProductsLocalStorage];
            } else {
                shoppingCartProductsServer.push(shoppingCartProduct);
                updatedShoppingCart = [...shoppingCartProductsServer];
            }

            localStorage.setItem(
                "shoppingCartProducts",
                JSON.stringify(updatedShoppingCart)
            );

            await axios.post(
                "/express-program/shopping-cart/update",
                updatedShoppingCart
            );
        } catch (err) {}
    };

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = true;
        };
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    return (
        <UserAuthenticatedLayout auth={auth} crrPage="orders">
            <div className="main-content-wrapper">
                {composition.model === "MARGI" ? (
                    <MargiConfigurator
                        composition={composition}
                        onAddToCart={handleShoppingCartProduct}
                    />
                ) : composition.model === "NEW BALI" ? (
                    <NewBaliConfigurator
                        composition={composition}
                        onAddToCart={handleShoppingCartProduct}
                    />
                ) : composition.model === "NEW YORK" ? (
                    <NewYorkConfigurator
                        composition={composition}
                        onAddToCart={handleShoppingCartProduct}
                    />
                ) : composition.model === "ELORA" ? (
                    <EloraConfigurator
                        composition={composition}
                        onAddToCart={handleShoppingCartProduct}
                    />
                ) : (
                    <OtherModelsConfigurator
                        composition={composition}
                        onAddToCart={handleShoppingCartProduct}
                    />
                )}
            </div>
        </UserAuthenticatedLayout>
    );
}

export default ProductConfigurator;
