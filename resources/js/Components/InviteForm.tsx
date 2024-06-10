import { FormEvent, useState } from "react";
import Modal from "../Components/Modal";
import axios from "axios";

interface InviteFormProps {
    openModal: boolean;
    handleCloseModal: () => void;
}

function InviteForm({ openModal, handleCloseModal }: InviteFormProps) {
    const [data, setData] = useState({
        name: "",
        email: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
    });

    const [response, setResponse] = useState({ status: "", message: "" });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const emailExp = new RegExp(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );

        if (!emailExp.exec(data.email)) {
            setErrors((prev) => ({ ...prev, email: "email not valid" }));
            return;
        }

        axios
            .post("/users/invite", data)
            .then((res) => {
                if (res.data.status === 200) {
                    setData({ name: "", email: "" });
                    setErrors({ name: "", email: "" });
                    setResponse({
                        status: "ok",
                        message: "Invitation sent successfully!!",
                    });
                } else {
                    setErrors({ name: "", email: "" });
                    setResponse({
                        status: "error",
                        message: "Something went wrong. please contact support",
                    });
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <Modal show={openModal} onClose={handleCloseModal} maxWidth="w-3/6">
            <h1 className="order-status-title text-lg">Invite New Customers</h1>

            <section className="shadow-gray-300 rounded-md mx-16">
                {response.status === "ok" && <h3>{response.message}</h3>}
                {response.status === "error" && (
                    <h3 className="text-green-500">{response.message}</h3>
                )}
                <form onSubmit={handleSubmit} id="invitation-form">
                    <div className="mb-6">
                        <label
                            htmlFor="name"
                            className="inline-block text-lg mb-2"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            className="border border-gray-200 rounded p-2 w-full"
                            name="firstName"
                            value={data.name}
                            required
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
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
                            required
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                }))
                            }
                        />

                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>
                </form>
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
                        onClick={() => {
                            setResponse({
                                status: "",
                                message: "",
                            });
                            handleCloseModal();
                        }}
                    >
                        close
                    </button>
                </section>
            </section>
        </Modal>
    );
}

export default InviteForm;
