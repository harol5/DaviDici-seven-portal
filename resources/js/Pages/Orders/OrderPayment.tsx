import OrderLayout from "../../Layouts/OrderLayout";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import type { Order as OrderModel } from "../../Models/Order";

interface OrderPaymentProps {
    order: OrderModel;
}
function OrderPayment({ order }: OrderPaymentProps) {
    return (
        <UserAuthenticatedLayout crrPage="orders">
            <OrderLayout order={order} crrOrderOption="payment">
                <h1>Payment</h1>
            </OrderLayout>
        </UserAuthenticatedLayout>
    );
}

export default OrderPayment;
