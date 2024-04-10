function ItemStatusCard({item}){
    return (
        <div className="flex">
            <span>
                <h2>Status:</h2>
                <p>{item.item}</p>
            </span>
            <span>
                <h2>Sub-total:</h2>
                <p>${item.size}</p>
            </span>
            <span>
                <h2>Order date:</h2>
                <p>{item.model}</p>
            </span>
            <span>
                <h2>Total Credit:</h2>
                <p>${item.uscode}</p>
            </span>
            <span>
                <h2>Submitted date:</h2>
                <p>{item.price}</p>
            </span>
            <span>
                <h2>Total:</h2>
                <p>${item.qty}</p>
            </span>
            <span>
                <h2>Total:</h2>
                <p>${item.total}</p>
            </span>
            <span>
                <h2>Total:</h2>
                <p>${item.status}</p>
            </span>
        </div>
    );
}

export default ItemStatusCard;