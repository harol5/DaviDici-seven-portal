import { Link } from "@inertiajs/react";
import type { Order as OrderModel, OrderRecord } from "../Models/Order";
import Modal from "./Modal";
import ProductStatusCard from "./ProductStatusCard";
import { useState } from "react";
import type { Product as ProductModel } from "../Models/Product";
import axios from "axios";

interface OrderProps {
    order: OrderModel;
}

function Order({ order }: OrderProps) {
    const orderFormatted: OrderRecord = {
        ...order,
    };

    const [openModal, setOpenModal] = useState(false);
    const [products, setProducts] = useState<ProductModel[]>([]);

    const handleOpenModal = async () => {
        setOpenModal(true);
        try {
            const response = await axios.get(
                `/orders/${order.ordernum}/products`
            );
            setProducts(response.data.products);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <div
            className="order-container shadow shadow-gray-300 border border-davidiciGold text-[0.9em] transition-shadow hover:shadow-davidiciGold/70 hover:shadow-md"
            id={order.ordernum}
        >
            <div className="order">
                <h2>{order.ordernum}</h2>
                <div className="order-details-wrapper">
                    <span>
                        <button
                            className="rounded-lg border border-davidiciGold shadow-sm shadow-gray-100 px-5 py-2 transition-shadow hover:shadow-gray-700 text-sm"
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
                        {order.submitted ? (
                            <p>{order.submitted}</p>
                        ) : (
                            <p>pending for approval</p>
                        )}
                    </span>
                    <span>
                        <h2>Total:</h2>
                        <p>${order.total}</p>
                    </span>
                </div>
                <Link
                    href={`/orders/${order.ordernum}/overview`}
                    data={orderFormatted}
                    className="rounded-lg border shadow-sm shadow-gray-100 px-5 py-2 transition-shadow hover:shadow-gray-700 bg-davidiciGold text-white w-[50%]"
                >
                    View Order
                </Link>
            </div>
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
        </div>
    );
}

export default Order;
