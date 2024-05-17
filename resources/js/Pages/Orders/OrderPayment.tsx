import { FormEvent, useMemo, useState } from "react";
import OrderLayout from "../../Layouts/OrderLayout";
import CreditCardForm from "../../Components/CreditCardForm";
import type { CardInfo as CardInfoModel } from "../../Models/CardInfo";
import type { BankInfo as BankInfoModel } from "../../Models/BankInfo";
import type { DeliveryFoxpro as DeliveryInfoModel } from "../../Models/Delivery";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import type { Order as OrderModel } from "../../Models/Order";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import BankAccountForm from "../../Components/BankAccountForm";

interface OrderPaymentProps {
    order: OrderModel;
    deliveryInfo: DeliveryInfoModel[];
}

function OrderPayment({ order, deliveryInfo }: OrderPaymentProps) {
    const [crrPaymentMethod, setCrrPaymentMethod] = useState<
        "credit card" | "bank account"
    >("credit card");

    const deliveryFee = useMemo(() => {
        const crrDeliveryType = deliveryInfo[0].dtype;
        return crrDeliveryType === "TO DEALER"
            ? 50
            : crrDeliveryType === "DAVIDICI FINAL MILE"
            ? 75
            : 0;
    }, []);

    const finalTotal = useMemo(() => {
        const fee =
            crrPaymentMethod === "credit card"
                ? Math.round((order.total as number) * 0.03)
                : 0;

        const grandTotal = Number.parseFloat(order.total as string) + fee;

        return { fee, grandTotal };
    }, [crrPaymentMethod]);

    const handleCardSubmit = async (e: FormEvent, state: CardInfoModel) => {
        e.preventDefault();
        console.log("onSubmit called!!", state);
        try {
            const res = await axios.post(
                "https://sandbox.api.intuit.com/quickbooks/v4/payments/tokens",
                { card: state },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const token = res.data.value;
            console.log("token response:", token);

            const res2 = await axios.post(
                `/orders/${order.ordernum}/products/payment`,
                {
                    currency: "USD",
                    amount: order.total,
                    context: {
                        mobile: false,
                        isEcommerce: true,
                    },
                    token: token,
                }
            );

            console.log("charges response (Intuit):", res2);
            if (res2.data.status === 201)
                toast.success("Transaction approved!!");
        } catch (err) {
            console.log(err);
        }
    };

    const handleBankSubmit = async (e: FormEvent, state: BankInfoModel) => {
        e.preventDefault();
        console.log(state);
    };

    return (
        <UserAuthenticatedLayout crrPage="orders">
            <OrderLayout order={order} crrOrderOption="payment">
                <section className="flex mt-6 bg-white py-10 px-16 rounded-md">
                    <section className="w-[18em] pr-10 border-r border-r-black">
                        <h1 className="text-center font-medium text-lg text-davidiciGold">
                            Charges Breakdown
                        </h1>
                        <section className="flex flex-col gap-4 mt-4">
                            <div className="flex justify-between">
                                <span className="">
                                    <h2>products:</h2>
                                </span>
                                <span className="">
                                    <p>
                                        $
                                        {(order.subtotal as number) -
                                            deliveryFee}
                                    </p>
                                </span>
                            </div>

                            <div className="flex justify-between border-b pb-2 border-b-black">
                                <span className="">
                                    <h2>delivery fee:</h2>
                                </span>
                                <span className="">
                                    <p>+${deliveryFee}</p>
                                </span>
                            </div>

                            <div className="flex justify-between ">
                                <span className="">
                                    <h2>sub-total:</h2>
                                </span>
                                <span className="">
                                    <p>${order.subtotal}</p>
                                </span>
                            </div>

                            <div
                                className={
                                    crrPaymentMethod === "bank account"
                                        ? "border-b pb-1 border-b-black flex justify-between"
                                        : "flex justify-between"
                                }
                            >
                                <span className="">
                                    <h2>credit:</h2>
                                </span>
                                <span className="">
                                    <p>-${order.totcredit}</p>
                                </span>
                            </div>

                            {crrPaymentMethod === "credit card" && (
                                <div className="border-b pb-2 border-b-black flex justify-between">
                                    <span className="">
                                        <h2>3% credit card fee:</h2>
                                    </span>
                                    <span className="">
                                        <p>
                                            +$
                                            {finalTotal.fee}
                                        </p>
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <span className="">
                                    <h2>grand total:</h2>
                                </span>
                                <span className="">
                                    <p>${finalTotal.grandTotal}</p>
                                </span>
                            </div>
                        </section>
                    </section>
                    <section className="grow pl-10">
                        <div className="flex gap-4  pb-2 mb-2">
                            <p
                                className={
                                    crrPaymentMethod === "credit card"
                                        ? "border-b border-davidiciGold px-5 py-1 cursor-pointer"
                                        : "px-5 py-1 cursor-pointer"
                                }
                                onClick={() =>
                                    setCrrPaymentMethod("credit card")
                                }
                            >
                                Credit
                            </p>
                            <p
                                className={
                                    crrPaymentMethod === "bank account"
                                        ? "border-b border-davidiciGold px-5 py-1 cursor-pointer"
                                        : "px-5 py-1 cursor-pointer"
                                }
                                onClick={() =>
                                    setCrrPaymentMethod("bank account")
                                }
                            >
                                Bank account
                            </p>
                        </div>
                        {crrPaymentMethod === "credit card" && (
                            <CreditCardForm handleSubmit={handleCardSubmit} />
                        )}
                        {crrPaymentMethod === "bank account" && (
                            <BankAccountForm handleSubmit={handleBankSubmit} />
                        )}
                    </section>
                </section>
            </OrderLayout>
            <ToastContainer />
        </UserAuthenticatedLayout>
    );
}

export default OrderPayment;
