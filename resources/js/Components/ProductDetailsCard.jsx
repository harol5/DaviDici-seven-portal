import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductDetailsCard({order ,product, handleDelete}){
    const [qty,setQty] = useState(product.qty);

    const handleQty = (value) => {
        const updatedProduct = {...product, qty: value};
        console.log(value);
        
        if(value < 1 || value > 50){
            toast.error("Quantity can not be 0 or greater than 50");
        }else{
            axios.post(`/orders/${order.ordernum}/products/update`,updatedProduct)
            .then(res => setQty(value))
            .catch(err=> console.log(err));
        }
    }

    return (
        <>
            <section className="product-wrapper product-details">
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
                            <input type="number" name="qty" value={qty} min={1} max={50} onChange={(e)=>handleQty(e.target.value)}/>
                        </span>
                        <p className="total">${product.total}</p>                        
                    </section>
                </div>
                <div className="basis-[10%]">
                    <button className="delete-button" onClick={()=>handleDelete(product)}>Delete</button>
                </div>
            </section>
            <ToastContainer />
        </>
    );
}

export default ProductDetailsCard;