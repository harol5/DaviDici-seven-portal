import { FormEvent, useReducer } from "react";
import type { CardInfo as CardInfoModel } from "../Models/CardInfo";

interface CreditCardFormProps {
    handleSubmit: (e: FormEvent, state: CardInfoModel) => void;
}

type Action = {
    type:
        | "set-number"
        | "set-expMonth"
        | "set-expYear"
        | "set-cvc"
        | "set-name"
        | "set-streetAddress"
        | "set-postalCode"
        | "set-city"
        | "set-region";

    payload: string;
};

function BankAccountForm({ handleSubmit }: CreditCardFormProps) {
    const card: CardInfoModel = {
        number: "",
        expMonth: "",
        expYear: "",
        cvc: "",
        name: "",
        address: {
            streetAddress: "",
            postalCode: "",
            city: "",
            region: "",
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
            case "set-streetAddress":
                return {
                    ...state,
                    address: {
                        ...state.address,
                        streetAddress: action.payload,
                    },
                };
            case "set-postalCode":
                return {
                    ...state,
                    address: {
                        ...state.address,
                        postalCode: action.payload,
                    },
                };
            case "set-city":
                return {
                    ...state,
                    address: {
                        ...state.address,
                        city: action.payload,
                    },
                };
            case "set-region":
                return {
                    ...state,
                    address: {
                        ...state.address,
                        region: action.payload,
                    },
                };
            default:
                throw new Error();
        }
    };

    const [state, dispatch] = useReducer(reducer, card);

    return <h1>bank account form</h1>;
}

export default BankAccountForm;
