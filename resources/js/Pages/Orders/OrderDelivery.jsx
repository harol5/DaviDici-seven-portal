import OrderLayout from "../../Layouts/OrderLayout";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import ProductDeliveryCard from "../../Components/ProductDeliveryCard";
import DeliveryForm from "../../Components/DeliveryForm";

function OrderDelivery({ order, products }) {
    return (
        <UserAuthenticatedLayout crrPage="orders">
            <OrderLayout order={order} crrOrderOption="delivery">
                <h1>Delivery</h1>
                <section className="products-delivery-wrapper">
                    {products.map((product) => (
                        <ProductDeliveryCard
                            key={product.linenum}
                            product={product}
                        />
                    ))}
                </section>
                <DeliveryForm order={order} />
            </OrderLayout>
        </UserAuthenticatedLayout>
    );
}

export default OrderDelivery;
