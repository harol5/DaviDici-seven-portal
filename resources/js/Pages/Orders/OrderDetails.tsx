import OrderLayout from "../../Layouts/OrderLayout";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import ProductDetailsCard from "../../Components/ProductDetailsCard";
import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { router } from "@inertiajs/react";
import type { Order as OrderModel } from "../../Models/Order";
import type {
    Product as ProductModel,
    ProductRecord,
} from "../../Models/Product";

interface OrderDetailsProps {
    rawOrder: OrderModel;
    rawProducts: ProductModel[];
}

function OrderDetails({ rawOrder, rawProducts }: OrderDetailsProps) {
    const formatOrder = () => {
        const subtotal = Number.parseFloat(rawOrder.subtotal as string);
        const totcredit = Number.parseFloat(rawOrder.totcredit as string);
        const total = Number.parseFloat(rawOrder.total as string);

        return { ...rawOrder, subtotal, totcredit, total };
    };

    const [order, setOrder] = useState(formatOrder);
    const [products, setProducts] = useState(rawProducts);

    const handleGrandTotal = (
        outdatedProduct: ProductModel,
        updatedProduct: ProductModel
    ) => {
        //cal new sub total and grand Total.
        const subtotal =
            order.subtotal - outdatedProduct.total + updatedProduct.total;
        const subTotalFormatted =
            Math.round((subtotal + Number.EPSILON) * 100) / 100;

        const grandTotal = subTotalFormatted - order.totcredit;
        const grandTotalFormatted =
            Math.round((grandTotal + Number.EPSILON) * 100) / 100;

        setOrder((prev) => ({
            ...prev,
            subtotal: subTotalFormatted,
            total: grandTotalFormatted,
        }));
    };

    const handleQty = (value: string, product: ProductModel) => {
        const newQty = Number.parseInt(value);

        if (newQty < 1 || newQty > 50) {
            toast.error("Quantity can not be 0 or greater than 50");
        } else {
            const updatedQty: ProductModel = { ...product, qty: newQty };
            axios
                .post(`/orders/${order.ordernum}/products/update`, updatedQty)
                .then(({ data }) => {
                    console.log("handle qty:", data);
                    // "Can not update -- this item already on PO"? | "Updated Info" | "Can not update -- this Sales Order is in use"
                    if (data.Result === "Updated Info") {
                        const total = newQty * product.price;

                        const totalFormatted =
                            Math.round((total + Number.EPSILON) * 100) / 100;

                        const filteredProducts = products.filter(
                            (p) => p.uscode !== product.uscode
                        );

                        const updatedProduct = {
                            ...updatedQty,
                            total: totalFormatted,
                        };

                        const sortedProducts = [
                            ...filteredProducts,
                            updatedProduct,
                        ].sort((a, b) => a.linenum - b.linenum);

                        setProducts(sortedProducts);
                        handleGrandTotal(product, updatedProduct);
                    }
                })
                .catch((err) => console.log(err));
        }
    };

    const handleDelete = (product: ProductModel) => {
        if (products.length === 1) {
            const productFormatted: ProductRecord = {
                ...product,
            };

            router.post(`/orders/${order.ordernum}/products/delete`, {
                product: productFormatted,
                numOfProduct: products.length,
            });
        } else {
            axios
                .post(`/orders/${order.ordernum}/products/delete`, {
                    product,
                    numOfProduct: products.length,
                })
                .then(({ data }) => {
                    // "Updated Info" | "Can not delete -- already on PO"? | "Line Number does not match item"?
                    console.log(data);
                    if (data.Result === "Updated Info") {
                        const filteredProducts = products.filter(
                            (p) => p.uscode !== product.uscode
                        );
                        const sortedProducts = filteredProducts.sort(
                            (a, b) => a.linenum - b.linenum
                        );
                        setProducts(sortedProducts);

                        // ------------ write this as helper func.
                        const subtotal = order.subtotal - product.total;
                        const subTotalFormatted =
                            Math.round((subtotal + Number.EPSILON) * 100) / 100;

                        const grandTotal = subTotalFormatted - order.totcredit;
                        const grandTotalFormatted =
                            Math.round((grandTotal + Number.EPSILON) * 100) /
                            100;

                        setOrder((prev) => ({
                            ...prev,
                            subtotal: subTotalFormatted,
                            total: grandTotalFormatted,
                        }));
                        // --------------------------------------
                    }
                })
                .catch((err) => console.log(err));
        }
    };

    return (
        <UserAuthenticatedLayout crrPage="orders">
            <OrderLayout order={order} crrOrderOption="details">
                <section className="products-details-wrapper">
                    {products.map((product) => (
                        <ProductDetailsCard
                            key={product.linenum}
                            product={product}
                            numOfProducts={products.length}
                            handleQty={handleQty}
                            handleDelete={handleDelete}
                        />
                    ))}
                </section>
                <section className="flex">
                    <div className="mr-4">
                        <h2>Sub-total:</h2>
                        <h2>Total Credit:</h2>
                        <h2>Total:</h2>
                    </div>
                    <div>
                        <p>${order.subtotal}</p>
                        <p>${order.totcredit}</p>
                        <p className="border-t border-black">${order.total}</p>
                    </div>
                </section>
            </OrderLayout>
            <ToastContainer />
        </UserAuthenticatedLayout>
    );
}

export default OrderDetails;