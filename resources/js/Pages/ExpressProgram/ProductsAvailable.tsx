import { useState } from "react";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import User from "../../Models/User";
import useExpressProgramProducts from "../../Hooks/useExpressProgramProducts";
import type { ProductInventory } from "../../Models/Product";
import type { ListingType } from "../../Models/ExpressProgramModels";
import CompositionsListing from "./CompositionsListing";
import classes from "../../../css/express-program.module.css";

interface ProductsAvailableProps {
    auth: User;
    rawProducts: ProductInventory[];
    message?: string;
}

function ProductsAvailable({ auth, rawProducts }: ProductsAvailableProps) {
    const regularCompositionsListingData =
        useExpressProgramProducts(rawProducts);

    const onSaleCompositionsListingData = useExpressProgramProducts(
        rawProducts,
        true
    );

    console.log(onSaleCompositionsListingData);

    const [crrListingType, setListingType] = useState<ListingType>(() => {
        const { initialCompositions } = onSaleCompositionsListingData;

        let listingType: ListingType = "regular";

        const statefulListingType = localStorage.getItem("listingType");

        if (initialCompositions.length > 0 && statefulListingType)
            listingType = statefulListingType as ListingType;

        return listingType;
    });

    const handleListingType = (listingType: ListingType) => {
        setListingType(listingType);
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
    };

    const getClasses = (listingType: ListingType) => {
        let baseClass =
            listingType === "onSale"
                ? `${classes.listingTypeButtons} ${classes.monthlyPromotionButton}`
                : classes.listingTypeButtons;

        if (crrListingType === listingType)
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
                            className={getClasses("regular")}
                            onClick={() => handleListingType("regular")}
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

                {crrListingType === "regular" && (
                    <CompositionsListing
                        data={regularCompositionsListingData}
                    />
                )}

                {crrListingType === "onSale" && (
                    <CompositionsListing data={onSaleCompositionsListingData} />
                )}
            </div>
        </UserAuthenticatedLayout>
    );
}

export default ProductsAvailable;
