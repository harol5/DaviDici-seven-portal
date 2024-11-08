import { FormEvent, useReducer } from "react";
import type { CardInfo as CardInfoModel } from "../Models/CardInfo";

interface CreditCardFormProps {
    handleSubmit: (e: FormEvent, state: CardInfoModel) => void;
    errors: any;
}

type Action = {
    type:
        | "set-number"
        | "set-expMonth"
        | "set-expYear"
        | "set-cvc"
        | "set-name"
        | "set-postalCode";

    payload: string;
};

function CreditCardForm({ handleSubmit, errors }: CreditCardFormProps) {
    console.log("=== CreditCardForm ===");
    console.log("Errors:", errors);

    const card: CardInfoModel = {
        number: "",
        expMonth: "",
        expYear: "",
        cvc: "",
        name: "",
        address: {
            postalCode: "",
        },
    };

    const reducer = (state: CardInfoModel, action: Action) => {
        switch (action.type) {
            case "set-number":
                return {
                    ...state,
                    number: action.payload,
                };
            case "set-expMonth":
                return {
                    ...state,
                    expMonth: action.payload,
                };
            case "set-expYear":
                return {
                    ...state,
                    expYear: action.payload,
                };
            case "set-cvc":
                return {
                    ...state,
                    cvc: action.payload,
                };
            case "set-name":
                return {
                    ...state,
                    name: action.payload,
                };
            case "set-postalCode":
                return {
                    ...state,
                    address: {
                        ...state.address,
                        postalCode: action.payload,
                    },
                };
            default:
                throw new Error();
        }
    };

    const [state, dispatch] = useReducer(reducer, card);

    return (
        <form id="payment-form" onSubmit={(e) => handleSubmit(e, state)}>
            <div className="flex gap-3 mb-2">
                <div className="flex flex-col grow">
                    <label htmlFor="card-num" className="mb-1">
                        Card number:
                    </label>
                    <input
                        className="px-[0.2em] border border-black rounded"
                        type="tel"
                        minLength={14}
                        maxLength={19}
                        required
                        id="card-num"
                        name="number"
                        value={state.number}
                        autoComplete="cc-number"
                        onChange={(e) => {
                            dispatch({
                                type: "set-number",
                                payload: e.currentTarget.value,
                            });
                        }}
                    />
                </div>

                <div className="flex flex-col items-center">
                    <label htmlFor="exp-date" className="mb-1">
                        Expiration date:
                    </label>
                    <div className="flex gap-1">
                        <input
                            className="px-[0.2em] w-[40px] border border-black rounded"
                            type="tel"
                            maxLength={2}
                            id="exp-date"
                            name="expMonth"
                            min={"01"}
                            max={"12"}
                            required
                            value={state.expMonth}
                            placeholder="mm"
                            onChange={(e) => {
                                dispatch({
                                    type: "set-expMonth",
                                    payload: e.currentTarget.value,
                                });
                            }}
                        />
                        /
                        <input
                            className="px-[0.2em] w-[60px] border border-black rounded"
                            type="tel"
                            maxLength={4}
                            required
                            name="expYear"
                            value={state.expYear}
                            placeholder="yyyy"
                            onChange={(e) => {
                                dispatch({
                                    type: "set-expYear",
                                    payload: e.currentTarget.value,
                                });
                            }}
                        />
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <label htmlFor="cvc" className="mb-1">
                        Security code:
                    </label>
                    <input
                        className="px-[0.2em] border border-black rounded"
                        type="tel"
                        name="cvc"
                        value={state.cvc}
                        placeholder="CVC"
                        autoComplete="cc-csc"
                        id="cvc"
                        required
                        onChange={(e) => {
                            dispatch({
                                type: "set-cvc",
                                payload: e.currentTarget.value,
                            });
                        }}
                    />
                </div>
            </div>

            <div className="flex gap-3 flex-col mb-2">
                <div className="flex flex-col">
                    <label htmlFor="name" className="mb-1">
                        Name on card:
                    </label>
                    <input
                        className="px-[0.2em] border border-black rounded"
                        type="text"
                        name="name"
                        value={state.name}
                        id="name"
                        onChange={(e) => {
                            dispatch({
                                type: "set-name",
                                payload: e.currentTarget.value,
                            });
                        }}
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="zip-code" className="mb-1">
                        Zip code:
                    </label>
                    <input
                        type="text"
                        className="px-[0.2em] border border-black rounded"
                        name="zipCode"
                        value={state.address.postalCode}
                        minLength={5}
                        maxLength={10}
                        required
                        id="zip-code"
                        onChange={(e) => {
                            dispatch({
                                type: "set-postalCode",
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
                    Submit and Approve
                </button>
            </div>
        </form>
    );
}

export default CreditCardForm;
