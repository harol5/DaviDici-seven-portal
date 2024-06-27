import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import User from "../../Models/User";
import type { ProductInventory } from "../../Models/Product";

interface ProductsAvailableProps {
    auth: User;
    products: ProductInventory[];
}

function ProductsAvailable({ auth, products }: ProductsAvailableProps) {
    const collections = new Map();
    const sizes = new Map();
    products.forEach((product) => {
        if (!collections.has(product.model)) collections.set(product.model, []);
        collections.get(product.model).push(product);

        if (!sizes.has(product.size)) sizes.set(product.size, []);
        sizes.get(product.size).push(product);
    });
    console.log(collections);
    console.log(sizes);

    return (
        <UserAuthenticatedLayout auth={auth} crrPage="orders">
            <div className="main-content-wrapper">
                <h1>express program</h1>
            </div>
        </UserAuthenticatedLayout>
    );
}

export default ProductsAvailable;
