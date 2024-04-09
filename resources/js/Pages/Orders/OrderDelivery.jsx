import OrderLayout from "../../Layouts/OrderLayout";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";

function OrderDelivery({ order }) {
    return (
        <UserAuthenticatedLayout crrPage="orders">
            <OrderLayout order={order} crrOrderOption="delivery">
                <h1>Delivery</h1>
            </OrderLayout>
        </UserAuthenticatedLayout>
    );
}

export default OrderDelivery;
