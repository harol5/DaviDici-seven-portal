import { FormEvent, useReducer, useRef, useState } from "react";
import OrderLayout from "../../Layouts/OrderLayout";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import type { Order as OrderModel } from "../../Models/Order";
import type { CardInfo as CardInfoModel } from "../../Models/CardInfo";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

interface OrderPaymentProps {
    order: OrderModel;
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

function OrderPayment({ order }: OrderPaymentProps) {
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

    const handleSubmit = async (e: FormEvent) => {
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
                <form
                    id="payment-form"
                    onSubmit={handleSubmit}
                    className="flex flex-wrap mt-3"
                >
                    <div className="flex flex-col basis-[60%] pr-7 mb-2">
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

                    <div className="flex flex-col basis-[20%] mb-2">
                        <label htmlFor="exp-date" className="mb-1">
                            Expiration date:
                        </label>
                        <div>
                            <input
                                className="w-[60px] p-[0.2em]"
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
                                className="w-[60px] p-[0.2em]"
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

                    <div className="flex flex-col basis-[20%] mb-2">
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

                    <div className="flex flex-col basis-[100%] mb-2">
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

                    <div className="flex flex-col basis-[100%] mb-2">
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

                    <div className="flex flex-col basis-[33.3333%] pr-5 mb-2">
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

                    <div className="flex flex-col basis-[33.3333%] pr-5 mb-2">
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

                    <div className="flex flex-col basis-[33.3333%] mb-2">
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

                    <div className="basis-[100%]">
                        <button type="submit">submit</button>
                    </div>
                </form>
            </OrderLayout>
            <ToastContainer />
        </UserAuthenticatedLayout>
    );
}

export default OrderPayment;
