import OrderLayout from "../../Layouts/OrderLayout";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import ProductDetailsCard from "../../Components/ProductDetailsCard";
import axios from "axios";
import { useState } from "react";

function OrderDetails({rawOrder,rawProducts}) {
    
    const sanitizingOrder = () => {
        const subtotal = Number.parseFloat(rawOrder.subtotal);
        const totcredit = Number.parseFloat(rawOrder.totcredit);
        const total = Number.parseFloat(rawOrder.total);

        return {...rawOrder, subtotal, totcredit, total };
    }

    const [order, setOrder] = useState(sanitizingOrder);
    const [products, setProducts] = useState(rawProducts);
        
    const handleGrandTotal = (outdatedProduct,updatedProduct) => {        
        //cal new sub total.
        const subtotal = (order.subtotal - outdatedProduct.total) + updatedProduct.total;
        const subTotalFormatted = Math.round((subtotal + Number.EPSILON) * 100) / 100;

        const grandTotal = subTotalFormatted - order.totcredit;
        const grandTotalFormatted = Math.round((grandTotal + Number.EPSILON) * 100) / 100;
    
        setOrder( prev => ({...prev, subtotal: subTotalFormatted, total: grandTotalFormatted}));
    }

    const handleProducts = (value,product) => {
                
    }

    return (
        <UserAuthenticatedLayout crrPage="orders">
            <OrderLayout order={order} crrOrderOption="details">
                <section className="products-details-wrapper">
                    {products.map(product => <ProductDetailsCard key={product.linenum} order={order} item={product} handleGrandTotal={handleGrandTotal}/>)}
                </section>
                <section>
                    <span>
                        <h2>Sub-total:</h2>
                        <p>${order.subtotal}</p>
                    </span>
                    <span>
                        <h2>Total Credit:</h2>
                        <p>${order.credit}</p>
                    </span>
                    <span>
                        <h2>Total:</h2>
                        <p>${order.total}</p>
                    </span>
                </section>
            </OrderLayout>
        </UserAuthenticatedLayout>
    );
}

export default OrderDetails;
