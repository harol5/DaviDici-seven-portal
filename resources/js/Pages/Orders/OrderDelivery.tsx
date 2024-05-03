import OrderLayout from "../../Layouts/OrderLayout";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import ProductDeliveryCard from "../../Components/ProductDeliveryCard";
import DeliveryForm from "../../Components/DeliveryForm";
import type { Order as OrderModel } from "../../Models/Order";
import type { Product as ProductModel } from "../../Models/Product";
import type { DeliveryFoxpro } from "../../Models/Delivery";
import { useState } from "react";
interface OrderDeliveryProps {
    rawOrder: OrderModel;
    products: ProductModel[];
    deliveryInfoByProd: DeliveryFoxpro[];
}

function OrderDelivery({
    rawOrder,
    products,
    deliveryInfoByProd,
}: OrderDeliveryProps) {
    //--TODO: this could be acustom hook? same logic on orderDetails component
    const formatOrder = () => {
        const subtotal = Number.parseFloat(rawOrder.subtotal as string);
        const totcredit = Number.parseFloat(rawOrder.totcredit as string);
        const total = Number.parseFloat(rawOrder.total as string);

        return { ...rawOrder, subtotal, totcredit, total };
    };
    const [order, setOrder] = useState(formatOrder);
    //-------------------------------------------------------

    const handleSetOrder = (deliveryFee: number) => {
        console.log("setOrder called!!:", deliveryFee);
        setOrder((prev) => ({ ...prev, total: prev.total + deliveryFee }));
    };
    console.log("delivery page - order state:", order);

    return (
        <UserAuthenticatedLayout crrPage="orders">
            <OrderLayout order={order} crrOrderOption="delivery">
                <section className="products-delivery-wrapper">
                    {products.map((product: ProductModel, index: number) => (
                        <ProductDeliveryCard
                            key={product.linenum}
                            product={product}
                            productDeliStatus={deliveryInfoByProd[index]}
                        />
                    ))}
                </section>
                <DeliveryForm
                    order={order}
                    deliveryInfo={deliveryInfoByProd[0]} // Getting only the info.
                    setDeliveryFee={handleSetOrder}
                />
            </OrderLayout>
        </UserAuthenticatedLayout>
    );
}

export default OrderDelivery;
