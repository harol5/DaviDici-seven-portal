import { FormEvent, ReactNode, useState } from "react";
import Modal from "../Components/Modal";
import { useForm } from "@inertiajs/react";

interface InviteFormProps {
    openModal: boolean;
    handleCloseModal: () => void;
}

function InviteForm({ openModal, handleCloseModal }: InviteFormProps) {
    const { data, setData, post, errors, reset } = useForm({
        name: "",
        email: "",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log(data);
        post("/users/invite", {
            onSuccess: () => {
                reset();
                handleCloseModal();
            },
        });
    };

    return (
        <Modal show={openModal} onClose={handleCloseModal} maxWidth="w-3/6">
            <h1 className="order-status-title text-lg">Invite New Customers</h1>
            <section className="shadow-gray-300 rounded-md mx-16">
                <form onSubmit={handleSubmit} id="invitation-form">
                    <div className="mb-6">
                        <label
                            htmlFor="name"
                            className="inline-block text-lg mb-2"
                        >
                            First Name
                        </label>
                        <input
                            type="text"
                            className="border border-gray-200 rounded p-2 w-full"
                            name="firstName"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                        />

                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="email"
                            className="inline-block text-lg mb-2"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            className="border border-gray-200 rounded p-2 w-full"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                        />

                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>
                </form>
            </section>
            <section className="flex">
                <button
                    type="submit"
                    form="invitation-form"
                    className="close-modal-button rounded border shadow-sm shadow-gray-950 px-5 py-2 transition-shadow hover:shadow-none"
                >
                    send
                </button>
                <button
                    className="close-modal-button rounded border shadow-sm shadow-gray-950 px-5 py-2 transition-shadow hover:shadow-none"
                    onClick={handleCloseModal}
                >
                    cancel
                </button>
            </section>
        </Modal>
    );
}

export default InviteForm;
