import type { Order as OrderModel } from "../Models/Order";
import { FormEvent, useState } from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { DeliveryFoxpro as DeliveryFoxproModel } from "../Models/Delivery";

interface DeliveryFormProps {
    order: OrderModel;
    deliveryInfo: DeliveryFoxproModel;
    setDeliveryFee: (crrDeliveryType: string, newDeliveryFee: string) => void;
}

function DeliveryForm({
    order,
    deliveryInfo,
    setDeliveryFee,
}: DeliveryFormProps) {
    const getDate = () => {
        const dateObj = new Date();
        dateObj.setDate(dateObj.getUTCDate() + 7);

        const month = dateObj.getUTCMonth() + 1; // months from 1-12
        const date = dateObj.getUTCDate();
        const year = dateObj.getUTCFullYear();

        // Using padded values, so that 2023/1/7 becomes 2023/01/07
        const pMonth = month.toString().padStart(2, "0");
        const pNextDate = date.toString().padStart(2, "0");
        const startDate = `${year}-${pMonth}-${pNextDate}`;

        return startDate;
    };

    const [errors, setErrors] = useState({
        date: [],
        address: [],
        cellphoneNumber: [],
        city: [],
        contactName: [],
        customerEmail: [],
        customerName: [],
        deliveryType: [],
        state: [],
        telephoneNumber: [],
        wholesalerEmail: [],
        zipCode: [],
    });

    const [isDataSaved, setIsDataSaved] = useState(() =>
        deliveryInfo.sadd ? true : false
    );

    const [crrDeliveryType, setCrrDeliveryType] = useState(deliveryInfo.dtype);

    const { data, setData } = useForm({
        date: deliveryInfo.deldate || getDate(),
        address: deliveryInfo.sadd,
        cellphoneNumber: deliveryInfo.scell,
        city: deliveryInfo.scity,
        contactName: deliveryInfo.contact,
        customerEmail: deliveryInfo.semail,
        customerName: deliveryInfo.sname,
        deliveryType: deliveryInfo.dtype || "TO DEALER", // default delivery type.
        state: deliveryInfo.sst,
        telephoneNumber: deliveryInfo.stel,
        wholesalerEmail: deliveryInfo.swmail,
        zipCode: deliveryInfo.szip,
        deliveryInstruction: deliveryInfo.spinst,
    });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("delivery info sent to api", data);
        const dateAsArray = data.date.split("-");
        const year = dateAsArray.shift()!;
        dateAsArray.push(year);
        const formattedDeliveryDate = dateAsArray.join("/");

        try {
            const res = await axios.post(
                `/orders/${order.ordernum}/products/delivery`,
                {
                    ...data,
                    date: formattedDeliveryDate,
                    deliveryInstruction: data.deliveryInstruction || "N/A",
                }
            );

            if (res.data.foxproRes.status === 201) {
                setIsDataSaved(true);
                setDeliveryFee(crrDeliveryType, data.deliveryType);
                setCrrDeliveryType(data.deliveryType);
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error.response?.data);
                if (error.response?.data.errors) {
                    const errors = error.response.data.errors;
                    setErrors(errors);
                }
            } else {
                console.error(error);
            }
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="delivery-form bg-zinc-50 shadow-inner shadow-gray-300 py-10 px-10 rounded-md"
            >
                <div className="delivery-date">
                    <label htmlFor="delivery-date">Choose delivery date:</label>
                    <input
                        type="date"
                        id="delivery-date"
                        name="date"
                        min={getDate()}
                        max="2024-06-20"
                        value={data.date}
                        onChange={(e) => setData("date", e.currentTarget.value)}
                        readOnly={isDataSaved}
                    />
                    {errors.date && (
                        <p className="text-red-500">{errors.date}</p>
                    )}
                </div>

                <div className="edit-button-wrapper">
                    <button
                        type="button"
                        disabled={
                            !isDataSaved || (order.submitted ? true : false)
                        }
                        onClick={() => setIsDataSaved(false)}
                        className="shadow-sm shadow-gray-500 transition-shadow hover:shadow-none"
                    >
                        Edit
                    </button>
                </div>

                <div className="customer-name-wrapper">
                    <label htmlFor="customer-name">Customer name:</label>
                    <input
                        type="text"
                        name="customerName"
                        id="customer-name"
                        onChange={(e) =>
                            setData("customerName", e.target.value)
                        }
                        value={data.customerName}
                        readOnly={isDataSaved}
                    />
                    {errors.customerName && (
                        <p className="text-red-500">{errors.customerName}</p>
                    )}
                </div>

                <div className="contact-name-wrapper">
                    <label htmlFor="contact-name">Contact name:</label>
                    <input
                        type="text"
                        name="contactName"
                        id="contact-name"
                        value={data.contactName}
                        onChange={(e) => setData("contactName", e.target.value)}
                        readOnly={isDataSaved}
                    />
                    {errors.contactName && (
                        <p className="text-red-500">{errors.contactName}</p>
                    )}
                </div>

                <div className="telephone-number-wrapper">
                    <label htmlFor="telephone-number">Telephone number:</label>
                    <input
                        type="tel"
                        name="telephoneNumber"
                        id="telephone-number"
                        onChange={(e) =>
                            setData("telephoneNumber", e.target.value)
                        }
                        value={data.telephoneNumber}
                        readOnly={isDataSaved}
                    />
                    {errors.telephoneNumber && (
                        <p className="text-red-500">{errors.telephoneNumber}</p>
                    )}
                </div>

                <div className="cellphone-number-wrapper">
                    <label htmlFor="cellphone-number">Cellphone number:</label>
                    <input
                        type="tel"
                        name="cellphoneNumber"
                        id="cellphone-number"
                        onChange={(e) =>
                            setData("cellphoneNumber", e.target.value)
                        }
                        value={data.cellphoneNumber}
                        readOnly={isDataSaved}
                    />
                    {errors.cellphoneNumber && (
                        <p className="text-red-500">{errors.cellphoneNumber}</p>
                    )}
                </div>

                <div className="wholesaler-email-wrapper">
                    <label htmlFor="wholesaler-email">Wholesaler email:</label>
                    <input
                        type="email"
                        name="wholesalerEmail"
                        id="wholesaler-email"
                        onChange={(e) =>
                            setData("wholesalerEmail", e.target.value)
                        }
                        value={data.wholesalerEmail}
                        readOnly={isDataSaved}
                    />
                    {errors.wholesalerEmail && (
                        <p className="text-red-500">{errors.wholesalerEmail}</p>
                    )}
                </div>

                <div className="customer-email-wrapper">
                    <label htmlFor="customer-email">Customer email:</label>
                    <input
                        type="email"
                        name="customerEmail"
                        id="customer-email"
                        onChange={(e) =>
                            setData("customerEmail", e.target.value)
                        }
                        value={data.customerEmail}
                        readOnly={isDataSaved}
                    />
                    {errors.customerEmail && (
                        <p className="text-red-500">{errors.customerEmail}</p>
                    )}
                </div>

                <div className="address-wrapper">
                    <label htmlFor="address">Address:</label>
                    <input
                        type="text"
                        name="address"
                        id="address"
                        onChange={(e) => setData("address", e.target.value)}
                        value={data.address}
                        readOnly={isDataSaved}
                    />
                    {errors.address && (
                        <p className="text-red-500">{errors.address}</p>
                    )}
                </div>

                <div className="city-wrapper">
                    <label htmlFor="city">City:</label>
                    <input
                        type="text"
                        name="city"
                        id="city"
                        onChange={(e) => setData("city", e.target.value)}
                        value={data.city}
                        readOnly={isDataSaved}
                    />
                    {errors.city && (
                        <p className="text-red-500">{errors.city}</p>
                    )}
                </div>

                <div className="state-wrapper">
                    <label htmlFor="state">State:</label>
                    <input
                        type="text"
                        name="state"
                        id="state"
                        onChange={(e) => setData("state", e.target.value)}
                        value={data.state}
                        readOnly={isDataSaved}
                    />
                    {errors.state && (
                        <p className="text-red-500">{errors.state}</p>
                    )}
                </div>

                <div className="zip-code-wrapper">
                    <label htmlFor="zip-code">Zip code:</label>
                    <input
                        type="text"
                        name="zipCode"
                        id="zip-code"
                        onChange={(e) => setData("zipCode", e.target.value)}
                        value={data.zipCode}
                        readOnly={isDataSaved}
                    />
                    {errors.zipCode && (
                        <p className="text-red-500">{errors.zipCode}</p>
                    )}
                </div>

                <div className="delivery-type-wrapper">
                    <label htmlFor="delivery-type">Delivery type:</label>
                    <select
                        name="deliveryType"
                        id="delivery-type"
                        onChange={(e) =>
                            setData("deliveryType", e.target.value)
                        }
                        value={data.deliveryType}
                        disabled={isDataSaved}
                    >
                        <option value="TO DEALER">To Dealer ($50 fee)</option>
                        <option value="DAVIDICI FINAL MILE">
                            Davidici Final Mile ($75 fee)
                        </option>
                        <option value="PICK UP">Pick up</option>
                    </select>
                    {errors.deliveryType && (
                        <p className="text-red-500">{errors.deliveryType}</p>
                    )}
                </div>

                <div className="delivery-instruction-wrapper">
                    <label htmlFor="delivery-instruction">
                        Delivery Instructions:
                    </label>
                    <textarea
                        name="deliveryInstruction"
                        id="delivery-instruction"
                        cols={30}
                        rows={5}
                        onChange={(e) =>
                            setData("deliveryInstruction", e.target.value)
                        }
                        value={data.deliveryInstruction}
                        readOnly={isDataSaved}
                    ></textarea>
                </div>

                <div className="submit-button-wrapper">
                    <button
                        type="submit"
                        disabled={isDataSaved}
                        className="shadow-sm shadow-gray-500 transition-shadow hover:shadow-none"
                    >
                        Submit
                    </button>
                </div>
            </form>
            <ToastContainer />
        </>
    );
}

export default DeliveryForm;
