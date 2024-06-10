import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import Order from "../../Components/Order";
import FlashMessage from "../../Components/FlashMessage";
import { ChangeEvent, useMemo, useState } from "react";
import User from "../../Models/User";
import type { Order as OrderModel } from "../../Models/Order";

interface ordersProp {
    auth: User;
    orders: OrderModel[];
    message: string;
}

function Orders({ auth, orders, message = "" }: ordersProp) {
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
                        className="search-order-input"
                        type="search"
                        placeholder="Search Order..."
                        onChange={handleSearhInput}
                    />
                </div>

                {userOrders.length === 0 ? (
                    <p id="empty-orders-message">
                        orders not found!. To report any issues, please contact
                        support
                    </p>
                ) : (
                    <div>
                        <p id="empty-orders-message" className="search-result">
                            orders not found!
                        </p>
                        <div className="orders-wrapper">
                            {userOrders.map((order) => (
                                <Order key={order.ordernum} order={order} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {message && <FlashMessage message={message} />}
        </UserAuthenticatedLayout>
    );
}

export default Orders;
