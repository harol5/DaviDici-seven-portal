import OrderLayout from "../../Layouts/OrderLayout";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import Modal from "../../Components/Modal";
import ItemStatusCard from "../../Components/ItemStatusCard";
import { useState } from "react";

function OrderOverview({order,items}){
    const [openModal,setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    }

    return (
        <UserAuthenticatedLayout crrPage="orders">
            <OrderLayout order={order} crrOrderOption="overview">
                <section className="overview-wrapper">
                    <section className="order-details-wrapper">
                        <span>
                            <button onClick={handleOpenModal}>Check Status</button>
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
                    </section>
                    <section className="actions-pending-wrapper">
                        <h1>Actions Pending</h1>
                        <ul>
                            <li>fill out delivery</li>
                            <li>fill out payment details</li>
                            <li>aprrove order</li>
                        </ul>
                    </section>
                </section>
            </OrderLayout>
            <Modal show={openModal} onClose={handleCloseModal}>
                <h1>Order Status</h1>
                <section>
                    {items.map(item => <ItemStatusCard key={item.linenum} item={item} />)}
                </section>            
                <button onClick={handleCloseModal}>Close</button>
            </Modal>
        </UserAuthenticatedLayout>
    ); 
}

export default OrderOverview;