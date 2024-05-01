import type { Order as OrderModel } from "../Models/Order";
import { FormEvent } from "react";
import { useForm } from "@inertiajs/react";

interface DeliveryFormProps {
    order: OrderModel;
}

function DeliveryForm({ order }: DeliveryFormProps) {
    const { data, setData, post, errors } = useForm({
        address: "",
        cellphoneNumber: "",
        city: "",
        contactName: "",
        customerEmail: "",
        customerName: "",
        deliveryType: "to dealer",
        state: "",
        telephoneNumber: "",
        wholesalerEmail: "",
        zipCode: "",
        deliveryInstruction: "",
    });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(data);
        post(`/orders/${order.ordernum}/products/delivery`);

        // const form = e.currentTarget;
        // const formData = new FormData(form);
        // const data = Object.fromEntries(formData.entries());
        // console.log(data);
        // try {
        //     const res = await axios.post(
        //         `/orders/${order.ordernum}/products/delivery`,
        //         data
        //     );
        //     console.log(res);
        // } catch (error) {
        //     if (axios.isAxiosError(error)) {
        //         console.log(error.response?.data);
        //         if (error.response?.data.errors) {
        //         }
        //     } else {
        //         console.error(error);
        //     }
        // }

        //    form.reset();
    };
    return (
        <form onSubmit={handleSubmit} className="delivery-form">
            <div className="customer-name-wrapper">
                <label htmlFor="customer-name">Customer name</label>
                <input
                    type="text"
                    name="customerName"
                    id="customer-name"
                    onChange={(e) => setData("customerName", e.target.value)}
                    value={data.customerName}
                />
                {errors.customerName && (
                    <p className="text-red-500">{errors.customerName}</p>
                )}
            </div>

            <div className="contact-name-wrapper">
                <label htmlFor="contact-name">Contact name</label>
                <input
                    type="text"
                    name="contactName"
                    id="contact-name"
                    value={data.contactName}
                    onChange={(e) => setData("contactName", e.target.value)}
                />
                {errors.contactName && (
                    <p className="text-red-500">{errors.contactName}</p>
                )}
            </div>

            <div className="telephone-number-wrapper">
                <label htmlFor="telephone-number">Telephone number</label>
                <input
                    type="tel"
                    name="telephoneNumber"
                    id="telephone-number"
                    onChange={(e) => setData("telephoneNumber", e.target.value)}
                    value={data.telephoneNumber}
                />
                {errors.telephoneNumber && (
                    <p className="text-red-500">{errors.telephoneNumber}</p>
                )}
            </div>

            <div className="cellphone-number-wrapper">
                <label htmlFor="cellphone-number">Cellphone number</label>
                <input
                    type="tel"
                    name="cellphoneNumber"
                    id="cellphone-number"
                    onChange={(e) => setData("cellphoneNumber", e.target.value)}
                    value={data.cellphoneNumber}
                />
                {errors.cellphoneNumber && (
                    <p className="text-red-500">{errors.cellphoneNumber}</p>
                )}
            </div>

            <div className="wholesaler-email-wrapper">
                <label htmlFor="wholesaler-email">Wholesaler email</label>
                <input
                    type="email"
                    name="wholesalerEmail"
                    id="wholesaler-email"
                    onChange={(e) => setData("wholesalerEmail", e.target.value)}
                    value={data.wholesalerEmail}
                />
                {errors.wholesalerEmail && (
                    <p className="text-red-500">{errors.wholesalerEmail}</p>
                )}
            </div>

            <div className="customer-email-wrapper">
                <label htmlFor="customer-email">Customer email</label>
                <input
                    type="email"
                    name="customerEmail"
                    id="customer-email"
                    onChange={(e) => setData("customerEmail", e.target.value)}
                    value={data.customerEmail}
                />
                {errors.customerEmail && (
                    <p className="text-red-500">{errors.customerEmail}</p>
                )}
            </div>

            <div className="address-wrapper">
                <label htmlFor="address">Address</label>
                <input
                    type="text"
                    name="address"
                    id="address"
                    onChange={(e) => setData("address", e.target.value)}
                    value={data.address}
                />
                {errors.address && (
                    <p className="text-red-500">{errors.address}</p>
                )}
            </div>

            <div className="city-wrapper">
                <label htmlFor="city">City</label>
                <input
                    type="text"
                    name="city"
                    id="city"
                    onChange={(e) => setData("city", e.target.value)}
                    value={data.city}
                />
                {errors.city && <p className="text-red-500">{errors.city}</p>}
            </div>

            <div className="state-wrapper">
                <label htmlFor="state">State</label>
                <input
                    type="text"
                    name="state"
                    id="state"
                    onChange={(e) => setData("state", e.target.value)}
                    value={data.state}
                />
                {errors.state && <p className="text-red-500">{errors.state}</p>}
            </div>

            <div className="zip-code-wrapper">
                <label htmlFor="zip-code">Zip code</label>
                <input
                    type="text"
                    name="zipCode"
                    id="zip-code"
                    onChange={(e) => setData("zipCode", e.target.value)}
                    value={data.zipCode}
                />
                {errors.zipCode && (
                    <p className="text-red-500">{errors.zipCode}</p>
                )}
            </div>

            <div className="delivery-type-wrapper">
                <label htmlFor="delivery-type">Delivery type</label>
                <select
                    name="deliveryType"
                    id="delivery-type"
                    onChange={(e) => setData("deliveryType", e.target.value)}
                    value={data.deliveryType}
                >
                    <option value="to dealer">To Dealer</option>
                    <option value="davidici final mile">
                        Davidici Final Mile
                    </option>
                    <option value="pick up">Pick up</option>
                </select>
                {errors.deliveryType && (
                    <p className="text-red-500">{errors.deliveryType}</p>
                )}
            </div>

            <div className="delivery-instruction-wrapper">
                <label htmlFor="delivery-instruction">
                    Delivery Instructions
                </label>
                <textarea
                    name="deliveryInstruction"
                    id="delivery-instruction"
                    cols={30}
                    rows={10}
                    onChange={(e) =>
                        setData("deliveryInstruction", e.target.value)
                    }
                    value={data.deliveryInstruction}
                ></textarea>
            </div>
            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    );
}

export default DeliveryForm;
