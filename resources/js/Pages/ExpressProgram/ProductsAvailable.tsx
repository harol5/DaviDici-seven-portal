import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import User from "../../Models/User";
import useExpressProgramProducts from "../../Hooks/useExpressProgramProducts";
import type { ProductInventory } from "../../Models/Product";
import type { ListingType } from "../../Models/ExpressProgramModels";
import CompositionsListing from "./CompositionsListing";
import classes from "../../../css/express-program.module.css";
import { router } from "@inertiajs/react";
import { useState } from "react";

interface ProductsAvailableProps {
    auth: User;
    rawProducts: ProductInventory[];
    message?: string;
    listingType: ListingType;
}

function ProductsAvailable({
    auth,
    rawProducts,
    listingType,
}: ProductsAvailableProps) {
    const regularCompositionsListingData =
        useExpressProgramProducts(rawProducts);

    const onSaleCompositionsListingData = useExpressProgramProducts(
        rawProducts,
        true
    );

    const [isLoading, setIsLoading] = useState(false);

    const handleListingType = (listingType: ListingType) => {
        localStorage.setItem(
            "statefulFilters",
            JSON.stringify({
                crrFilteredSize: "",
                crrFilteredSinkPosition: "",
                crrFilteredFinish: "",
                crrFilteredModel: "",
            })
        );

        localStorage.setItem("listingType", listingType);

        if (listingType === "onSale")
            router.get(
                "/express-program?listing-type=onSale",
                {
                    only: ["listingType"],
                },
                {
                    onStart: () => setIsLoading(true),
                    onFinish: () => setIsLoading(false),
                }
            );
        else
            router.get(
                "/express-program?listing-type=fullInventory",
                {
                    only: ["listingType"],
                },
                {
                    onStart: () => setIsLoading(true),
                    onFinish: () => setIsLoading(false),
                }
            );
    };

    const getClasses = (listingTypeSelected: ListingType) => {
        let baseClass =
            listingTypeSelected === "onSale"
                ? `${classes.listingTypeButtons} ${classes.monthlyPromotionButton}`
                : classes.listingTypeButtons;

        if (listingType === listingTypeSelected)
            baseClass += ` ${classes.listingSelected}`;
        return baseClass;
    };

    return (
        <UserAuthenticatedLayout auth={auth} crrPage="express program">
            <div className="main-content-wrapper">
                {onSaleCompositionsListingData.initialCompositions.length >
                    0 && (
                    <article className={classes.listingTypeButtonsWrapper}>
                        <button
                            className={getClasses("fullInventory")}
                            onClick={() => handleListingType("fullInventory")}
                        >
                            FULL INVENTORY
                        </button>
                        <button
                            className={getClasses("onSale")}
                            onClick={() => handleListingType("onSale")}
                        >
                            MONTHLY SPECIAL!!
                        </button>
                    </article>
                )}

                {isLoading && (
                    <p className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-7 bg-white text-center">
                        <img
                            className={classes.logoLoadSpinner}
                            src={`https://${location.hostname}/images/davidici-logo-no-letters.svg`}
                            alt="home icon"
                        />
                        fetching products...
                    </p>
                )}

                {!isLoading && (
                    <>
                        {listingType === "fullInventory" && (
                            <CompositionsListing
                                data={regularCompositionsListingData}
                            />
                        )}

                        {listingType === "onSale" && (
                            <CompositionsListing
                                data={onSaleCompositionsListingData}
                            />
                        )}
                    </>
                )}
            </div>
        </UserAuthenticatedLayout>
    );
}

export default ProductsAvailable;
