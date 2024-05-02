import OrderLayout from "../../Layouts/OrderLayout";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import ProductDeliveryCard from "../../Components/ProductDeliveryCard";
import DeliveryForm from "../../Components/DeliveryForm";
import type { Order as OrderModel } from "../../Models/Order";
import type { Product as ProductModel } from "../../Models/Product";
interface OrderDeliveryProps {
    order: OrderModel;
    products: ProductModel[];
    deliveryInfo: any;
}

function OrderDelivery({ order, products, deliveryInfo }: OrderDeliveryProps) {
    console.log("delivery info from fox pro:", deliveryInfo);
    return (
        <UserAuthenticatedLayout crrPage="orders">
            <OrderLayout order={order} crrOrderOption="delivery">
                <section className="products-delivery-wrapper">
                    {products.map((product: ProductModel) => (
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
