import { Link } from "@inertiajs/react";
import { ReactNode } from "react";
import type { Order as OrderModel, OrderRecord } from "../Models/Order";

interface OrderLayoutProps {
    children?: ReactNode;
    order: OrderModel;
    crrOrderOption: string;
}

function OrderLayout({ children, order, crrOrderOption }: OrderLayoutProps) {
    const orderFormatted: OrderRecord = {
        ...order,
    };

    return (
        <div className="main-content-wrapper -order">
            <div className="order-options-menu-wrapper">
                <ul>
                    <li
                        className={
                            crrOrderOption === "overview"
                                ? "options active-order-option"
                                : "options"
                        }
                    >
                        <Link
                            href={`/orders/${order.ordernum}/overview`}
                            data={orderFormatted}
                            disabled={
                                crrOrderOption === "overview" ? true : false
                            }
                        >
                            Overview
                        </Link>
                    </li>
                    <li
                        className={
                            crrOrderOption === "details"
                                ? "options active-order-option"
                                : "options"
                        }
                    >
                        <Link
                            href={`/orders/${order.ordernum}/details`}
                            data={orderFormatted}
                            disabled={
                                crrOrderOption === "details" ? true : false
                            }
                        >
                            Order details
                        </Link>
                    </li>
                    <li
                        className={
                            crrOrderOption === "delivery"
                                ? "options active-order-option"
                                : "options"
                        }
                    >
                        <Link
                            href={`/orders/${order.ordernum}/delivery`}
                            data={orderFormatted}
                        >
                            Delivery options
                        </Link>
                    </li>
                    <li
                        className={
                            crrOrderOption === "payment"
                                ? "options active-order-option"
                                : "options"
                        }
                    >
                        <Link
                            href={`/orders/${order.ordernum}/payment`}
                            data={orderFormatted}
                        >
                            Payment details
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="order-main-content-wrapper">
                <div className="order-header-wrapper">
                    <div className="order-number-wrapper">
                        <h1>Order Number:</h1>
                        <span>{order.ordernum}</span>
                    </div>
                    <div className="order-buttons-wrapper">
                        <button>print order</button>
                        <button>approve order</button>
                    </div>
                </div>
                <div className="order-body-wrapper">{children}</div>
            </div>
        </div>
    );
}

export default OrderLayout;
