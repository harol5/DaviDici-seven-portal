import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import User from "../../Models/User";
import useExpressProgramProducts from "../../Hooks/useExpressProgramProducts";
import type {
    FinishObj,
    ListingType,
    ModelObj,
    SinkPositionObj,
} from "../../Models/ExpressProgramModels";
import CompositionsListing from "./CompositionsListing";
import classes from "../../../css/express-program.module.css";
import LoadingSpinner from "../../Components/LoadingSpinner";
import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Composition } from "../../Models/Composition";

interface ProductsAvailableProps {
    auth: User;
    message?: string;
    listingType: ListingType;
}

interface ExpressProgramData {
    initialCompositions: Composition[];
    initialSizesForFilter: string[];
    initialFinishesForFilter: FinishObj[];
    initialSinkPositionsForFilter: SinkPositionObj[];
    initialModelsForFilter: ModelObj[];
}

function ProductsAvailable({ auth, listingType }: ProductsAvailableProps) {
    const { data: rawProducts } = useQuery({
        queryKey: ["expressProgramRawProductsData"],
        queryFn: () =>
            axios
                .get(`/express-program/products`)
                .then((res) => res.data.rawProducts),
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!rawProducts) return;
        setIsLoading(false);
    }, [rawProducts]);

    const regularCompositionsListingData =
        useExpressProgramProducts(rawProducts);

    const onSaleCompositionsListingData = useExpressProgramProducts(
        rawProducts,
        true
    );

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

    const [shoppingCartCount, setShoppingCartCount] = useState(0);
    const handleShoppingCartCount = (count: number) => {
        setShoppingCartCount(count);
    };

    return (
        <UserAuthenticatedLayout
            auth={auth}
            crrPage="express program"
            shoppingCartSize={shoppingCartCount}
        >
            <div className="main-content-wrapper">
                {onSaleCompositionsListingData &&
                onSaleCompositionsListingData.initialCompositions.length > 0 ? (
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
                ) : (
                    <></>
                )}

                {isLoading && <LoadingSpinner message="fetching products..." />}

                {!isLoading && (
                    <>
                        {listingType === "fullInventory" && (
                            <CompositionsListing
                                data={
                                    regularCompositionsListingData as ExpressProgramData
                                }
                                onShoppingCartCount={handleShoppingCartCount}
                            />
                        )}

                        {listingType === "onSale" && (
                            <CompositionsListing
                                data={
                                    onSaleCompositionsListingData as ExpressProgramData
                                }
                                onShoppingCartCount={handleShoppingCartCount}
                            />
                        )}
                    </>
                )}
            </div>
        </UserAuthenticatedLayout>
    );
}

export default ProductsAvailable;
