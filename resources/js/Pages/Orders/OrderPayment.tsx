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
import { Product as ProductModel } from "../../Models/Product";
import User from "../../Models/User";

/**
 * TODO:
 *
 * in foxpro:
 *
 * 1. when first payment (deposit) is submitted, is the order marked as approved?
 *
 * 2. after deposit is paid, the program that give info about payment info (getpercentdeposit)
 * does not return a value for credit card fee. FIXED.
 *
 * 3. is the deposit need always requiered? if not, can i use the "saveCR" program to approved orders?
 *
 * 4. when the remaining amount is being pay, the getpercentdeposit program returns as it depneeded value the
 * amount remaining after deposit but as a negative number.
 *
 * 5. looks like when a order was a aprove and then that order is deleted, when using the same order number,
 * the dollar amounts are very off.
 *
 * in intuit:
 *
 * 1. how to automate the process of refreshing access token?
 *
 */

interface OrderPaymentProps {
    auth: User;
    order: OrderModel;
    deliveryInfo: DeliveryInfoModel[];
    depositInfo?: {
        percdep: number; // % deposit
        percos: number; //
        depneeded: number; // deposit needed $
        totcod: number; // total
        ccchg: number; // credit card fee
    };
}

function OrderPayment({
    auth,
    order,
    deliveryInfo,
    depositInfo,
}: OrderPaymentProps) {
    console.log("==== OrderPayment ====");
    console.log("Order:", order);
    console.log("Delivery Info:", deliveryInfo);
    console.log("Deposit Info:", depositInfo);

    const [crrPaymentMethod, setCrrPaymentMethod] = useState<
        "credit card" | "bank account"
    >("credit card");
    const [isLoading, setIsLoading] = useState(false);
    const [bankValidationErrors, setBankErrors] = useState({});
    const [cardValidationErrors, setCardErrors] = useState({});

    const deliveryFee = useMemo(() => {
        const crrDeliveryType = deliveryInfo[0].dtype;
        return crrDeliveryType === "TO DEALER"
            ? 50
            : crrDeliveryType === "DAVIDICI FINAL MILE"
            ? 75
            : 0;
    }, []);

    const finalTotal = useMemo(() => {
        // const fee =
        //     crrPaymentMethod === "credit card"
        //         ? Math.round((order.total as number) * 0.03)
        //         : 0;

        // const fee =
        //     crrPaymentMethod === "credit card"
        //         ? Math.round(depositInfo?.depneeded! * 0.03)
        //         : 0;

        // const grandTotal = Number.parseFloat(order.total as string) + fee;

        // const fee = depositInfo?.ccchg;

        let subTotal = depositInfo?.depneeded!;

        const extraFee =
            crrPaymentMethod === "credit card" ? depositInfo?.ccchg! : 0;

        // if totcredit !== 0 and order.submitted !== null, means the deposit has been paid.
        if (Number.parseInt(order.totcredit as string) > 0 && order.submitted) {
            subTotal = depositInfo?.totcod!;
        }

        const grandTotal = subTotal + extraFee;

        return { fee: depositInfo?.ccchg, grandTotal, subTotal };
    }, [crrPaymentMethod]);

    const [isTransactionApproved, setIsTransactionApproved] = useState(
        () => finalTotal.grandTotal === 0
    ); // set true for first version

    const handleCardSubmit = async (e: FormEvent, state: CardInfoModel) => {
        e.preventDefault();

        try {
            setIsLoading(true);

            const getToken = await axios.post(
                "https://sandbox.api.intuit.com/quickbooks/v4/payments/tokens",
                { card: state },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const token = getToken.data.value;

            const response = await axios.post(
                `/orders/${order.ordernum}/products/payment`,
                {
                    info: {
                        currency: "USD",
                        amount: finalTotal.grandTotal,
                        context: {
                            mobile: false,
                            isEcommerce: true,
                        },
                        token: token,
                    },
                    foxproInfo: {
                        amountPaid: finalTotal.subTotal,
                    },
                }
            );

            console.log("-- token (Intuit) -- :", getToken);
            console.log("-- charges response (Intuit) -- :", response);

            if (response.data.status === 400) {
                const errors = response.data.intuitRes.errors;
                console.log("invalid information:", errors);
                setIsLoading(false);
                return;
            }

            if (response.data.status === 401) {
                console.log("token expired!!:", response);
                setIsLoading(false);
                return;
            }

            if (response.data.intuitRes.status === "CAPTURED") {
                setIsLoading(false);
                setIsTransactionApproved(true);
                toast.success("Transaction approved!!");
            }

            setIsLoading(false);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error.response?.data);
                if (error.response?.data.errors) {
                    const errors = error.response.data.errors;
                    setCardErrors(errors);
                }
            } else {
                console.error(error);
            }
            setIsLoading(false);
        }
    };

    const isValidBankInfo = (info: BankInfoModel): boolean => {
        let crrErrors = { routingNumber: "", phone: "" };
        if (info.bankAccount.routingNumber.length !== 9) {
            crrErrors.routingNumber = "routing number must be 9 digits long";
        }
        if (info.bankAccount.phone.length !== 10) {
            crrErrors.phone = "phone number must be 10 digits long";
        }

        if (crrErrors.phone || crrErrors.routingNumber) {
            setBankErrors(crrErrors);
            return false;
        } else {
            setBankErrors({ routingNumber: "", phone: "" });
            return true;
        }
    };

    const handleBankSubmit = async (e: FormEvent, state: BankInfoModel) => {
        e.preventDefault();
        const info = { ...state, amount: finalTotal.grandTotal };

        if (!isValidBankInfo(info)) return;

        try {
            setIsLoading(true);

            const { data } = await axios.post(
                `/orders/${order.ordernum}/products/payment-bank`,
                info
            );
            console.log("create charge", data);

            if (data.status === 400) {
                setIsLoading(false);
                const errors = data.intuitRes.errors;
                console.log(errors);
            }

            if (data.status === 401) {
                setIsLoading(false);
                console.error(
                    "there was an error on the server!! access token expired"
                );
            }

            if (data.intuitRes.status === "PENDING") {
                console.log("first status pending ran!!");
                const id = data.intuitRes.id;

                const { data: checkStatus } = await axios.post(
                    `/orders/${order.ordernum}/products/payment-bank/status`,
                    { id }
                );

                if (checkStatus.intuitRes.status === "SUCCEEDED") {
                    setIsTransactionApproved(true);
                    toast.success("Transaction approved!!");
                    console.log("SUCCEEDED", checkStatus);
                }

                if (checkStatus.intuitRes.status === "PENDING") {
                    setIsTransactionApproved(true);
                    toast.success("Transaction approved!!");
                    console.log("PENDING", checkStatus);
                }

                if (checkStatus.intuitRes.status === "DECLINED") {
                    toast.error("Transaction declined!!");
                    console.log("DECLINED", checkStatus);
                }
            }
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };

    return (
        <UserAuthenticatedLayout auth={auth} crrPage="orders">
            <OrderLayout order={order} crrOrderOption="payment">
                {isTransactionApproved && (
                    <div className="absolute bg-gray-200/50 backdrop-blur-sm mt-6 p-5">
                        <h1 className="">Payment submitted</h1>
                        {/* <h1 className="">Currently in development...</h1> */}
                    </div>
                )}
                {!isTransactionApproved && (
                    <section className="flex mt-6 p-5 bg-zinc-50 shadow-inner shadow-gray-200 rounded-md relative">
                        {/*place transaction approved here*/}
                        {isLoading && (
                            <div className="absolute bg-gray-200/50 backdrop-blur-sm w-[100%] h-[100%]">
                                <p>loading...</p>
                            </div>
                        )}
                        <section className="w-[18em] p-8 shadow-sm shadow-gray-900 rounded mr-2">
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

                                <div className="flex justify-between">
                                    <span className="">
                                        <h2>credit:</h2>
                                    </span>
                                    <span className="">
                                        <p>-${order.totcredit}</p>
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
                                        <h2>deposit:</h2>
                                    </span>
                                    <span className="">
                                        <p>${depositInfo?.depneeded}</p>
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
                                        <h2>Due Today:</h2>
                                    </span>
                                    <span className="">
                                        <p>${finalTotal.grandTotal}</p>
                                    </span>
                                </div>
                            </section>
                        </section>
                        <section className="grow p-8">
                            <div className="flex gap-4  pb-2 mb-2">
                                <p
                                    className={
                                        crrPaymentMethod === "credit card"
                                            ? "border-b border-davidiciGold px-5 py-1 shadow-sm shadow-davidiciGold transition-shadow hover:shadow-none cursor-pointer"
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
                                <CreditCardForm
                                    handleSubmit={handleCardSubmit}
                                    errors={cardValidationErrors}
                                />
                            )}
                            {crrPaymentMethod === "bank account" && (
                                <BankAccountForm
                                    handleSubmit={handleBankSubmit}
                                    errors={bankValidationErrors}
                                />
                            )}
                        </section>
                    </section>
                )}
            </OrderLayout>
            <ToastContainer />
        </UserAuthenticatedLayout>
    );
}

export default OrderPayment;
