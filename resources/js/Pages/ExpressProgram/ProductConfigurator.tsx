import { useEffect, useState } from "react";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import User from "../../Models/User";
import { Composition } from "../../Models/Composition";
import MargiConfigurator from "../../Components/ExpressProgramConfigurator/MargiConfigurator";
import NewBaliConfigurator from "../../Components/ExpressProgramConfigurator/NewBaliConfigurator";
import NewYorkConfigurator from "../../Components/ExpressProgramConfigurator/NewYorkConfigurator";
import EloraConfigurator from "../../Components/ExpressProgramConfigurator/EloraConfigurator";
import OtherModelsConfigurator from "../../Components/ExpressProgramConfigurator/OtherModelsConfigurator";
import { ShoppingCartProduct as shoppingCartProductModel } from "../../Models/ExpressProgramModels";
import axios from "axios";
import { router } from "@inertiajs/react";

interface ProductConfiguratorProps {
    auth: User;
    composition: Composition;
}

function ProductConfigurator({ auth, composition }: ProductConfiguratorProps) {
    const [shoppingCartSize, setShoppingCartSize] = useState(0);

    const handleShoppingCartProduct = async (
        shoppingCartProduct: shoppingCartProductModel
    ) => {
        if (!auth.user) {
            // saved intended products on local storage.
            localStorage.setItem(
                "shoppingCartProduct",
                JSON.stringify(shoppingCartProduct)
            );

            // redirect user to login page.
            router.get("/", { location: "express-program" });
        } else {
            try {
                // GET SHOPPING CART PRODUTS FROM SERVER.
                const response = await axios.get(
                    "/express-program/shopping-cart/products"
                );

                const shoppingCartProductsServer: shoppingCartProductModel[] =
                    response.data.shoppingCartProducts;

                shoppingCartProductsServer.push(shoppingCartProduct);

                await axios.post(
                    "/express-program/shopping-cart/update",
                    shoppingCartProductsServer
                );

                setShoppingCartSize(shoppingCartProductsServer.length);
            } catch (err) {
                console.log(err);
            }
        }
    };

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            // event.preventDefault();
            // event.returnValue = true;
        };
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    return (
        <UserAuthenticatedLayout
            auth={auth}
            crrPage="express program"
            shoppingCartSize={shoppingCartSize}
        >
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
