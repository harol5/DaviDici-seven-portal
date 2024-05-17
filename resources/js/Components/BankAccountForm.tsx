import { FormEvent, useReducer } from "react";
import type { BankInfo as BankInfoModel } from "../Models/BankInfo";

interface CreditCardFormProps {
    handleSubmit: (e: FormEvent, state: BankInfoModel) => void;
}

type Action = {
    type:
        | "set-name"
        | "set-accountNumber"
        | "set-accountType"
        | "set-routingNumber"
        | "set-phone";

    payload: string;
};

function BankAccountForm({ handleSubmit }: CreditCardFormProps) {
    const bank: BankInfoModel = {
        name: "",
        accountNumber: "",
        accountType: "PERSONAL_CHECKING",
        routingNumber: "",
        phone: "",
    };

    const reducer = (state: BankInfoModel, action: Action) => {
        switch (action.type) {
            case "set-name":
                return {
                    ...state,
                    name: action.payload,
                };
            case "set-accountNumber":
                return {
                    ...state,
                    accountNumber: action.payload,
                };
            case "set-accountType":
                return {
                    ...state,
                    accountType: action.payload,
                };
            case "set-routingNumber":
                return {
                    ...state,
                    routingNumber: action.payload,
                };
            case "set-phone":
                return {
                    ...state,
                    phone: action.payload,
                };
            default:
                throw new Error();
        }
    };

    const [state, dispatch] = useReducer(reducer, bank);

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
                        value={state.name}
                        id="name"
                        required
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
                        type="text"
                        name="accountNumber"
                        value={state.accountNumber}
                        id="account-number"
                        required
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
                        value={state.accountType}
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
                    <input
                        className="px-[0.2em] border border-black rounded"
                        type="text"
                        name="routingNumber"
                        value={state.routingNumber}
                        id="routing-number"
                        required
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
                        Zip code:
                    </label>
                    <input
                        type="text"
                        className="px-[0.2em] border border-black rounded"
                        name="phone"
                        value={state.phone}
                        id="phone"
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

            <div className="">
                <button
                    className="border border-black rounded px-3"
                    type="submit"
                >
                    submit
                </button>
            </div>
        </form>
    );
}

export default BankAccountForm;
