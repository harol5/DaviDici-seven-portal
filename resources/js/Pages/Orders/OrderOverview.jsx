import OrderLayout from "../../Layouts/OrderLayout";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";

function OrderOverview({order}){
    return (
        <UserAuthenticatedLayout crrPage="orders">
            <OrderLayout order={order} crrOrderOption="overview">
                <h1>Overview</h1>
            </OrderLayout>
        </UserAuthenticatedLayout>
    ); 
}

export default OrderOverview;