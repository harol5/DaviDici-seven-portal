import axios from "axios";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function ProductDetailsCard({order ,item, handleGrandTotal}){     
    const [product,setProduct] = useState(item);
    
    const handleQty = (value) => {
        const newQty = Number.parseInt(value);

        if(newQty < 1 || newQty > 50){
            toast.error("Quantity can not be 0 or greater than 50");
        }else{
            const updatedProduct = {...product, qty:newQty,};
            axios.post(`/orders/${order.ordernum}/products/update`,updatedProduct)
            .then(({data}) =>{                
                // "Can not update -- this item already on PO"? | "Updated Info"
                if(data.Result === "Updated Info"){
                    const total = newQty * product.price;
                    const totalFormatted = Math.round((total + Number.EPSILON) * 100) / 100;      
                    
                    setProduct( prev => ({...prev, qty:newQty, total: totalFormatted }));      
                    handleGrandTotal(product,{...updatedProduct, total: totalFormatted});                          
                }else{
                    toast.error("Internal Error!! Please contact support.");
                }                
            })
            .catch(err=> console.log(err));
        }
    }

    const handleDelete = () => {
        console.log("on delete:", product);

        axios.post(`/orders/${order.ordernum}/products/delete`,product)
            .then(({data}) =>{                
                // "Updated Info" | "Can not delete -- already on PO"? | "Line Number does not match item"?
                console.log(data);
            })
            .catch(err=> console.log(err));

        // ------------ write this as helper func.
        // const subtotal = order.subtotal - product.total;
        // const subTotalFormatted = Math.round((subtotal + Number.EPSILON) * 100) / 100;

        // const grandTotal = subTotalFormatted - order.totcredit;
        // const grandTotalFormatted = Math.round((grandTotal + Number.EPSILON) * 100) / 100;

        // const updatedOrder = {...order, subtotal: subTotalFormatted, total: grandTotalFormatted};
        // --------------------------------------            
    }

    return (
        <>
            <section className="product-wrapper product-details-card">
                <div className="basis-[90%]">
                    <header>
                        <h2 className="description">Description:</h2>
                        <h2 className="size">Size:</h2>
                        <h2 className="model">Model:</h2>
                        <h2 className="sku">Sku:</h2>
                        <h2 className="price">Price:</h2>
                        <h2 className="qty">Qty:</h2>
                        <h2 className="total">Total:</h2>                        
                    </header>
                    <section>
                        <p className="description">{product.item}</p>
                        <p className="size">{product.size}</p>
                        <p className="model">{product.model}</p>
                        <p className="sku">{product.uscode}</p>
                        <p className="price">${product.price}</p>
                        <span className="qty">
                            <input type="number" name="qty" value={product.qty} min={1} max={50} onChange={(e)=>handleQty(e.target.value)}/>
                        </span>
                        <p className="total">${product.total}</p>                        
                    </section>
                </div>
                <div className="basis-[10%]">
                    <button className="delete-button" onClick={handleDelete}>Delete</button>
                </div>
            </section>
            <ToastContainer />
        </>
    );
}

export default ProductDetailsCard;