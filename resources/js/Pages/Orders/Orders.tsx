import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import Order from "../../Components/Order";
import FlashMessage from "../../Components/FlashMessage";
import { ChangeEvent, useMemo, useState } from "react";
import User from "../../Models/User";
import type { Order as OrderModel } from "../../Models/Order";
import classes from "../../../css/orders.module.css";

interface ordersProp {
    auth: User;
    orders: OrderModel[];
    message: string;
    commissionInfo: any;
}

function Orders({ auth, orders, message = "", commissionInfo }: ordersProp) {
    console.log(commissionInfo);
    const [userOrders, setUserOrders] = useState(orders);

    const handleSearhInput = (e: ChangeEvent<HTMLInputElement>) => {
        const filteredOrders = orders.filter((order: OrderModel) => {
            const target = e.target!;
            return order.ordernum.includes(target.value.toLowerCase());
        });
        setUserOrders(filteredOrders);
    };

    const dayTime = useMemo(() => {
        const date = new Date();
        const hours = date.getHours();
        const ampm =
            hours >= 12 && hours < 18
                ? "pm"
                : hours >= 18 && hours <= 23
                ? "night"
                : "am";
        return ampm;
    }, []);

    return (
        <UserAuthenticatedLayout auth={auth} crrPage="orders">
            <div className="main-content-wrapper">
                <div className="gretting-search-wrapper">
                    {dayTime === "am" && (
                        <h1 className="greeting">
                            Good Morning {auth?.user.first_name}
                        </h1>
                    )}
                    {dayTime === "pm" && (
                        <h1 className="greeting">
                            Good Afternoon {auth?.user.first_name}
                        </h1>
                    )}
                    {dayTime === "night" && (
                        <h1 className="greeting">
                            Good Evening {auth?.user.first_name}
                        </h1>
                    )}

                    <input
                        className="search-order-input rounded-xl"
                        type="search"
                        placeholder="Search Order..."
                        onChange={handleSearhInput}
                    />
                </div>

                <section className={classes.loyaltyProgramAndOrderWrapper}>
                    <div className="loyaltyProgramGaugeWrapper">
                        <svg
                            width="254"
                            height="128"
                            viewBox="0 0 254 128"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <mask id="path-1-inside-1_532_229" fill="white">
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M253.999 128C254 127.833 254 127.667 254 127.5C254 57.0837 197.14 0 127 0C56.8598 0 0 57.0837 0 127.5C0 127.667 0.000318821 127.833 0.000955885 128H5.0179C6.07961 68.7238 54.2421 21 113.5 21C172.758 21 220.92 68.7238 221.982 128H253.999Z"
                                />
                            </mask>
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M253.999 128C254 127.833 254 127.667 254 127.5C254 57.0837 197.14 0 127 0C56.8598 0 0 57.0837 0 127.5C0 127.667 0.000318821 127.833 0.000955885 128H5.0179C6.07961 68.7238 54.2421 21 113.5 21C172.758 21 220.92 68.7238 221.982 128H253.999Z"
                                fill="#D1AA68"
                            />
                            <path
                                d="M253.999 128V129H254.995L254.999 128.004L253.999 128ZM0.000955885 128L-0.999037 128.004L-0.995227 129H0.000955885V128ZM5.0179 128V129H6.00015L6.01774 128.018L5.0179 128ZM221.982 128L220.982 128.018L221 129H221.982V128ZM254.999 128.004C255 127.836 255 127.668 255 127.5H253C253 127.665 253 127.831 252.999 127.996L254.999 128.004ZM255 127.5C255 56.5351 197.696 -1 127 -1V1C196.584 1 253 57.6323 253 127.5H255ZM127 -1C56.3039 -1 -1 56.5351 -1 127.5H1C1 57.6323 57.4158 1 127 1V-1ZM-1 127.5C-1 127.668 -0.999679 127.836 -0.999037 128.004L1.00095 127.996C1.00032 127.831 1 127.665 1 127.5H-1ZM0.000955885 129H5.0179V127H0.000955885V129ZM113.5 20C53.6916 20 5.08945 68.1659 4.01806 127.982L6.01774 128.018C7.06978 69.2817 54.7926 22 113.5 22V20ZM222.982 127.982C221.911 68.1659 173.308 20 113.5 20V22C172.207 22 219.93 69.2817 220.982 128.018L222.982 127.982ZM221.982 129H253.999V127H221.982V129Z"
                                fill="#D1AA68"
                                mask="url(#path-1-inside-1_532_229)"
                            />
                        </svg>
                    </div>
                    {userOrders.length === 0 ? (
                        <p id="empty-orders-message">
                            orders not found!. To report any issues, please
                            contact support
                        </p>
                    ) : (
                        <div>
                            <p
                                id="empty-orders-message"
                                className="search-result"
                            >
                                orders not found!
                            </p>
                            <div className="orders-wrapper">
                                {userOrders.map((order) => (
                                    <Order key={order.ordernum} order={order} />
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </div>
            {message && <FlashMessage message={message} />}
        </UserAuthenticatedLayout>
    );
}

export default Orders;
