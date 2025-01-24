import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import Order from "../../Components/Order";
import FlashMessage from "../../Components/FlashMessage";
import { useMemo, useState, useEffect } from "react";
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

function Orders({ auth, orders, message = "", commissionInfo, allOrders }: ordersProp) {
    const [userOrders, setUserOrders] = useState(orders);
    const [companyOrders, setCompanyOrders] = useState(allOrders);
    const [currentOrders, setCurrentOrders] = useState<CurrentOrderType>("own");

    const [searchInput, setSearchInput] = useState("");
    const [isShowingOnlyPendingDeliveryOrders, setIsShowingOnlyPendingDeliveryOrders] = useState(false);
    const [salesrep, setSalesrep] = useState("all");
    const salesrepsList = useMemo(() => {
        return allOrders.length > 0 ?
            Array.from(new Set(allOrders.map(order => order.slmn))) :
            [];
    }, [allOrders]);


    const filterOrders = (name: string, value?: string | boolean) => {
        console.log("filter orders called -------")
        console.log(name);
        console.log(value);

        let currentIsShowingOnlyPendingDeliveryOrders = isShowingOnlyPendingDeliveryOrders;
        if (name === "showOnlyPendingForDelivery") {
            currentIsShowingOnlyPendingDeliveryOrders = value as boolean;
            setIsShowingOnlyPendingDeliveryOrders(currentIsShowingOnlyPendingDeliveryOrders);
        }

        let currentSalesrep = salesrep;
        if (name === "salesrep") {
            currentSalesrep = value as string;
            setSalesrep(currentSalesrep);
        }

        let currentSearchInput = searchInput;
        if (name === "orderNumber") {
            currentSearchInput = value as string;
            setSearchInput(currentSearchInput);
        }

        const actualOrders = currentOrders === "own" ? orders : allOrders;
        const filteredOrders = actualOrders.filter((order: OrderModel) => {
            const hasPendingStatus =
                !currentIsShowingOnlyPendingDeliveryOrders || order.status !== "Delivered";

            const hasSalesrep = currentSalesrep === "all" || order.slmn === currentSalesrep;

            const hasSearchInput = currentSearchInput === "" || order.ordernum.includes(currentSearchInput.toLowerCase());

            return hasPendingStatus && hasSalesrep && hasSearchInput;
        });

        currentOrders === "own" ? setUserOrders(filteredOrders) : setCompanyOrders(filteredOrders);
    }

    useEffect(() => {
        filterOrders("ordersSwitcher");
    },[currentOrders]);

    const handleOrderSwitcher = (currentOrder: CurrentOrderType) => {
        setUserOrders(orders);
        setCompanyOrders(allOrders);
        setCurrentOrders(currentOrder);
        currentOrder === "own" && setSalesrep("all");
        /*setSearchInput("");*/
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

    console.log(orders)
    console.log(allOrders)
    console.log(auth);
    console.log(commissionInfo);

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
                    <div>
                        <label>Show orders only pending for delivery:</label>
                        <input
                            type={"checkbox"}
                            name={"showOnlyPendingForDelivery"}
                            checked={isShowingOnlyPendingDeliveryOrders}
                            onChange={(e) =>
                                filterOrders(e.target.name, e.target.checked)
                            }
                        />
                    </div>
                    <input
                        className="search-order-input rounded-xl"
                        type="search"
                        placeholder="Search Order..."
                        name="orderNumber"
                        value={searchInput}
                        onChange={(e) => filterOrders(e.target.name, e.target.value)}
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
                                {currentOrders === "company" && (
                                    <div>
                                        <label>Choose sales rep:</label>
                                        <select
                                            name={"salesrep"}
                                            value={salesrep}
                                            onChange={(e) =>
                                                filterOrders(e.target.name, e.target.value)
                                            }
                                        >
                                            <option value="all">All</option>
                                            {salesrepsList.map((salesrep, index) => (<option key={index} value={salesrep}>{salesrep}</option>))}
                                        </select>
                                    </div>
                                )}
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
