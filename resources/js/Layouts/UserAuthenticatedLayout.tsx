import { Link } from "@inertiajs/react";
import { FormEvent, ReactNode, useState } from "react";
import Modal from "../Components/Modal";
import { useForm } from "@inertiajs/react";
import User from "../Models/User";

interface UserLayoutProps {
    auth?: User;
    children?: ReactNode;
    crrPage: string;
}

function UserAuthenticatedLayout({ auth, children, crrPage }: UserLayoutProps) {
    const { data, setData, post, errors, reset } = useForm({
        name: "",
        email: "",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log(data);
        // post("/users", {
        //     onSuccess: () => {
        //         reset();
        //     },
        // });
    };

    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <>
            <nav className="shadow-sm shadow-gray-200 py-1 m-1 mb-2">
                <div>
                    <img
                        className="nav-logo"
                        src="https://portal.davidici.com/images/davidici-logo-nav-cropped.png"
                    />
                    <ul className="nav-links">
                        <li
                            className={
                                crrPage === "orders"
                                    ? "active rounded hover:border hover:border-davidiciGold"
                                    : "shadow-sm shadow-gray-200 hover:shadow-gray-500 rounded"
                            }
                        >
                            <Link href="/orders">Orders</Link>
                        </li>
                        <li
                            className={
                                crrPage === "inventory"
                                    ? "active rounded  hover:border hover:border-davidiciGold"
                                    : "shadow-sm shadow-gray-200 hover:shadow-gray-500 rounded"
                            }
                        >
                            <Link href="/inventory">Inventory</Link>
                        </li>
                    </ul>
                    <div className="settings-wrapper">
                        <h1>settings</h1>
                        {auth?.user.role === 3478 && (
                            <ul>
                                <li>add sales person</li>
                                <li onClick={handleOpenModal}>invite</li>
                                <li>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        type="button"
                                    >
                                        logout
                                    </Link>
                                </li>
                            </ul>
                        )}
                        {auth?.user.role === 1919 && (
                            <ul>
                                <li>add sales person</li>
                                <li>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        type="button"
                                    >
                                        logout
                                    </Link>
                                </li>
                            </ul>
                        )}
                        {auth?.user.role === 1950 && (
                            <ul>
                                <li>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        type="button"
                                    >
                                        logout
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </nav>
            <main>{children}</main>
            <Modal show={openModal} onClose={handleCloseModal} maxWidth="w-3/6">
                <h1 className="order-status-title text-lg">
                    Invite New Customers
                </h1>
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
                                onChange={(e) =>
                                    setData("name", e.target.value)
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
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
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
        </>
    );
}

export default UserAuthenticatedLayout;
