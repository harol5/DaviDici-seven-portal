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

    const [crrListingType, setListingType] = useState<ListingType>("regular");
    const handleListingType = (listingType: ListingType) => {
        setListingType(listingType);
    };

    const getClasses = (listingType: ListingType) => {
        let baseClass = classes.listingTypeButtons;
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
                            REGULAR PRICE
                        </button>
                        <button
                            className={getClasses("onSale")}
                            onClick={() => handleListingType("onSale")}
                        >
                            ON SALE PRODUCTS!!
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
