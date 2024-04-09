import OrderLayout from "../../Layouts/OrderLayout";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";

function OrderDetails({ order }) {
    return (
        <UserAuthenticatedLayout crrPage="orders">
            <OrderLayout order={order} crrOrderOption="details">
                <h1>Details</h1>
            </OrderLayout>
        </UserAuthenticatedLayout>
    );
}

export default OrderDetails;
