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
import { ErrorIntuit, intuitMaskTokenUrl } from "../../Models/Intuit";
import User from "../../Models/User";
import { getFormattedDate } from "../../utils/helperFunc";
import LoadingSpinner from "../../Components/LoadingSpinner";

interface OrderPaymentProps {
    auth: User;
    order: OrderModel;
    deliveryInfo: DeliveryInfoModel[];
    depositInfo: {
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
    const [crrPaymentMethod, setCrrPaymentMethod] = useState<
        "credit card" | "bank account"
    >("credit card");

    const [bankValidationErrors, setBankErrors] = useState<
        ErrorIntuit[] | null
    >(null);

    const [cardValidationErrors, setCardErrors] = useState<
        ErrorIntuit[] | null
    >(null);

    const [isLoading, setIsLoading] = useState(false);

    const [isInternalError, setIsInternalError] = useState(false);

    const isDeliveryInfo = useMemo(() => {
        return Boolean(deliveryInfo[0].dtype);
    }, []);

    const finalTotal = useMemo(() => {
        // const isExemptOfDeposit =
        //     depositInfo?.percdep === 0 &&
        //     Number.parseInt(order.totcredit as string) === 0;

        const crrDeliveryType = deliveryInfo[0].dtype;
        const deliveryFee =
            crrDeliveryType === "TO DEALER"
                ? 50
                : crrDeliveryType === "DAVIDICI FINAL MILE"
                ? 75
                : 0;

        const totalCredit = Number.parseInt(order.totcredit as string);

        const isExemptOfDeposit = depositInfo.percdep === 0 && !order.submitted;

        const isDepositPaid = depositInfo.percdep > 0 && totalCredit > 0;

        let subTotal = depositInfo.depneeded;

        const extraFee =
            crrPaymentMethod === "credit card" ? depositInfo?.ccchg! : 0;

        // if totcredit !== 0 and order.submitted !== null, means the deposit has been paid.
        if (
            depositInfo.depneeded === 0 ||
            (totalCredit > 0 && order.submitted)
        ) {
            subTotal = depositInfo.totcod;
        }

        const grandTotal = Math.round((subTotal + extraFee) * 100) / 100;

        return {
            fee: depositInfo.ccchg,
            grandTotal,
            subTotal,
            isExemptOfDeposit,
            isDepositPaid,
            deliveryFee,
        };
    }, [crrPaymentMethod]);

    const [isTransactionApproved, setIsTransactionApproved] = useState(
        () => finalTotal.grandTotal <= 0
    );

    const handleCardSubmit = async (e: FormEvent, state: CardInfoModel) => {
        e.preventDefault();

        try {
            setIsLoading(true);

            const getToken = await axios.post(
                `${intuitMaskTokenUrl}/quickbooks/v4/payments/tokens`,
                { card: state },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const token = getToken.data.value;

            const formattedDate = getFormattedDate();

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
                        date: formattedDate,
                        nameOnCard: state.name,
                        cc: state.number,
                        expDate: `${state.expMonth}/${state.expYear.slice(2)}`,
                        cvc: state.cvc,
                    },
                }
            );

            if (response.data.status === 400) {
                const errors = response.data.intuitRes.errors;
                setIsLoading(false);
                setCardErrors(errors);
                return;
            }

            if (response.data.status === 401) {
                setIsLoading(false);
                setIsInternalError(true);
                return;
            }

            if (response.data.status === 500) {
                const errors = response.data.intuitRes.errors;
                setCardErrors(errors);
                setIsLoading(false);
                return;
            }

            if (response.data.status === 501) {
                setIsLoading(false);
                setIsInternalError(true);
                toast.error("Something went wrong. please contact support");
                return;
            }

            if (response.data.intuitRes.status === "CAPTURED") {
                setIsTransactionApproved(true);
                toast.success("Transaction approved!!");
            }

            if (response.data.intuitRes.status === "DECLINED") {
                toast.error("Transaction declined!!");
            }

            setIsLoading(false);
            setCardErrors(null);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data.errors) {
                const errors: ErrorIntuit[] = error.response.data.errors;
                setCardErrors(errors);
            } else {
                setIsInternalError(true);
            }
            setIsLoading(false);
        }
    };

    const handleBankSubmit = async (e: FormEvent, state: BankInfoModel) => {
        e.preventDefault();

        const formattedDate = getFormattedDate();

        const info = {
            intuitInfo: {
                ...state,
                amount: finalTotal.grandTotal.toFixed(2),
            },
            foxproInfo: {
                amountPaid: finalTotal.subTotal,
                date: formattedDate,
                name: state.bankAccount.name,
                checkNumber: 123456789,
                routingNumber: state.bankAccount.routingNumber,
                accountNumber: state.bankAccount.accountNumber,
            },
        };

        try {
            setIsLoading(true);

            const { data } = await axios.post(
                `/orders/${order.ordernum}/products/payment-bank`,
                info
            );

            if (data.status === 400) {
                setIsLoading(false);
                const errors = data.intuitRes.errors;
                setBankErrors(errors);
                return;
            }

            if (data.status === 401 || data.status === 501) {
                setIsLoading(false);
                setBankErrors(null);
                setIsInternalError(true);
                toast.error("Something went wrong, please contact support.");
                return;
            }

            if (data.intuitRes.status === "DECLINED") {
                toast.error("Transaction declined!!");
            }

            if (
                data.intuitRes.status === "PENDING" ||
                data.intuitRes.status === "SUCCEEDED"
            ) {
                const id = data.intuitRes.id;

                const { data: checkStatus } = await axios.post(
                    `/orders/${order.ordernum}/products/payment-bank/status`,
                    { id }
                );

                if (checkStatus.status >= 400) {
                    toast.error(
                        "Something went wrong, please contact support."
                    );
                }

                if (checkStatus.intuitRes.status === "SUCCEEDED") {
                    setIsTransactionApproved(true);
                    toast.success("Transaction approved!!");
                }

                if (checkStatus.intuitRes.status === "PENDING") {
                    setIsTransactionApproved(true);
                    toast.success("Transaction approved!!");
                }

                if (checkStatus.intuitRes.status === "DECLINED") {
                    toast.error("Transaction declined!!");
                }
            }

            setIsLoading(false);
            setBankErrors(null);
        } catch (err) {
            toast.error("Something went wrong, please contact support.");
            setIsLoading(false);
            setIsInternalError(true);
        }
    };

    const handleApproveOrder = async () => {
        const formattedDate = getFormattedDate();
        try {
            setIsLoading(true);

            const response = await axios.post(
                `/orders/${order.ordernum}/products/approve`,
                {
                    amountPaid: 0.0,
                    date: formattedDate,
                }
            );

            if (response.data.cashRes === "order approved") {
                toast.success("Order approved!!");
                setIsTransactionApproved(true);
            } else {
                toast.error(
                    "Could Not Approve Order. Please contact support!!"
                );
            }

            setIsLoading(false);
        } catch (error) {
            toast.error("Something went wrong. Please contact support!!");
            setIsLoading(false);
        }
    };

    console.log("==== OrderPayment ====");
    console.log("Order:", order);
    console.log("Delivery Info:", deliveryInfo);
    console.log("Deposit Info:", depositInfo);
    console.log("token url:", intuitMaskTokenUrl);
    console.log("is delivery info?:", isDeliveryInfo);

    return (
        <UserAuthenticatedLayout auth={auth} crrPage="orders">
            <OrderLayout order={order} crrOrderOption="payment">
                {!isDeliveryInfo ? (
                    <div className="bg-gray-200/50 backdrop-blur-sm mt-6 p-5 w-[100%] h-[250px]">
                        <h1 className="text-red-500 font-semibold text-center">
                            Please go to "Delivery Options" and fill out the
                            delivery form before submitting payment. Thank you.
                        </h1>
                    </div>
                ) : isInternalError ? (
                    <div className="bg-gray-200/50 backdrop-blur-sm mt-6 p-5 w-[100%] h-[250px]">
                        <h1 className="text-red-500 font-semibold text-center text-lg">
                            An Internal error has occurred. We apologize for the
                            inconvenience. Please <strong>DO NOT TRY</strong> to
                            submit a payment again, notify us and we will fix
                            this issue as soon as possible. Thank you.
                        </h1>
                    </div>
                ) : (
                    <>
                        {isTransactionApproved &&
                        !finalTotal.isExemptOfDeposit ? (
                            <div className="bg-gray-200/50 backdrop-blur-sm mt-6 p-5 w-[100%] h-[250px]">
                                <h1 className="">Payment submitted</h1>
                            </div>
                        ) : null}

                        {isTransactionApproved &&
                        finalTotal.isExemptOfDeposit ? (
                            <div className="bg-gray-200/50 backdrop-blur-sm mt-6 p-5 w-[100%] h-[250px]">
                                <h1 className="">Order Approved</h1>
                            </div>
                        ) : null}

                        {!isTransactionApproved && (
                            <section className="flex flex-col md:flex-row mt-6 p-5 bg-zinc-50 shadow-inner shadow-gray-200 rounded-md relative">
                                {isLoading && (
                                    <section className="bg-gray-200/50 backdrop-blur-md absolute top-0 left-0 w-[100%] h-[100%] ">
                                        <LoadingSpinner message="processing transaction..." />
                                    </section>
                                )}

                                {finalTotal.isExemptOfDeposit ? (
                                    <section className="grow flex justify-center items-center flex-col text-center">
                                        <p>
                                            Since you are no required to pay a
                                            deposit, You are allowed to approve
                                            the order at this time.
                                        </p>
                                        <button
                                            onClick={handleApproveOrder}
                                            className="w-[30%] mt-4 rounded border shadow-sm shadow-gray-950 px-5 py-2 text-sm transition-shadow hover:shadow-none hover:bg-green-400/95 hover:text-white hover:border-green-700"
                                        >
                                            Approve Order Now!!
                                        </button>
                                    </section>
                                ) : (
                                    <>
                                        <section className="w-[100%] md:w-[18em] p-6 shadow-sm shadow-gray-900 rounded mr-2">
                                            <h1 className="text-center font-medium text-lg text-davidiciGold">
                                                Charges Breakdown
                                            </h1>
                                            <section className="flex flex-col gap-3 mt-4">
                                                <div className="flex justify-between">
                                                    <span className="">
                                                        <h2>Products:</h2>
                                                    </span>
                                                    <span className="">
                                                        <p>
                                                            $
                                                            {(order.subtotal as number) -
                                                                finalTotal.deliveryFee}
                                                        </p>
                                                    </span>
                                                </div>

                                                <div className="flex justify-between border-b border-dotted pb-2 border-b-black">
                                                    <span className="">
                                                        <h2>Delivery Fee:</h2>
                                                    </span>
                                                    <span className="">
                                                        <p>
                                                            +$
                                                            {
                                                                finalTotal.deliveryFee
                                                            }
                                                        </p>
                                                    </span>
                                                </div>

                                                <div className="flex justify-between ">
                                                    <span className="">
                                                        <h2>Sub-Total:</h2>
                                                    </span>
                                                    <span className="">
                                                        <p>${order.subtotal}</p>
                                                    </span>
                                                </div>

                                                <div className="flex justify-between border-b border-dotted pb-2 border-b-black">
                                                    <span className="">
                                                        <h2>Credit:</h2>
                                                    </span>
                                                    <span className="">
                                                        <p>
                                                            -${order.totcredit}
                                                        </p>
                                                    </span>
                                                </div>

                                                <div className="flex justify-between pb-4 border-b-4 border-double border-b-davidiciGold">
                                                    <span className="">
                                                        <h2>
                                                            Current Sub-Total:
                                                        </h2>
                                                    </span>
                                                    <span className="">
                                                        <p>
                                                            $
                                                            {
                                                                depositInfo?.totcod
                                                            }
                                                        </p>
                                                    </span>
                                                </div>

                                                {!finalTotal.isDepositPaid && (
                                                    <div
                                                        className={
                                                            crrPaymentMethod ===
                                                            "bank account"
                                                                ? "border-b pb-2 border-b-black border-dotted flex justify-between"
                                                                : "flex justify-between"
                                                        }
                                                    >
                                                        <span className="">
                                                            <h2>Deposit:</h2>
                                                        </span>
                                                        <span className="">
                                                            <p>
                                                                $
                                                                {
                                                                    depositInfo?.depneeded
                                                                }
                                                            </p>
                                                        </span>
                                                    </div>
                                                )}

                                                {crrPaymentMethod ===
                                                    "credit card" && (
                                                    <div className="border-b pb-2 border-b-black border-dotted flex justify-between">
                                                        <span className="">
                                                            <h2>
                                                                3% credit card
                                                                fee:
                                                            </h2>
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
                                                    <span>
                                                        <p className="text-davidiciGold font-semibold">
                                                            $
                                                            {
                                                                finalTotal.grandTotal
                                                            }
                                                        </p>
                                                    </span>
                                                </div>
                                            </section>
                                        </section>

                                        <section className="grow py-6 md:px-8 md:py-4">
                                            <div className="flex gap-6 pb-2 mb-2">
                                                <p
                                                    className={
                                                        crrPaymentMethod ===
                                                        "credit card"
                                                            ? "px-5 py-1 text-davidiciGold font-semibold border-b border-davidiciGold"
                                                            : "px-5 py-1 shadow-sm shadow-davidiciGold/60 transition-shadow hover:shadow-none cursor-pointer"
                                                    }
                                                    onClick={() => {
                                                        setCrrPaymentMethod(
                                                            "credit card"
                                                        );
                                                        setBankErrors(null);
                                                    }}
                                                >
                                                    Credit
                                                </p>
                                                <p
                                                    className={
                                                        crrPaymentMethod ===
                                                        "bank account"
                                                            ? "px-5 py-1 text-davidiciGold font-semibold border-b border-davidiciGold"
                                                            : "px-5 py-1 shadow-sm shadow-davidiciGold/60 transition-shadow hover:shadow-none cursor-pointer"
                                                    }
                                                    onClick={() => {
                                                        setCrrPaymentMethod(
                                                            "bank account"
                                                        );
                                                        setCardErrors(null);
                                                    }}
                                                >
                                                    Bank account
                                                </p>
                                            </div>
                                            {crrPaymentMethod ===
                                                "credit card" && (
                                                <CreditCardForm
                                                    handleSubmit={
                                                        handleCardSubmit
                                                    }
                                                    errors={
                                                        cardValidationErrors
                                                    }
                                                />
                                            )}
                                            {crrPaymentMethod ===
                                                "bank account" && (
                                                <BankAccountForm
                                                    handleSubmit={
                                                        handleBankSubmit
                                                    }
                                                    errors={
                                                        bankValidationErrors
                                                    }
                                                />
                                            )}
                                        </section>
                                    </>
                                )}
                            </section>
                        )}
                    </>
                )}
            </OrderLayout>
            <ToastContainer />
        </UserAuthenticatedLayout>
    );
}

export default OrderPayment;
