import Modal from "./Modal";
import { useState } from "react";
import type { Product as ProductModel } from "../Models/Product";

interface ProductDetailsCardProps {
    product: ProductModel;
    numOfProducts: number;
    handleQty: (value: string, product: ProductModel) => void;
    handleDelete: (product: ProductModel) => void;
}

function ProductDetailsCard({
    product,
    numOfProducts,
    handleQty,
    handleDelete,
}: ProductDetailsCardProps) {
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };
    return (
        <>
            <section className="product-wrapper product-details-card">
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
                            <input
                                type="number"
                                name="qty"
                                defaultValue={product.qty}
                                min={1}
                                max={50}
                                onChange={(e) =>
                                    handleQty(e.target.value, product)
                                }
                            />
                        </span>
                        <p className="total">${product.total}</p>
                    </section>
                </div>
                <div className="basis-[10%]">
                    <button className="delete-button" onClick={handleOpenModal}>
                        Delete
                    </button>
                </div>
            </section>
            <Modal
                show={openModal}
                maxWidth="w-3/12"
                onClose={handleCloseModal}
            >
                <section className="m-8 text-center">
                    {numOfProducts === 1 && (
                        <p className="text-orange-300 font-bold">
                            There is only one product on your order, if you
                            remove it, your order will be delete.
                        </p>
                    )}
                    <p className=" my-4">
                        are you sure you want to remove this product?
                    </p>
                    <section className="flex justify-center my-4">
                        <button
                            className="bg-white py-1 px-4 mx-2 border border-black rounded"
                            onClick={handleCloseModal}
                        >
                            cancel
                        </button>
                        <button
                            className="bg-red-500 py-1 px-4 mx-2 border border-black rounded"
                            onClick={() => handleDelete(product)}
                        >
                            confirm
                        </button>
                    </section>
                </section>
            </Modal>
        </>
    );
}

export default ProductDetailsCard;
