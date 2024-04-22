import OrderLayout from "../../Layouts/OrderLayout";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import ProductDetailsCard from "../../Components/ProductDetailsCard";
import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { router } from "@inertiajs/react";


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

    const handleQty = (value,product) => {
        const newQty = Number.parseInt(value);

        if(newQty < 1 || newQty > 50){
            toast.error("Quantity can not be 0 or greater than 50");
        }else{
            const updatedQty = {...product, qty:newQty,};                    
            axios.post(`/orders/${order.ordernum}/products/update`,updatedQty)
            .then(({data}) =>{         
                // "Can not update -- this item already on PO"? | "Updated Info"
                if(data.Result === "Updated Info"){
                    const total = newQty * product.price;
                    const totalFormatted = Math.round((total + Number.EPSILON) * 100) / 100;            

                    const filteredProducts = products.filter( p => p.uscode !== product.uscode);
                    const updatedProduct = {...updatedQty, total: totalFormatted};

                    const sortedProducts = [...filteredProducts, updatedProduct].sort((a,b) => a.linenum - b.linenum);
                    setProducts(sortedProducts);
                    handleGrandTotal(product,updatedProduct);
                }       
            })
            .catch(err=> console.log(err));
        }
    }

    const handleDelete = (product) => {
        
        if(products.length === 1){
            router.post(`/orders/${order.ordernum}/products/delete`,{product, numOfProduct: products.length});
        }else{
            axios.post(`/orders/${order.ordernum}/products/delete`,{product, numOfProduct: products.length})
            .then(({data}) => {

                // "Updated Info" | "Can not delete -- already on PO"? | "Line Number does not match item"?
                console.log(data);
                if(data.Result === "Updated Info"){
                    const filteredProducts = products.filter( p => p.uscode !== product.uscode);
                    const sortedProducts = filteredProducts.sort((a,b) => a.linenum - b.linenum);
                    setProducts(sortedProducts);
    
                    // ------------ write this as helper func.
                    const subtotal = order.subtotal - product.total;
                    const subTotalFormatted = Math.round((subtotal + Number.EPSILON) * 100) / 100;
    
                    const grandTotal = subTotalFormatted - order.totcredit;
                    const grandTotalFormatted = Math.round((grandTotal + Number.EPSILON) * 100) / 100;
    
                    setOrder( prev => ({...prev, subtotal: subTotalFormatted, total: grandTotalFormatted}));                    
                    // -------------------------------------- 
                }
            })
            .catch(err=> console.log(err));            
        }

    }

    return (
        <UserAuthenticatedLayout crrPage="orders">
            <OrderLayout order={order} crrOrderOption="details">
                <section className="products-details-wrapper">
                    {products.map(product => <ProductDetailsCard key={product.linenum} product={product} numOfProducts={products.length} handleQty={handleQty} handleDelete={handleDelete}/>)}
                </section>
                <section className="flex">
                    <div className="mr-4">
                        <h2>Sub-total:</h2>
                        <h2>Total Credit:</h2>
                        <h2>Total:</h2>
                    </div>
                    <div>
                        <p>${order.subtotal}</p>
                        <p>${order.credit}</p>
                        <p className="border-t border-black">${order.total}</p>
                    </div>                    
                </section>
            </OrderLayout>
            <ToastContainer />            
        </UserAuthenticatedLayout>
    );
}

export default OrderDetails;
