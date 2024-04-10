import UserAuthenticatedLayout from "./UserAuthenticatedLayout";
import { Link } from "@inertiajs/react";

function OrderLayout({children,order,crrOrderOption}){
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
                        <Link href={`/orders/${order.ordernum}/delivery`}>
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
                        <Link href={`/orders/${order.ordernum}/payment`}>
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