import { useState } from "react";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import Filter from "../../Components/Filter";
import ProductExpressProgramCard from "../../Components/ProductExpressProgramCard";
import User from "../../Models/User";
import useExpressProgramProducts from "../../Hooks/useExpressProgramProducts";
import type { ProductInventory } from "../../Models/Product";
import type { Composition } from "../../Models/Composition";
import classes from "../../../css/express-program.module.css";

interface ProductsAvailableProps {
    auth: User;
    rawProducts: ProductInventory[];
}

function ProductsAvailable({ auth, rawProducts }: ProductsAvailableProps) {
    // this creates all the possible compositions.
    const { compositions, sizesForFilter, finishesForFilter } =
        useExpressProgramProducts(rawProducts);

    // this will re-render when filter is used.
    const [products, setProducts] = useState(compositions);

    const [crrValueFiltered, setCrrValueFiltered] = useState("");

    const handleFilter = (filter: string, value: string) => {
        let productsFiltered: Composition[] = [];

        if (filter === "sizes") {
            productsFiltered = compositions.filter((product) => {
                return product.size === value;
            });
        }

        if (filter === "images") {
            productsFiltered = compositions.filter((product) => {
                for (const finishObj of product.finishes) {
                    if (finishObj.finish === value) return true;
                }
                return false;
            });
        }

        setCrrValueFiltered(value);
        setProducts(productsFiltered);
    };

    return (
        <UserAuthenticatedLayout auth={auth} crrPage="orders">
            <div className="main-content-wrapper">
                <section className={classes.allFiltersWrapper}>
                    <Filter
                        filterTitle="Filter By Size"
                        contentType="sizes"
                        values={sizesForFilter}
                        crrValueSelected={crrValueFiltered}
                        onFilter={handleFilter}
                    />
                    <Filter
                        filterTitle="Filter By Color"
                        contentType="images"
                        values={finishesForFilter}
                        crrValueSelected={crrValueFiltered}
                        onFilter={handleFilter}
                    />
                </section>
                <section className={classes.expressProgramProductsWrapper}>
                    {products.map((product, index) => (
                        <ProductExpressProgramCard
                            product={product}
                            key={index}
                        />
                    ))}
                </section>
            </div>
        </UserAuthenticatedLayout>
    );
}

export default ProductsAvailable;
