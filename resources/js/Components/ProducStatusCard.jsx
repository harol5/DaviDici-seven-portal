function ProducStatusCard({product}){
    return (
        <div className="product-wrapper">
            <span className="description">
                <h2>Description:</h2>
                <p>{product.item}</p>
            </span>
            <span className="size">
                <h2>Size:</h2>
                <p>{product.size}</p>
            </span>
            <span className="model">
                <h2>Model:</h2>
                <p>{product.model}</p>
            </span>
            <span className="sku">
                <h2>Sku:</h2>
                <p>{product.uscode}</p>
            </span>
            <span className="price">
                <h2>Price:</h2>
                <p>${product.price}</p>
            </span>
            <span className="qty">
                <h2>Qty:</h2>
                <p>{product.qty}</p>
            </span>
            <span className="total">
                <h2>Total:</h2>
                <p>${product.total}</p>
            </span>
            <span className="status">
                <h2>Status:</h2>
                <p>{product.status}</p>
            </span>
        </div>
    );
}

export default ProducStatusCard;