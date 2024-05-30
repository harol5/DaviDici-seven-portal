import OrderLayout from "../../Layouts/OrderLayout";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import ProductDetailsCard from "../../Components/ProductDetailsCard";
import axios from "axios";
import { useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { router } from "@inertiajs/react";
import type { Order as OrderModel } from "../../Models/Order";
import type {
    Product as ProductModel,
    ProductRecord,
} from "../../Models/Product";
import { collections } from "../../Models/Collections";

interface OrderDetailsProps {
    rawOrder: OrderModel;
    rawProducts: ProductModel[];
    isPaymentSubmitted: boolean;
}

function OrderDetails({
    rawOrder,
    rawProducts,
    isPaymentSubmitted,
}: OrderDetailsProps) {
    const formatOrder = () => {
        const subtotal = Number.parseFloat(rawOrder.subtotal as string);
        const totcredit = Number.parseFloat(rawOrder.totcredit as string);
        const total = Number.parseFloat(rawOrder.total as string);

        return { ...rawOrder, subtotal, totcredit, total };
    };
    const formatProducts = () => {
        return rawProducts.filter(
            (product) => product.item !== "3% Credit Card Charge"
        );
    };

    const [order, setOrder] = useState(formatOrder);
    const [products, setProducts] = useState(formatProducts);
    const modelsAvailable = useMemo(() => {
        const set = new Set<string>();
        products.forEach((product) => {
            if (collections.includes(product.model)) set.add(product.model);
        });

        const arr = Array.from(set.values());
        return { set, arr };
    }, [products]);

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
        if (newQty < 1 || newQty > 50 || !newQty) {
            toast.error("Quantity can not be 0 or empty!!");
        } else {
            const updatedQty: ProductModel = { ...product, qty: newQty };
            axios
                .post(`/orders/${order.ordernum}/products/update`, updatedQty)
                .then(({ data }) => {
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
                    } else {
                        toast.error("Internal Error. Please contact support");
                    }
                })
                .catch((err) => console.log(err));
        }
    };

    const handleDelete = (
        product: ProductModel,
        handleCloseModal: () => void
    ) => {
        if (products.length === 1) {
            //specific type just for inertia.
            const productFormatted: ProductRecord = {
                ...product,
            };
            // Router from inertia is used in this case because when there is no products, user should be redirect to main page.
            router.post(`/orders/${order.ordernum}/products/delete`, {
                product: productFormatted,
                numOfProduct: products.length,
            });
            handleCloseModal();
        } else {
            axios
                .post(`/orders/${order.ordernum}/products/delete`, {
                    product,
                    numOfProduct: products.length,
                })
                .then(({ data }) => {
                    // "Updated Info" | "Can not delete -- already on PO"? | "Line Number does not match item"?
                    if (data.status === 201) {
                        const filteredProducts = data.products.filter(
                            (product: ProductModel) =>
                                product.item !== "3% Credit Card Charge"
                        );

                        setProducts(filteredProducts);

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
                        handleCloseModal();
                    }
                })
                .catch((err) => console.log(err));
        }
    };

    const handleNote = (
        sku: string,
        lineNum: number,
        note: string,
        handleCloseModal: () => void
    ) => {
        axios
            .post(`/orders/${order.ordernum}/products/note`, {
                sku,
                lineNum,
                note,
            })
            .then(({ data }) => {
                if (data.Result === "Updated Info") {
                    const productsCopy = [...products];
                    for (const product of productsCopy) {
                        if (
                            product.linenum === lineNum &&
                            product.uscode === sku
                        ) {
                            product.notes = note;
                            break;
                        }
                    }
                    setProducts(productsCopy);
                }
            })
            .catch((err) => console.log(err));

        handleCloseModal();
    };

    const handleModel = (sku: string, lineNum: number, model: string) => {
        if (model === "none") return;

        axios
            .post(`/orders/${order.ordernum}/products/model`, {
                sku,
                lineNum,
                model,
            })
            .then(({ data }) => {
                if (data.status === 201) {
                    const productsCopy = [...products];
                    for (const product of productsCopy) {
                        if (
                            product.linenum === lineNum &&
                            product.uscode === sku
                        ) {
                            product.model = model;
                            break;
                        }
                    }
                    setProducts(productsCopy);
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <UserAuthenticatedLayout crrPage="orders">
            <OrderLayout order={order} crrOrderOption="details">
                <section className="products-details-wrapper bg-zinc-50 shadow-inner shadow-gray-300 py-10 px-8 rounded-md">
                    {products.map((product) => (
                        <ProductDetailsCard
                            key={product.linenum}
                            product={product}
                            numOfProducts={products.length}
                            modelsAvailable={modelsAvailable}
                            handleQty={handleQty}
                            handleNote={handleNote}
                            handleDelete={handleDelete}
                            handleModel={handleModel}
                            isPaymentSubmitted={isPaymentSubmitted}
                            isSubmitedDate={order.submitted ? true : false}
                        />
                    ))}
                </section>
            </OrderLayout>
            <ToastContainer />
        </UserAuthenticatedLayout>
    );
}

export default OrderDetails;
