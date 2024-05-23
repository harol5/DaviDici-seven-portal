import { Link } from "@inertiajs/react";
import type { Order as OrderModel, OrderRecord } from "../Models/Order";

interface OrderProps {
    order: OrderModel;
}

function Order({ order }: OrderProps) {
    const orderFormatted: OrderRecord = {
        ...order,
    };

    return (
        <div
            className="order-container shadow shadow-gray-300 m-3 text-[0.9em] transition-shadow hover:shadow-none hover:boder hover:border-davidiciGold"
            id={order.ordernum}
        >
            <div className="order">
                <h2>{order.ordernum}</h2>
                <div className="order-details-wrapper">
                    <span>
                        <h2>Status:</h2>
                        <p>{order.status}</p>
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
                </div>
                <Link
                    href={`/orders/${order.ordernum}/overview`}
                    data={orderFormatted}
                    className="rounded border shadow-sm shadow-gray-100 px-5 py-2 transition-shadow hover:shadow-gray-700"
                >
                    View Order
                </Link>
            </div>
        </div>
    );
}

export default Order;
