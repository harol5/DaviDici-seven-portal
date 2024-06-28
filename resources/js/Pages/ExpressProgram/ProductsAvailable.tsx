import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import User from "../../Models/User";
import type { ProductInventory } from "../../Models/Product";

interface ProductsAvailableProps {
    auth: User;
    products: ProductInventory[];
}

function ProductsAvailable({ auth, products }: ProductsAvailableProps) {
    const sizesMap = new Map();
    products.forEach((product) => {
        if (!sizesMap.has(product.size)) sizesMap.set(product.size, new Map());
        const modelsMap = sizesMap.get(product.size);
        if (!modelsMap.has(product.model)) modelsMap.set(product.model, []);
        modelsMap.get(product.model).push(product);
    });

    console.log(sizesMap);
    console.log(Object.fromEntries(sizesMap.entries()));
    console.log(Array.from(sizesMap.entries()));
    console.log(products);
    return (
        <UserAuthenticatedLayout auth={auth} crrPage="orders">
            <div className="main-content-wrapper">
                <h1>express program</h1>
            </div>
        </UserAuthenticatedLayout>
    );
}

export default ProductsAvailable;
