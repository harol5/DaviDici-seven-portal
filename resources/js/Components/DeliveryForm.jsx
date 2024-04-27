import axios from "axios";

function DeliveryForm({ order }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        console.log(data);

        axios
            .post(`/orders/${order.ordernum}/products/delivery`, data)
            .then((res) => console.log(res))
            .catch((err) => console.log(err));

        //    form.reset();
    };
    return (
        <form onSubmit={handleSubmit} className="delivery-form">
            <div className="customer-name-wrapper">
                <label htmlFor="customer-name">Customer name</label>
                <input type="text" name="customerName" id="customer-name" />
            </div>

            <div className="contact-name-wrapper">
                <label htmlFor="contact-name">Contact name</label>
                <input type="text" name="contactName" id="contact-name" />
            </div>

            <div className="telephone-number-wrapper">
                <label htmlFor="telephone-number">Telephone number</label>
                <input
                    type="tel"
                    name="telephoneNumber"
                    id="telephone-number"
                />
            </div>

            <div className="cellphone-number-wrapper">
                <label htmlFor="cellphone-number">Cellphone number</label>
                <input
                    type="tel"
                    name="cellphoneNumber"
                    id="cellphone-number"
                />
            </div>

            <div className="wholesaler-email-wrapper">
                <label htmlFor="wholesaler-email">Wholesaler email</label>
                <input
                    type="email"
                    name="wholesalerEmail"
                    id="wholesaler-email"
                />
            </div>

            <div className="customer-email-wrapper">
                <label htmlFor="customer-email">Customer email</label>
                <input type="email" name="customerEmail" id="customer-email" />
            </div>

            <div className="address-wrapper">
                <label htmlFor="address">Address</label>
                <input type="text" name="address" id="address" />
            </div>

            <div className="city-wrapper">
                <label htmlFor="city">City</label>
                <input type="text" name="city" id="city" />
            </div>

            <div className="state-wrapper">
                <label htmlFor="state">State</label>
                <input type="text" name="state" id="state" />
            </div>

            <div className="zip-code-wrapper">
                <label htmlFor="zip-code">Zip code</label>
                <input type="text" name="zipCode" id="zip-code" />
            </div>

            <div className="delivery-type-wrapper">
                <label htmlFor="delivery-type">Delivery type</label>
                <select name="deliveryType" id="delivery-type">
                    <option value="to dealer">To Dealer</option>
                    <option value="davidici final mile">
                        Davidici Final Mile
                    </option>
                    <option value="pick up">Pick up</option>
                </select>
            </div>

            <div className="delivery-instruction-wrapper">
                <label htmlFor="delivery-instruction">
                    Delivery Instructions
                </label>
                <textarea
                    name="deliveryInstruction"
                    id="delivery-instruction"
                    cols="30"
                    rows="10"
                ></textarea>
            </div>

            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    );
}

export default DeliveryForm;
