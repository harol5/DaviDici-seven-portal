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
import { ErrorIntuit, intuitMaskTokenUrl } from "../../Models/Intuit";
import User from "../../Models/User";
import { getFormattedDate } from "../../utils/helperFunc";

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
    console.log("token url:", intuitMaskTokenUrl);

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

    const deliveryFee = useMemo(() => {
        const crrDeliveryType = deliveryInfo[0].dtype;
        return crrDeliveryType === "TO DEALER"
            ? 50
            : crrDeliveryType === "DAVIDICI FINAL MILE"
            ? 75
            : 0;
    }, []);

    const finalTotal = useMemo(() => {
        // const isExemptOfDeposit =
        //     depositInfo?.percdep === 0 &&
        //     Number.parseInt(order.totcredit as string) === 0;

        const isExemptOfDeposit =
            depositInfo?.percdep === 0 && !order.submitted;

        let subTotal = depositInfo?.depneeded!;

        const extraFee =
            crrPaymentMethod === "credit card" ? depositInfo?.ccchg! : 0;

        // if totcredit !== 0 and order.submitted !== null, means the deposit has been paid.
        if (
            depositInfo?.depneeded! === 0 ||
            (Number.parseInt(order.totcredit as string) > 0 && order.submitted)
        ) {
            subTotal = depositInfo?.totcod!;
        }

        const grandTotal = subTotal + extraFee;

        return {
            fee: depositInfo?.ccchg,
            grandTotal,
            subTotal,
            isExemptOfDeposit,
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
                toast.error("SOmething went wrong. please contact support");
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
            if (axios.isAxiosError(error)) {
                if (error.response?.data.errors) {
                    const errors: ErrorIntuit[] = error.response.data.errors;
                    setCardErrors(errors);
                }
            } else {
                console.error(error);
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
                console.log("echeck error:", errors);
                setBankErrors(errors);
                return;
            }

            if (data.status === 401 || data.status === 501) {
                setIsLoading(false);
                setBankErrors(null);
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

    return (
        <UserAuthenticatedLayout auth={auth} crrPage="orders">
            <OrderLayout order={order} crrOrderOption="payment">
                {isTransactionApproved && !finalTotal.isExemptOfDeposit ? (
                    <div className="absolute bg-gray-200/50 backdrop-blur-sm mt-6 p-5">
                        <h1 className="">Payment submitted</h1>
                    </div>
                ) : null}

                {isTransactionApproved && finalTotal.isExemptOfDeposit ? (
                    <div className="absolute bg-gray-200/50 backdrop-blur-sm mt-6 p-5">
                        <h1 className="">Order Approved</h1>
                    </div>
                ) : null}

                {!isTransactionApproved && (
                    <section className="flex mt-6 p-5 bg-zinc-50 shadow-inner shadow-gray-200 rounded-md relative">
                        {/*place transaction approved here*/}
                        {isLoading && (
                            <div className="absolute bg-gray-200/50 backdrop-blur-sm w-[100%] h-[100%]">
                                <p>loading...</p>
                            </div>
                        )}

                        {finalTotal.isExemptOfDeposit ? (
                            <section className="grow flex justify-center items-center flex-col text-center">
                                <p>
                                    Since you are no required to pay a deposit,
                                    You are allowed to approve the order at this
                                    time.
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
                                                crrPaymentMethod ===
                                                "bank account"
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
                                                crrPaymentMethod ===
                                                "credit card"
                                                    ? "border-b border-davidiciGold px-5 py-1 shadow-sm shadow-davidiciGold transition-shadow hover:shadow-none cursor-pointer"
                                                    : "px-5 py-1 cursor-pointer"
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
                                                    ? "border-b border-davidiciGold px-5 py-1 cursor-pointer"
                                                    : "px-5 py-1 cursor-pointer"
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
                            </>
                        )}
                    </section>
                )}
            </OrderLayout>
            <ToastContainer />
        </UserAuthenticatedLayout>
    );
}

export default OrderPayment;
