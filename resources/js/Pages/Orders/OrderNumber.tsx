import { ChangeEvent, useState } from "react";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import type { Order as OrderModel } from "../../Models/Order";
import { router } from "@inertiajs/react";
import User from "../../Models/User";
import axios from "axios";

interface OrderNumberProps {
    auth: User;
    nextOrderNumber: string;
    products: { SKU: string; isShoppingCart: string };
    orders: OrderModel[];
    message: string;
}

function OrderNumber({
    auth,
    nextOrderNumber,
    products,
    orders,
    message,
}: OrderNumberProps) {
    const [orderNum, setOrderNum] = useState(() => nextOrderNumber.slice(3));
    const [error, setError] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const companyIdentifier = nextOrderNumber.slice(0, 3);

    const handleOrderNum = (e: ChangeEvent<HTMLInputElement>) => {
        if (error) setError("");
        setOrderNum(e.currentTarget.value);
    };

    const handleCreateOrder = async () => {
        if (orderNum.length === 0) {
            setError("you must provide a order number");
            return;
        }

        // copy current orderNum so we're able to append 0s at the beggining if needed.
        let crrOrderNum = orderNum;
        while (crrOrderNum.length < 6) {
            crrOrderNum = "0" + crrOrderNum;
        }

        const newOrderNum = companyIdentifier + crrOrderNum;

        // check if new order number is not taken.
        for (const order of orders) {
            if (newOrderNum === order.ordernum) {
                setError("order number already taken");
                return;
            }
        }

        router.post(
            "/orders/create",
            {
                newOrderNum,
                skus: products.SKU.replaceAll("--", "**"),
            },
            {
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
            }
        );
    };

    return (
        <UserAuthenticatedLayout auth={auth} crrPage="orders">
            {message !== "error" && (
                <section className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-7 bg-white border border-davidiciGold text-center">
                    {isLoading && <p>creating your order...</p>}
                    {!isLoading && (
                        <div>
                            <h1 className="font-semibold">
                                Order number: {nextOrderNumber} was
                                automatically generated. You can change this
                                number but keep in mind:
                            </h1>
                            <ul className="my-2">
                                <li>
                                    1 - order number cannot be longer than 6
                                    digits.
                                </li>
                                <li>
                                    2 - make sure you dont use a number
                                    previously assign to other orders.
                                </li>
                            </ul>
                            {error && <p className="text-red-500">{error}</p>}
                            <div className="my-4">
                                <span>{companyIdentifier}</span>
                                <input
                                    className="border border-black mx-1 px-1 w-24"
                                    type="number"
                                    name="orderNum"
                                    value={orderNum}
                                    min={1}
                                    max={999999}
                                    maxLength={6}
                                    onChange={handleOrderNum}
                                />
                            </div>
                            <button
                                className="bg-davidiciGold p-2 rounded text-white"
                                onClick={handleCreateOrder}
                            >
                                confirm order number
                            </button>
                        </div>
                    )}
                </section>
            )}
            {message === "error" && (
                <h1 className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-7 bg-white border border-davidiciGold text-center">
                    Something went wrong, please contact support
                </h1>
            )}
        </UserAuthenticatedLayout>
    );
}

export default OrderNumber;
