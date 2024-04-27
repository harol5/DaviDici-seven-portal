function ProductDeliveryCard({ product }) {
    return (
        <div className="product-wrapper product-delivery-card">
            <header>
                <h2 className="status">Deliver By:</h2>
                <h2 className="description">Description:</h2>
                <h2 className="size">Size:</h2>
                <h2 className="model">Model:</h2>
                <h2 className="sku">Sku:</h2>
                <h2 className="qty">Qty:</h2>
            </header>
            <section>
                <p className="status">{product.status}</p>
                <p className="description">{product.item}</p>
                <p className="size">{product.size}</p>
                <p className="model">{product.model}</p>
                <p className="sku">{product.uscode}</p>
                <p className="qty">{product.qty}</p>
            </section>
        </div>
    );
}

export default ProductDeliveryCard;
