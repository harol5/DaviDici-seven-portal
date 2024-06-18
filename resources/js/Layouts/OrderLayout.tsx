import { Link } from "@inertiajs/react";
import { ReactNode, useEffect, useState } from "react";
import type { Order as OrderModel, OrderRecord } from "../Models/Order";

interface OrderLayoutProps {
    children?: ReactNode;
    order: OrderModel;
    crrOrderOption: string;
}

function OrderLayout({ children, order, crrOrderOption }: OrderLayoutProps) {
    // HELPER FUNC --> converts Obj to Query String;
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

    const [isOrderOptionsActive, setIsOrderOptionsActive] = useState(false);

    //this changes the query string on reload to make sure it have updated data.
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            // event.preventDefault();
            location.replace(
                `${location.origin}/orders/${
                    order.ordernum
                }/${crrOrderOption}?${serialize(order)}`
            );
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [order]);

    const orderFormatted: OrderRecord = {
        ...order,
    };

    return (
        <div className="main-content-wrapper -order text-[0.97em]">
            <div
                className={
                    isOrderOptionsActive
                        ? "order-options-menu-wrapper active-hamburger"
                        : "order-options-menu-wrapper"
                }
            >
                <div>
                    {isOrderOptionsActive && (
                        <div className="header-mobile-menu">
                            <img
                                className="nav-logo"
                                src="https://portal.davidici.com/images/davidici-logo-nav-cropped.png"
                            />
                            <span
                                onClick={() =>
                                    setIsOrderOptionsActive(
                                        !isOrderOptionsActive
                                    )
                                }
                            >
                                X
                            </span>
                        </div>
                    )}
                    <ul>
                        <li
                            className={
                                crrOrderOption === "overview"
                                    ? "active-order-option options"
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
            </div>
            <div className="order-main-content-wrapper">
                <div className="order-header-wrapper">
                    <div className="hamburger-order-number-wrapper">
                        <div
                            className="hamburger"
                            onClick={() =>
                                setIsOrderOptionsActive(!isOrderOptionsActive)
                            }
                        >
                            <div className="burger"></div>
                            <div className="burger"></div>
                            <div className="burger"></div>
                        </div>
                        <div className="order-number-wrapper">
                            <h1>Order Number:</h1>
                            <span>{order.ordernum}</span>
                        </div>
                    </div>
                    <section className="charges-wrapper">
                        <div className="charges">
                            <h2>sub-total:</h2>
                            <p>${order.subtotal}</p>
                        </div>
                        <div className="charges">
                            <h2>credit:</h2>
                            <p>${order.totcredit}</p>
                        </div>
                        <div className="charges">
                            <h2>Total:</h2>
                            <p className="">${order.total}</p>
                        </div>
                    </section>
                    <div className="order-buttons-wrapper">
                        <button className="rounded shadow-sm  px-4 py-1 transition-shadow hover:shadow-gray-500 border border-davidiciGold">
                            print order
                        </button>
                        <button className="rounded shadow-sm  px-4 py-1 transition-shadow hover:shadow-gray-500 border border-davidiciGold">
                            approve order
                        </button>
                    </div>
                </div>
                <div className="order-body-wrapper">{children}</div>
            </div>
        </div>
    );
}

export default OrderLayout;
