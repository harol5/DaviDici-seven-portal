import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import Order from "../../Components/Order";

function Orders({auth,orders}){
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
                    />
                </div>

                {orders.length === 0 ? (
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
                            {orders.map((order) => (
                                <Order key={order.ordernum} order={order} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </UserAuthenticatedLayout>
    );
}

// Orders.layout = page => <UserAuthenticatedLayout children={page} />

export default Orders;