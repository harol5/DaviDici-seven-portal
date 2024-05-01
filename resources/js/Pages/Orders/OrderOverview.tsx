import OrderLayout from "../../Layouts/OrderLayout";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import Modal from "../../Components/Modal";
import ProductStatusCard from "../../Components/ProductStatusCard";
import { useState } from "react";
import type { Order as OrderModel } from "../../Models/Order";
import type { Product as ProductModel } from "../../Models/Product";

interface OrderOverviewProps {
    order: OrderModel;
    products: ProductModel[];
}

function OrderOverview({ order, products }: OrderOverviewProps) {
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <UserAuthenticatedLayout crrPage="orders">
            <OrderLayout order={order} crrOrderOption="overview">
                <section className="overview-wrapper">
                    <section className="order-details-wrapper">
                        <span>
                            <button
                                className="check-status-button"
                                onClick={handleOpenModal}
                            >
                                Check Status
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
                    <section className="actions-pending-wrapper">
                        <h1>Actions Pending</h1>
                        <ul>
                            <li>fill out delivery</li>
                            <li>fill out payment details</li>
                            <li>approve order</li>
                        </ul>
                    </section>
                </section>
            </OrderLayout>
            <Modal show={openModal} onClose={handleCloseModal}>
                <h1 className="order-status-title">Order Status</h1>
                <section className="products-status-wrapper">
                    {products.map((product) => (
                        <ProductStatusCard
                            key={product.linenum}
                            product={product}
                        />
                    ))}
                </section>
                <button
                    className="close-modal-button"
                    onClick={handleCloseModal}
                >
                    Close
                </button>
            </Modal>
        </UserAuthenticatedLayout>
    );
}

export default OrderOverview;
