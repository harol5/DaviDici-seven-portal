import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import Order from "../../Components/Order";
import FlashMessage from "../../Components/FlashMessage";
import { useState } from "react";

function Orders({ auth, orders, message = "" }) {

    const [userOrders, setUserOrders] = useState(orders);

    const handleSearhInput = (value) => {
        const filteredOrders = orders.filter((order) =>
            order.ordernum.includes(value.toLowerCase())
        );      
        setUserOrders(filteredOrders);
    }

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
                        onInput={(e) => handleSearhInput(e.target.value)}
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
            <FlashMessage message={message} />
        </UserAuthenticatedLayout>
    );
}


export default Orders;