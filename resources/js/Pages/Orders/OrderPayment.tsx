import { FormEvent, useState } from "react";
import OrderLayout from "../../Layouts/OrderLayout";
import CreditCardForm from "../../Components/CreditCardForm";
import type { CardInfo as CardInfoModel } from "../../Models/CardInfo";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import type { Order as OrderModel } from "../../Models/Order";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import BankAccountForm from "../../Components/BankAccountForm";

interface OrderPaymentProps {
    order: OrderModel;
}

function OrderPayment({ order }: OrderPaymentProps) {
    const [crrPaymentMethod, setCrrPaymentMethod] = useState<
        "credit card" | "bank account"
    >("credit card");

    const handleSubmit = async (e: FormEvent, state: CardInfoModel) => {
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

    return (
        <UserAuthenticatedLayout crrPage="orders">
            <OrderLayout order={order} crrOrderOption="payment">
                <section className="flex mt-3">
                    <section className="basis-[40%]">
                        <h1>charges breakdown:</h1>
                    </section>
                    <section className="basis-[60%]">
                        <div className="flex gap-4  pb-2 mb-2">
                            <p
                                className={
                                    crrPaymentMethod === "credit card"
                                        ? "border-b border-davidiciGold px-3 cursor-pointer"
                                        : "px-3 cursor-pointer"
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
                                        ? "border-b border-davidiciGold px-3 cursor-pointer"
                                        : "px-3 cursor-pointer"
                                }
                                onClick={() =>
                                    setCrrPaymentMethod("bank account")
                                }
                            >
                                Bank account
                            </p>
                        </div>
                        {crrPaymentMethod === "credit card" && (
                            <CreditCardForm handleSubmit={handleSubmit} />
                        )}
                        {crrPaymentMethod === "bank account" && (
                            <BankAccountForm handleSubmit={handleSubmit} />
                        )}
                    </section>
                </section>
            </OrderLayout>
            <ToastContainer />
        </UserAuthenticatedLayout>
    );
}

export default OrderPayment;
