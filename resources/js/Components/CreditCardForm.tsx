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

function CreditCardForm({ handleSubmit }: CreditCardFormProps) {
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

    return (
        <form id="payment-form" onSubmit={(e) => handleSubmit(e, state)}>
            <div className="flex gap-3 mb-2">
                <div className="flex flex-col grow">
                    <label htmlFor="card-num" className="mb-1">
                        Card number:
                    </label>
                    <input
                        className="p-[0.2em]"
                        type="tel"
                        minLength={14}
                        maxLength={19}
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
                    <div className="flex">
                        <input
                            className="p-[0.2em] w-[40px]"
                            type="tel"
                            maxLength={2}
                            id="exp-date"
                            name="expMonth"
                            min={"01"}
                            max={"12"}
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
                            className="p-[0.2em] w-[60px]"
                            type="tel"
                            maxLength={4}
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
                        className="p-[0.2em]"
                        type="tel"
                        name="cvc"
                        value={state.cvc}
                        placeholder="CVC"
                        autoComplete="cc-csc"
                        id="cvc"
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
                        className="p-[0.2em]"
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
                    <label htmlFor="billing-address" className="mb-1">
                        Address
                    </label>
                    <input
                        className="p-[0.2em]"
                        type="text"
                        name="address"
                        value={state.address.streetAddress}
                        id="billing-address"
                        onChange={(e) => {
                            dispatch({
                                type: "set-streetAddress",
                                payload: e.currentTarget.value,
                            });
                        }}
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="city" className="mb-1">
                        City:
                    </label>
                    <input
                        className="p-[0.2em]"
                        type="text"
                        name="city"
                        value={state.address.city}
                        id="city"
                        onChange={(e) => {
                            dispatch({
                                type: "set-city",
                                payload: e.currentTarget.value,
                            });
                        }}
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="state" className="mb-1">
                        State:
                    </label>
                    <select
                        className="p-[0.3em]"
                        id="state"
                        name="state"
                        value={state.address.region}
                        onChange={(e) => {
                            dispatch({
                                type: "set-region",
                                payload: e.currentTarget.value,
                            });
                        }}
                    >
                        <option value="">N/A</option>
                        <option value="AK">Alaska</option>
                        <option value="AL">Alabama</option>
                        <option value="AR">Arkansas</option>
                        <option value="AZ">Arizona</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DC">District of Columbia</option>
                        <option value="DE">Delaware</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="HI">Hawaii</option>
                        <option value="IA">Iowa</option>
                        <option value="ID">Idaho</option>
                        <option value="IL">Illinois</option>
                        <option value="IN">Indiana</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="MA">Massachusetts</option>
                        <option value="MD">Maryland</option>
                        <option value="ME">Maine</option>
                        <option value="MI">Michigan</option>
                        <option value="MN">Minnesota</option>
                        <option value="MO">Missouri</option>
                        <option value="MS">Mississippi</option>
                        <option value="MT">Montana</option>
                        <option value="NC">North Carolina</option>
                        <option value="ND">North Dakota</option>
                        <option value="NE">Nebraska</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NM">New Mexico</option>
                        <option value="NV">Nevada</option>
                        <option value="NY">New York</option>
                        <option value="OH">Ohio</option>
                        <option value="OK">Oklahoma</option>
                        <option value="OR">Oregon</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="PR">Puerto Rico</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="SD">South Dakota</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="VA">Virginia</option>
                        <option value="VT">Vermont</option>
                        <option value="WA">Washington</option>
                        <option value="WI">Wisconsin</option>
                        <option value="WV">West Virginia</option>
                        <option value="WY">Wyoming</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="zip-code" className="mb-1">
                        Zip code:
                    </label>
                    <input
                        type="text"
                        className="p-[0.2em]"
                        name="zipCode"
                        value={state.address.postalCode}
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

            <div className="">
                <button type="submit">submit</button>
            </div>
        </form>
    );
}

export default CreditCardForm;
