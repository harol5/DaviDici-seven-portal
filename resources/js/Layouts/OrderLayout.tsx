import { Link } from "@inertiajs/react";
import { ReactNode, useEffect } from "react";
import type { Order as OrderModel, OrderRecord } from "../Models/Order";

interface OrderLayoutProps {
    children?: ReactNode;
    order: OrderModel;
    crrOrderOption: string;
}

function OrderLayout({ children, order, crrOrderOption }: OrderLayoutProps) {
    // converts Obj to Query String;
    const serialize = (obj: any) => {
        let str = [];
        for (let p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(
                    encodeURIComponent(p) + "=" + encodeURIComponent(obj[p])
                );
            }
        return str.join("&");
    };

    useEffect(() => {
        //this changes the query string on reload to make sure it have updated data.
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            console.log("before reload");
            console.log(serialize(order));
            location.replace(
                `${location.origin}/orders/${
                    order.ordernum
                }/${crrOrderOption}?${serialize(order)}`
            );
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            console.log("removing event reload");
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [order]);

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
