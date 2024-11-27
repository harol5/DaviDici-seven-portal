import { useEffect, useState } from "react";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import User from "../../Models/User";
import { Composition } from "../../Models/Composition";
import MargiConfigurator from "../../Components/ExpressProgramConfigurator/MargiConfigurator";
import NewBaliConfigurator from "../../Components/ExpressProgramConfigurator/NewBaliConfigurator";
import NewYorkConfigurator from "../../Components/ExpressProgramConfigurator/NewYorkConfigurator";
import EloraConfigurator from "../../Components/ExpressProgramConfigurator/EloraConfigurator";
import OperaConfigurator from "../../Components/ExpressProgramConfigurator/OperaConfigurator";
import KoraConfigurator from "../../Components/ExpressProgramConfigurator/KoraConfigurator";
import KoraXlConfigurator from "../../Components/ExpressProgramConfigurator/KoraXlConfigurator";
import MirrorsOnlyConfigurator from "../../Components/ExpressProgramConfigurator/MirrorsOnlyConfigurator";
import OtherModelsConfigurator from "../../Components/ExpressProgramConfigurator/OtherModelsConfigurator";
import {
    ShoppingCartComposition,
} from "../../Models/ExpressProgramModels";
import { router } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";
import { updateShoppingCartCompositions } from "../../utils/shoppingCartUtils";

interface ProductConfiguratorProps {
    auth: User;
    composition: Composition;
}

function ProductConfigurator({ auth, composition }: ProductConfiguratorProps) {
    const [shoppingCartSize, setShoppingCartSize] = useState(0);

    const handleShoppingCartProduct = async (
        shoppingCartComposition: ShoppingCartComposition
    ) => {        
        try {
            const {compositions} = await updateShoppingCartCompositions(shoppingCartComposition);
            toast.success("Added to the cart!!");
            setShoppingCartSize(compositions.length);            
        }catch(err: any) {            
            if (err.message === "user no available") {
                // saved intended products on local storage.
                localStorage.setItem(
                    "shoppingCartComposition",
                    JSON.stringify(shoppingCartComposition)
                );
                // TODO: add a meesage that let user know they will be redirected.
                // redirect user to login page.
                router.get("/", { location: "express-program" });
            } else {
                toast.error("Internal error!!. Please comtact support");
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
                ) : composition.model === "OPERA" ? (
                    <OperaConfigurator
                        composition={composition}
                        onAddToCart={handleShoppingCartProduct}
                    />
                ) : composition.model === "KORA" ? (
                    <KoraConfigurator
                        composition={composition}
                        onAddToCart={handleShoppingCartProduct}
                    />
                ) : composition.model === "KORA XL" ? (
                    <KoraXlConfigurator
                        composition={composition}
                        onAddToCart={handleShoppingCartProduct}
                    />
                ) : composition.model === "MIRRORS" ? (
                    <MirrorsOnlyConfigurator
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
            <ToastContainer />
        </UserAuthenticatedLayout>
    );
}

export default ProductConfigurator;
