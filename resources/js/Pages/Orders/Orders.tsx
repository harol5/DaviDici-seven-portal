import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import Order from "../../Components/Order";
import FlashMessage from "../../Components/FlashMessage";
import { ChangeEvent, useMemo, useState } from "react";
import User from "../../Models/User";
import type { Order as OrderModel } from "../../Models/Order";
import type { monthCommissionInfo } from "../../Models/LoyaltyProgram";
import classes from "../../../css/orders.module.css";
import LoyaltyProgramGauges from "../../Components/LoyaltyProgramGauges";

interface ordersProp {
    auth: User;
    orders: OrderModel[];
    message: string;
    commissionInfo: monthCommissionInfo[];
    allOrders: OrderModel[];
}

type CurrentOrderType = "own" | "company";

/*
* TODO:
*  when swiyching between orders, reset search input and filtered orders.
*
* */

function Orders({ auth, orders, message = "", commissionInfo, allOrders }: ordersProp) {
    const [userOrders, setUserOrders] = useState(orders);
    const [companyOrders, setCompanyOrders] = useState(allOrders);
    const [currentOrders, setCurrentOrders] = useState<CurrentOrderType>("own");
    const [searchInput, setSearchInput] = useState("");

    const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const actualOrders = currentOrders === "own" ? orders : allOrders;
        const filteredOrders = actualOrders.filter((order: OrderModel) => {
            return order.ordernum.includes(value.toLowerCase());
        });
        setSearchInput(value);
        currentOrders === "own" ? setUserOrders(filteredOrders) : setCompanyOrders(filteredOrders);
    };

    const handleOrderSwitcher = (currentOrder: CurrentOrderType) => {
        setUserOrders(orders);
        setCompanyOrders(allOrders);
        setCurrentOrders(currentOrder);
        setSearchInput("");
    }

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
                        value={searchInput}
                        onChange={handleSearchInput}
                    />
                </div>
                <section className={classes.loyaltyProgramAndOrderWrapper}>
                    <LoyaltyProgramGauges commissionInfo={commissionInfo}/>
                    <div className={classes.ordersMainContainer}>
                        <p
                            id="empty-orders-message"
                            className="search-result"
                        >
                            orders not found!
                        </p>
                        {allOrders.length > 0 && (
                            <section className={classes.orderSwitcher}>
                                <button
                                    onClick={() => handleOrderSwitcher("own")}
                                    className={currentOrders === "own" ? `${classes.buttonSwitcher} ${classes.active}` : classes.buttonSwitcher}
                                >
                                    My Orders
                                </button>
                                <button
                                    onClick={() => handleOrderSwitcher("company")}
                                    className={currentOrders === "company" ? `${classes.buttonSwitcher} ${classes.active}` : classes.buttonSwitcher}
                                >
                                    Company Orders
                                </button>
                            </section>
                        )}
                        {userOrders.length === 0 || allOrders.length > 0 && companyOrders.length === 0 ? (
                            <p id="empty-orders-message">
                                orders not found!. To report any issues, please
                                contact support
                            </p>
                        ): null}
                        {currentOrders === "own" && (
                            <div className="orders-wrapper">
                                {userOrders.map((order) => (
                                    <Order key={order.ordernum} order={order}/>
                                ))}
                            </div>
                        )}
                        {currentOrders === "company" && (
                            <div className="orders-wrapper">
                                {companyOrders.map((order) => (
                                    <Order key={order.ordernum} order={order}/>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
            {message && <FlashMessage message={message}/>}
        </UserAuthenticatedLayout>
    );
}

export default Orders;
