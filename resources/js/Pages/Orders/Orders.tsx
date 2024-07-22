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
                    <section className={classes.allGauges}>
                        <h1>Current Sales</h1>
                        <div className={classes.loyaltyProgramGaugeWrapper}>
                            <div className={classes.gaugeMainInfo}>
                                <h1>$3100</h1>
                                <p>To Target</p>
                            </div>
                            <h1 className={classes.gaugeGoalAmount}>$5000</h1>
                            <svg
                                width="430"
                                viewBox="0 0 644 644"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g id="Frame 11" clipPath="url(#clip0_545_280)">
                                    <g className={classes.gaugeFiller}>
                                        <mask
                                            id="path-1-inside-1_545_280"
                                            fill="white"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M0.000638514 322C0.000211249 322.214 2.81251e-05 322.428 2.81064e-05 322.642C1.25837e-05 500.201 143.94 644.142 321.5 644.142C499.06 644.142 643 500.201 643 322.642C643 322.428 643 322.214 642.999 322L626.315 322C626.315 322 626.315 322 626.315 322C626.315 470.853 505.647 591.521 356.794 591.521C207.942 591.521 87.2735 470.852 87.2735 322L0.000638514 322Z"
                                            />
                                        </mask>
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M0.000638514 322C0.000211249 322.214 2.81251e-05 322.428 2.81064e-05 322.642C1.25837e-05 500.201 143.94 644.142 321.5 644.142C499.06 644.142 643 500.201 643 322.642C643 322.428 643 322.214 642.999 322L626.315 322C626.315 322 626.315 322 626.315 322C626.315 470.853 505.647 591.521 356.794 591.521C207.942 591.521 87.2735 470.852 87.2735 322L0.000638514 322Z"
                                            fill="#D2AC69"
                                        />
                                        <path
                                            d="M0.000638514 322L0.000642448 321L-0.997366 321L-0.999359 321.998L0.000638514 322ZM642.999 322L643.999 321.998L643.997 321L642.999 321L642.999 322ZM626.315 322L626.315 321L625.315 321L625.315 322L626.315 322ZM87.2735 322L88.2735 322L88.2735 321L87.2735 321L87.2735 322ZM-0.999359 321.998C-0.999788 322.212 -0.999972 322.427 -0.999972 322.642L1.00003 322.642C1.00003 322.428 1.00021 322.215 1.00064 322.002L-0.999359 321.998ZM-0.999972 322.642C-0.999987 500.753 143.388 645.142 321.5 645.142L321.5 643.142C144.493 643.142 1.00001 499.649 1.00003 322.642L-0.999972 322.642ZM321.5 645.142C499.612 645.142 644 500.753 644 322.642L642 322.642C642 499.649 498.507 643.142 321.5 643.142L321.5 645.142ZM644 322.642C644 322.427 644 322.212 643.999 321.998L641.999 322.002C642 322.215 642 322.428 642 322.642L644 322.642ZM642.999 321L626.315 321L626.315 323L642.999 323L642.999 321ZM627.315 322C627.315 322 627.315 322 627.315 322C627.315 322 627.315 322 627.315 322L625.315 322C625.315 322 625.315 322 625.315 322C625.315 322 625.315 322 625.315 322L627.315 322ZM356.794 592.521C506.199 592.521 627.315 471.405 627.315 322L625.315 322C625.315 470.3 505.094 590.521 356.794 590.521L356.794 592.521ZM86.2735 322C86.2735 471.405 207.39 592.521 356.794 592.521L356.794 590.521C208.494 590.521 88.2735 470.3 88.2735 322L86.2735 322ZM87.2735 321L0.000642448 321L0.00063458 323L87.2735 323L87.2735 321Z"
                                            fill="#D1AA68"
                                            mask="url(#path-1-inside-1_545_280)"
                                        />
                                    </g>
                                    <g clipPath="url(#clip1_545_280)">
                                        <path
                                            id="Vector"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M641.717 321.359C641.717 144.429 498.288 1 321.359 1C144.429 1 1 144.429 1 321.359C1 321.572 1.00021 321.786 1.00063 322H0.000626547C0.000208913 321.786 0 321.572 0 321.359C0 143.877 143.877 0 321.359 0C498.84 0 642.717 143.877 642.717 321.359C642.717 321.572 642.717 321.786 642.716 322H641.716C641.717 321.786 641.717 321.572 641.717 321.359ZM555.482 321.817C555.383 173.114 434.805 52.5976 286.08 52.5976C137.304 52.5976 16.6948 173.196 16.6773 321.968V321H1.28287V322H16.6773H555.482H641.434V321H555.482V321.817Z"
                                            fill="white"
                                        />
                                        <g id="Mask group">
                                            <mask
                                                id="mask0_545_280"
                                                maskUnits="userSpaceOnUse"
                                                x="0"
                                                y="0"
                                                width="643"
                                                height="322"
                                            >
                                                <g id="Group">
                                                    <path
                                                        id="Vector_2"
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M641.717 321.359C641.717 144.429 498.288 1 321.359 1C144.429 1 1 144.429 1 321.359C1 321.572 1.00021 321.786 1.00063 322H0.000626547C0.000208913 321.786 0 321.572 0 321.359C0 143.877 143.877 0 321.359 0C498.84 0 642.717 143.877 642.717 321.359C642.717 321.572 642.717 321.786 642.716 322H641.716C641.717 321.786 641.717 321.572 641.717 321.359ZM555.482 321.817C555.383 173.114 434.805 52.5976 286.08 52.5976C137.304 52.5976 16.6948 173.196 16.6773 321.968V321H1.28287V322H16.6773H555.482H641.434V321H555.482V321.817Z"
                                                        fill="white"
                                                    />
                                                </g>
                                            </mask>
                                            <g mask="url(#mask0_545_280)">
                                                <path
                                                    id="Vector_3"
                                                    d="M1.00063 322V323H2.00259L2.00063 321.998L1.00063 322ZM0.000626564 322L-0.999372 322.002L-0.997422 323H0.000626564V322ZM642.716 322V323H643.714L643.716 322.002L642.716 322ZM641.716 322L640.716 321.998L640.714 323H641.716V322ZM555.482 321.817H554.482H556.482H555.482ZM16.6773 321.968H15.6773H17.6773H16.6773ZM16.6773 321H17.6773V320H16.6773V321ZM1.28287 321V320H0.282869V321H1.28287ZM1.28287 322H0.282869V323H1.28287V322ZM641.434 322V323H642.434V322H641.434ZM641.434 321H642.434V320H641.434V321ZM555.482 321V320H554.482V321H555.482ZM321.359 2C497.735 2 640.717 144.982 640.717 321.359H642.717C642.717 143.877 498.84 0 321.359 0V2ZM2 321.359C2 144.982 144.982 2 321.359 2V0C143.877 0 0 143.877 0 321.359H2ZM2.00063 321.998C2.00021 321.785 2 321.572 2 321.359H0C0 321.573 0.000210198 321.788 0.000630379 322.002L2.00063 321.998ZM0.000626564 323H1.00063V321H0.000626564V323ZM-1 321.359C-1 321.573 -0.99979 321.788 -0.999372 322.002L1.00062 321.998C1.00021 321.785 1 321.572 1 321.359H-1ZM321.359 -1C143.325 -1 -1 143.325 -1 321.359H1C1 144.429 144.429 1 321.359 1V-1ZM643.717 321.359C643.717 143.325 499.392 -1 321.359 -1V1C498.288 1 641.717 144.429 641.717 321.359H643.717ZM643.716 322.002C643.717 321.787 643.717 321.573 643.717 321.359H641.717C641.717 321.572 641.717 321.785 641.716 321.998L643.716 322.002ZM641.716 323H642.716V321H641.716V323ZM640.717 321.359C640.717 321.572 640.717 321.785 640.716 321.998L642.716 322.002C642.717 321.787 642.717 321.573 642.717 321.359H640.717ZM286.08 53.5976C434.253 53.5976 554.383 173.667 554.482 321.817H556.482C556.383 172.562 435.358 51.5976 286.08 51.5976V53.5976ZM17.6773 321.968C17.6947 173.748 137.856 53.5976 286.08 53.5976V51.5976C136.751 51.5976 15.6949 172.644 15.6773 321.968H17.6773ZM15.6773 321V321.968H17.6773V321H15.6773ZM1.28287 322H16.6773V320H1.28287V322ZM2.28287 322V321H0.282869V322H2.28287ZM16.6773 321H1.28287V323H16.6773V321ZM555.482 321H16.6773V323H555.482V321ZM641.434 321H555.482V323H641.434V321ZM640.434 321V322H642.434V321H640.434ZM555.482 322H641.434V320H555.482V322ZM556.482 321.817V321H554.482V321.817H556.482Z"
                                                    fill="#D2AC69"
                                                />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                                <defs>
                                    <clipPath id="clip0_545_280">
                                        <rect
                                            width="644"
                                            height="644"
                                            fill="white"
                                        />
                                    </clipPath>
                                    <clipPath id="clip1_545_280">
                                        <rect
                                            width="643"
                                            height="322"
                                            fill="white"
                                        />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </section>
                    {userOrders.length === 0 ? (
                        <p id="empty-orders-message">
                            orders not found!. To report any issues, please
                            contact support
                        </p>
                    ) : (
                        <div className={classes.ordersMainContainer}>
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
