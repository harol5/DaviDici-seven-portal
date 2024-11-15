import { FormEvent, useMemo, useReducer } from "react";
import type { BankInfo as BankInfoModel } from "../Models/BankInfo";
import { ErrorIntuit } from "../Models/Intuit";

interface BankAccountFormProps {
    handleSubmit: (e: FormEvent, state: BankInfoModel) => void;
    errors: ErrorIntuit[] | null;
}

type Action = {
    type:
        | "set-name"
        | "set-accountNumber"
        | "set-accountType"
        | "set-routingNumber"
        | "set-phone"
        | "set-amount";

    payload: string;
};

function BankAccountForm({ handleSubmit, errors }: BankAccountFormProps) {
    const crrErrors = useMemo(() => {
        return errors
            ? errors.reduce<Record<string, ErrorIntuit>>((acc, error) => {
                  acc[error.detail ?? error.code] = error;
                  return acc;
              }, {})
            : null;
    }, [errors]);

    const eCheck: BankInfoModel = {
        bankAccount: {
            name: "",
            accountNumber: "",
            accountType: "PERSONAL_CHECKING",
            routingNumber: "",
            phone: "",
        },
        paymentMode: "WEB",
        amount: 0,
    };

    const reducer = (state: BankInfoModel, action: Action) => {
        switch (action.type) {
            case "set-name":
                return {
                    ...state,
                    bankAccount: {
                        ...state.bankAccount,
                        name: action.payload,
                    },
                };
            case "set-accountNumber":
                return {
                    ...state,
                    bankAccount: {
                        ...state.bankAccount,
                        accountNumber: action.payload,
                    },
                };
            case "set-accountType":
                return {
                    ...state,
                    bankAccount: {
                        ...state.bankAccount,
                        accountType: action.payload,
                    },
                };
            case "set-routingNumber":
                return {
                    ...state,
                    bankAccount: {
                        ...state.bankAccount,
                        routingNumber: action.payload,
                    },
                };
            case "set-phone":
                return {
                    ...state,
                    bankAccount: {
                        ...state.bankAccount,
                        phone: action.payload,
                    },
                };
            default:
                throw new Error();
        }
    };

    const [state, dispatch] = useReducer(reducer, eCheck);

    console.log("=== BankAccountForm ===");
    console.log("Errors:", errors);
    console.log("current Errors:", crrErrors);

    return (
        <form id="payment-form" onSubmit={(e) => handleSubmit(e, state)}>
            <div className="flex gap-3 flex-col mb-2">
                <div className="flex flex-col">
                    <label htmlFor="name" className="mb-1">
                        Name:
                    </label>
                    <input
                        className="px-[0.2em] border border-black rounded"
                        type="text"
                        name="name"
                        value={state.bankAccount.name}
                        id="name"
                        required
                        maxLength={64}
                        onChange={(e) => {
                            dispatch({
                                type: "set-name",
                                payload: e.currentTarget.value,
                            });
                        }}
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="account-number" className="mb-1">
                        Account number:
                    </label>
                    <input
                        className="px-[0.2em] border border-black rounded"
                        type="tel"
                        name="accountNumber"
                        value={state.bankAccount.accountNumber}
                        id="account-number"
                        required
                        minLength={4}
                        maxLength={17}
                        onChange={(e) => {
                            dispatch({
                                type: "set-accountNumber",
                                payload: e.currentTarget.value,
                            });
                        }}
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="account-type" className="mb-1">
                        Account type:
                    </label>
                    <select
                        className="px-[0.3em] py-[0.17em] border border-black rounded"
                        id="account-type"
                        name="accountType"
                        value={state.bankAccount.accountType}
                        required
                        onChange={(e) => {
                            dispatch({
                                type: "set-accountType",
                                payload: e.currentTarget.value,
                            });
                        }}
                    >
                        <option value="PERSONAL_CHECKING">
                            personal checking
                        </option>
                        <option value="PERSONAL_SAVINGS">
                            personal savings
                        </option>
                        <option value="BUSINESS_CHECKING">
                            business checking
                        </option>
                        <option value="BUSINESS_SAVINGS">
                            business savings
                        </option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="routing-number" className="mb-1">
                        Routing number:
                    </label>
                    {crrErrors && crrErrors["bankAccount.routingNumber"] ? (
                        <p className="text-red-500">
                            {crrErrors["bankAccount.routingNumber"].moreInfo}
                        </p>
                    ) : null}
                    <input
                        className="px-[0.2em] border border-black rounded"
                        type="tel"
                        name="routingNumber"
                        value={state.bankAccount.routingNumber}
                        id="routing-number"
                        required
                        minLength={9}
                        maxLength={9}
                        onChange={(e) => {
                            dispatch({
                                type: "set-routingNumber",
                                payload: e.currentTarget.value,
                            });
                        }}
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="phone" className="mb-1">
                        Phone number:
                    </label>
                    {/* {errors.phone && <p>{errors.phone}</p>} */}
                    <input
                        type="tel"
                        className="px-[0.2em] border border-black rounded"
                        name="phone"
                        value={state.bankAccount.phone}
                        id="phone"
                        minLength={10}
                        maxLength={10}
                        required
                        onChange={(e) => {
                            dispatch({
                                type: "set-phone",
                                payload: e.currentTarget.value,
                            });
                        }}
                    />
                </div>
            </div>

            <div className="flex justify-center mt-5">
                <button
                    className="rounded border shadow-sm shadow-gray-950 px-5 py-2 text-sm transition-shadow hover:shadow-none hover:bg-green-400/95 hover:text-white hover:border-green-700"
                    type="submit"
                >
                    submit
                </button>
            </div>
        </form>
    );
}

export default BankAccountForm;
