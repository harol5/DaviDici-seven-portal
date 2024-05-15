import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";

function OrderNumber({
    nextOrderNumber,
    products,
}: {
    nextOrderNumber: any;
    products: any;
}) {
    console.log(nextOrderNumber);
    console.log(products);
    return (
        <UserAuthenticatedLayout crrPage="orders">
            {JSON.stringify(products, null, 1)}
            <button
                onClick={() =>
                    console.log(
                        "cleint confirmed order number now sending products and so# to create the order in foxpro"
                    )
                }
            >
                confirm order number.
            </button>
        </UserAuthenticatedLayout>
    );
}

export default OrderNumber;
