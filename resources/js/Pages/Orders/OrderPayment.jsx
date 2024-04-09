import OrderLayout from "../../Layouts/OrderLayout";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";

function OrderPayment({ order }) {
    return (
        <UserAuthenticatedLayout crrPage="orders">
            <OrderLayout order={order} crrOrderOption="payment">
                <h1>Payment</h1>
            </OrderLayout>
        </UserAuthenticatedLayout>
    );
}

export default OrderPayment;
