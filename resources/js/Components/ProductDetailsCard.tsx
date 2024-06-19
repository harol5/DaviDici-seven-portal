import Modal from "./Modal";
import { useMemo, useRef, useState } from "react";
import type { Product as ProductModel } from "../Models/Product";
import { collections } from "../Models/Collections";

interface ProductDetailsCardProps {
    product: ProductModel;
    numOfProducts: number;
    modelsAvailable: { set: Set<string>; arr: string[] };
    handleQty: (value: string, product: ProductModel) => void;
    handleNote: (
        sku: string,
        lineNum: number,
        note: string,
        handleCloseModal: () => void
    ) => void;
    handleDelete: (product: ProductModel, handleCloseModal: () => void) => void;
    handleModel: (sku: string, lineNum: number, model: string) => void;
    isPaymentSubmitted: boolean;
    isSubmitedDate: boolean;
}

function ProductDetailsCard({
    product,
    numOfProducts,
    modelsAvailable,
    handleQty,
    handleNote,
    handleDelete,
    handleModel,
    isPaymentSubmitted,
    isSubmitedDate,
}: ProductDetailsCardProps) {
    const isModelValid = useMemo(
        () => collections.includes(product.model),
        [product.model]
    );
    const isPaymentORSubmittedDate = isPaymentSubmitted || isSubmitedDate;
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [crrModalContent, setCrrModalContent] = useState<
        "removeModal" | "addNote"
    >();
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = (contentModal: "removeModal" | "addNote") => {
        setOpenModal(true);
        setCrrModalContent(contentModal);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <>
            <section className="product-wrapper product-details-card">
                <div
                    className={
                        isPaymentSubmitted || isSubmitedDate
                            ? "product-info-wrapper basis-[100%]"
                            : "product-info-wrapper basis-[90%] mr-1"
                    }
                >
                    <header>
                        <h2 className="description">Description:</h2>
                        <h2 className="color">Color:</h2>
                        <h2 className="size">Size:</h2>
                        <h2 className="model">Model:</h2>
                        <h2 className="sku">Sku:</h2>
                        <h2 className="price">Price:</h2>
                        <h2 className="qty">Qty:</h2>
                        <h2 className="total">Total:</h2>
                    </header>
                    <section>
                        <p className="description">{product.item}</p>
                        <p className="color">{product.color}</p>
                        <p className="size">{product.size}</p>
                        <span className="model">
                            {isModelValid && <p>{product.model}</p>}
                            {!isModelValid && (
                                <select
                                    name="model"
                                    id=""
                                    defaultValue="none"
                                    onChange={(e) =>
                                        handleModel(
                                            product.uscode,
                                            product.linenum,
                                            e.currentTarget.value
                                        )
                                    }
                                >
                                    <option value="none"></option>
                                    {modelsAvailable.arr.map((model, index) => (
                                        <option key={index} value={model}>
                                            {model}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </span>
                        <p className="sku">{product.uscode}</p>
                        <p className="price">${product.price}</p>
                        <span className="qty">
                            <input
                                type="number"
                                name="qty"
                                defaultValue={product.qty}
                                min={"1"}
                                max={"50"}
                                onChange={(e) =>
                                    handleQty(e.target.value, product)
                                }
                                readOnly={isPaymentSubmitted || isSubmitedDate}
                            />
                        </span>
                        <p className="total">${product.total}</p>
                    </section>
                </div>
                {!isPaymentORSubmittedDate && (
                    <div className="basis-[10%] flex flex-col gap-3 px-1">
                        <button
                            className="add-note-button rounded border px-2 py-1"
                            onClick={() => handleOpenModal("addNote")}
                            disabled={isPaymentSubmitted || isSubmitedDate}
                        >
                            add/see note
                        </button>
                        <button
                            className="remove-product-button rounded border px-4 py-1"
                            onClick={() => handleOpenModal("removeModal")}
                            disabled={isPaymentSubmitted || isSubmitedDate}
                        >
                            remove
                        </button>
                    </div>
                )}
            </section>
            <Modal
                show={openModal}
                maxWidth="w-3/12"
                onClose={handleCloseModal}
            >
                {crrModalContent === "removeModal" && (
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
                        <section className="flex justify-center my-4 gap-4">
                            <button
                                className="rounded border shadow-sm shadow-gray-950 px-4 py-1 transition-shadow hover:shadow-none text-sm"
                                onClick={handleCloseModal}
                            >
                                cancel
                            </button>
                            <button
                                className="rounded border shadow-sm shadow-gray-950 px-4 py-1 transition-shadow hover:shadow-none bg-red-500 hover:text-white text-sm"
                                onClick={() => {
                                    handleDelete(product, handleCloseModal);
                                }}
                            >
                                confirm
                            </button>
                        </section>
                    </section>
                )}

                {crrModalContent === "addNote" && (
                    <section className="m-8 text-center">
                        <p className=" my-4">{product.item}</p>
                        <textarea
                            className="border w-[100%] p-1"
                            name="notes"
                            id=""
                            ref={textareaRef}
                            cols={30}
                            rows={5}
                            defaultValue={product.notes}
                            readOnly={isPaymentSubmitted || isSubmitedDate}
                        ></textarea>
                        <section className="flex justify-center my-4 gap-4">
                            <button
                                className="rounded border shadow-sm shadow-gray-950 px-4 py-1 transition-shadow hover:shadow-none text-sm"
                                onClick={handleCloseModal}
                            >
                                cancel
                            </button>
                            <button
                                className="rounded border shadow-sm shadow-gray-950 px-4 py-1 transition-shadow hover:shadow-none bg-green-500 hover:text-white text-sm"
                                onClick={() => {
                                    handleNote(
                                        product.uscode,
                                        product.linenum,
                                        textareaRef.current?.value!,
                                        handleCloseModal
                                    );
                                }}
                            >
                                confirm
                            </button>
                        </section>
                    </section>
                )}
            </Modal>
        </>
    );
}

export default ProductDetailsCard;
