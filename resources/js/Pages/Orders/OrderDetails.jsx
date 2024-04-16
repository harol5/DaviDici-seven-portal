import OrderLayout from "../../Layouts/OrderLayout";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import ProductDetailsCard from "../../Components/ProductDetailsCard";
import axios from "axios";

function OrderDetails({order,products}) {
    const handleDelete = (product) => {
        console.log("delete button:", product);
        axios.post(`/orders/${order.ordernum}/products/delete`,product)
    }

    return (
        <UserAuthenticatedLayout crrPage="orders">
            <OrderLayout order={order} crrOrderOption="details">
                <section className="products-details-wrapper">
                    {products.map(product => <ProductDetailsCard key={product.linenum} order={order} product={product} handleDelete={handleDelete} />)}
                </section>
                <section>
                    <span>
                        <h2>Sub-total:</h2>
                        <p>${order.subtotal}</p>
                    </span>
                    <span>
                        <h2>Total Credit:</h2>
                        <p>${order.totcredit}</p>
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
