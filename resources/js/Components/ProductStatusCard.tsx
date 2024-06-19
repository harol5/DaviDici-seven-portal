import type { Product as ProductModel } from "../Models/Product";

interface ProductStatusProps {
    product: ProductModel;
}

function ProductStatusCard({ product }: ProductStatusProps) {
    return (
        <div className="product-wrapper product-status-card">
            <header>
                <h2 className="description">Description:</h2>
                <h2 className="size">Size:</h2>
                <h2 className="model">Model:</h2>
                <h2 className="sku">Sku:</h2>
                <h2 className="price">Price:</h2>
                <h2 className="qty">Qty:</h2>
                <h2 className="total">Total:</h2>
                <h2 className="status">Status:</h2>
            </header>
            <section>
                <p className="description">{product.item}</p>
                <p className="size">{product.size}</p>
                <p className="model">{product.model}</p>
                <p className="sku">{product.uscode}</p>
                <p className="price">${product.price}</p>
                <p className="qty">{product.qty}</p>
                <p className="total">${product.total}</p>
                <p className="status">{product.status}</p>
            </section>
        </div>
    );
}

export default ProductStatusCard;
