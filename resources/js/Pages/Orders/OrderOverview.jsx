import { Link } from "@inertiajs/react";
import OrderLayout from "../../Layouts/OrderLayout";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";

function OrderOverview({order}){
    return (
        <UserAuthenticatedLayout crrPage="orders">
            <OrderLayout order={order} crrOrderOption="overview">
                <section className="overview-wrapper">
                    <section className="order-details-wrapper">
                        <span>
                            <Link
                                href={`/orders/${order.ordernum}/overview/status`}
                                as="button"
                                type="button"
                            >
                                Check Status
                            </Link>
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
                            <li>aprrove order</li>
                        </ul>
                    </section>
                </section>
            </OrderLayout>
        </UserAuthenticatedLayout>
    ); 
}

export default OrderOverview;