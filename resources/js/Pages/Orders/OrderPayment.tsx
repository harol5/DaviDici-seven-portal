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
                <h1>Payment</h1>
                <form
                    id="payment-form"
                    onSubmit={handleSubmit}
                    className="flex flex-col"
                >
                    <div>
                        <label htmlFor="card-num">Card number:</label>
                        <input
                            type="tel"
                            pattern="\d*"
                            minLength={14}
                            maxLength={19}
                            id="card-num"
                            name="number"
                            value={state.number}
                            placeholder="Credit Card Number"
                            autoComplete="cc-number"
                            onChange={(e) => {
                                dispatch({
                                    type: "set-number",
                                    payload: e.currentTarget.value,
                                });
                            }}
                        />
                    </div>

                    <div>
                        <label htmlFor="exp-date">Expiration date:</label>
                        <input
                            type="tel"
                            maxLength={2}
                            id="exp-date"
                            name="expMonth"
                            min={"01"}
                            max={"12"}
                            value={state.expMonth}
                            placeholder="MM"
                            onChange={(e) => {
                                dispatch({
                                    type: "set-expMonth",
                                    payload: e.currentTarget.value,
                                });
                            }}
                        />
                        <input
                            type="tel"
                            maxLength={4}
                            name="expYear"
                            value={state.expYear}
                            placeholder="YYYY, Ex: 2027"
                            onChange={(e) => {
                                dispatch({
                                    type: "set-expYear",
                                    payload: e.currentTarget.value,
                                });
                            }}
                        />
                    </div>

                    <div>
                        <label htmlFor="cvc">Security code:</label>
                        <input
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

                    <div>
                        <label htmlFor="name">Name on card:</label>
                        <input
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

                    <label htmlFor="billing-address">Address</label>
                    <input
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

                    <label htmlFor="city">City:</label>
                    <input
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

                    <label htmlFor="state">State:</label>
                    <select
                        className=""
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

                    <label htmlFor="zip-code">Zip code:</label>
                    <input
                        type="text"
                        className=""
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

                    <button type="submit">submit</button>
                </form>
            </OrderLayout>
            <ToastContainer />
        </UserAuthenticatedLayout>
    );
}

export default OrderPayment;
