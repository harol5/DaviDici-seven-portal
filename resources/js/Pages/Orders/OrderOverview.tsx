import OrderLayout from "../../Layouts/OrderLayout";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import Modal from "../../Components/Modal";
import ProductStatusCard from "../../Components/ProductStatusCard";
import { useState } from "react";
import type { Order as OrderModel } from "../../Models/Order";
import type { Product as ProductModel } from "../../Models/Product";
import User from "../../Models/User";

interface OrderOverviewProps {
    auth?: User;
    order: OrderModel;
    products: ProductModel[];
    isPaymentSubmitted: boolean;
    isDeliveryInfoSave: boolean;
}

function OrderOverview({
    auth,
    order,
    products,
    isPaymentSubmitted,
    isDeliveryInfoSave,
}: OrderOverviewProps) {
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <UserAuthenticatedLayout auth={auth} crrPage="orders">
            <OrderLayout order={order} crrOrderOption="overview">
                <section className="overview-wrapper mt-6">
                    <section className="actions-pending-wrapper p-3 bg-zinc-50 shadow-inner shadow-gray-300 rounded-md border border-davidiciGold">
                        <h1>Actions Pending</h1>
                        <ul>
                            {!isDeliveryInfoSave && <li>fill out delivery</li>}
                            {!isPaymentSubmitted && (
                                <li>fill out payment details</li>
                            )}
                        </ul>
                    </section>
                    <section className="order-details-wrapper py-5 px-4 bg-zinc-50 shadow-inner shadow-gray-300 rounded-md border border-davidiciGold">
                        <span>
                            <button
                                className="rounded border border-davidiciGold shadow-sm  px-5 py-2 transition-shadow text-sm hover:shadow-gray-500"
                                onClick={handleOpenModal}
                            >
                                check status
                            </button>
                        </span>
                        <span>
                            <h2>Sub-total:</h2>
                            <p>${order.subtotal}</p>
                        </span>
                        <span>
                            <h2>Order date:</h2>
                            <p>{order.orderdate}</p>
                        </span>
                        <span>
                            <h2>Total Credit:</h2>
                            <p>${order.totcredit}</p>
                        </span>
                        <span>
                            <h2>Submitted date:</h2>
                            <p>{order.submitted}</p>
                        </span>
                        <span>
                            <h2>Total:</h2>
                            <p>${order.total}</p>
                        </span>
                    </section>
                </section>
            </OrderLayout>
            <Modal show={openModal} onClose={handleCloseModal}>
                <h1 className="order-status-title text-lg">Order Status</h1>
                <section className="products-status-wrapper bg-zinc-50 shadow-inner shadow-gray-300 rounded-md mx-16">
                    {products.map((product) => (
                        <ProductStatusCard
                            key={product.linenum}
                            product={product}
                        />
                    ))}
                </section>
                <button
                    className="close-modal-button rounded border shadow-sm shadow-gray-950 px-5 py-2 transition-shadow hover:shadow-none"
                    onClick={handleCloseModal}
                >
                    Close
                </button>
            </Modal>
        </UserAuthenticatedLayout>
    );
}

export default OrderOverview;
