import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import Order from "../../Components/Order";
import FlashMessage from "../../Components/FlashMessage";
import { ChangeEvent, useState } from "react";
import User from "../../Models/User";

interface ordersProp {
    auth: User;
    orders: any;
    message: string;
}

function Orders({ auth, orders, message = "" }: ordersProp) {
    console.log("auth:", auth);
    console.log("orders:", orders);
    console.log("message:", message);
    const [userOrders, setUserOrders] = useState(orders);

    const handleSearhInput = (e: ChangeEvent<HTMLInputElement>) => {
        const filteredOrders = orders.filter((order: any) => {
            const target = e.target!;
            console.log("order:", order);
            order.ordernum.includes(target.value.toLowerCase());
        });
        setUserOrders(filteredOrders);
    };

    return (
        <UserAuthenticatedLayout crrPage="orders">
            <div className="main-content-wrapper">
                <div className="gretting-search-wrapper">
                    <h1 className="greeting">
                        Good Afternoon {auth?.user.name}
                    </h1>
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
                            {userOrders.map((order: any) => (
                                <Order key={order.ordernum} order={order} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <FlashMessage message={message} />
        </UserAuthenticatedLayout>
    );
}

export default Orders;
