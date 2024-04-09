import { Link } from '@inertiajs/react'

function Order({order}){
    return (
        <div className="order-container" id="{{$order['ordernum']}}">
            <div className="order">
                <h2>{order.ordernum}</h2>
                <div className="order-details-wrapper">
                    <span>
                        <h2>Status:</h2>
                        <p>{order.status}</p>
                    </span>
                    <span>
                        <h2>Sub-total:</h2>
                        <p>${order.subtotal}</p>
                    </span>
                    <span>
                        <h2>Order date:</h2>
                        <p>{order.orderdate}</p>
                    </span>
                    <span>
                        <h2>Total Credit:</h2>
                        <p>${order.totcredit}</p>
                    </span>
                    <span>
                        <h2>Submitted date:</h2>
                        <p>{order.submitted}</p>
                    </span>
                    <span>
                        <h2>Total:</h2>
                        <p>${order.total}</p>
                    </span>
                </div>
                <Link href={`/orders/${order.ordernum}/overview`}>View Order</Link>
            </div>
        </div>
    );
}

export default Order;