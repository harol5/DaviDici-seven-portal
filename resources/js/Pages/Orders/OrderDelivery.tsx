import OrderLayout from "../../Layouts/OrderLayout";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import ProductDeliveryCard from "../../Components/ProductDeliveryCard";
import DeliveryForm from "../../Components/DeliveryForm";
import type { Order as OrderModel } from "../../Models/Order";
import type { Product as ProductModel } from "../../Models/Product";
import type { DeliveryFoxpro as DeliveryInfoModel } from "../../Models/Delivery";
import { useMemo, useState } from "react";
import User from "../../Models/User";

interface OrderDeliveryProps {
    auth: User;
    rawOrder: OrderModel;
    rawProducts: ProductModel[];
    deliveryInfoByProd: DeliveryInfoModel[];
}

function OrderDelivery({
    auth,
    rawOrder,
    rawProducts,
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

    const products = useMemo(() => {
        return rawProducts.filter(
            (product) => product.item !== "3% Credit Card Charge"
        );
    }, [rawProducts]);

    const handleSetOrder = (
        crrDeliveryType: string,
        newDeliveryFee: string
    ) => {
        setOrder((prev) => {
            const oldDeliveryFee =
                crrDeliveryType === "TO DEALER"
                    ? 50
                    : crrDeliveryType === "DAVIDICI FINAL MILE"
                    ? 75
                    : 0;

            const deliveryFee =
                newDeliveryFee === "TO DEALER"
                    ? 50
                    : newDeliveryFee === "DAVIDICI FINAL MILE"
                    ? 75
                    : 0;

            const newTotal = prev.total - oldDeliveryFee + deliveryFee;

            return { ...prev, total: newTotal, subtotal: newTotal };
        });
    };

    return (
        <UserAuthenticatedLayout auth={auth} crrPage="orders">
            <OrderLayout order={order} crrOrderOption="delivery">
                <section className="products-delivery-wrapper">
                    <p className="horizontally-message">
                        *please flip your phone horizontally for a better
                        experience
                    </p>
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
