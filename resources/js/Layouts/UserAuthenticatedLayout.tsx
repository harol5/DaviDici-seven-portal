import { Link } from "@inertiajs/react";
import { ReactNode, useState } from "react";
import InviteForm from "../Components/InviteForm";
import User from "../Models/User";

interface UserLayoutProps {
    auth?: User;
    children?: ReactNode;
    crrPage: string;
}

function UserAuthenticatedLayout({ auth, children, crrPage }: UserLayoutProps) {
    // State for invite form modal.
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
                                        href="/register"
                                        as="button"
                                        type="button"
                                    >
                                        register new user
                                    </Link>
                                </li>
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
            <InviteForm
                openModal={openModal}
                handleCloseModal={handleCloseModal}
            />
        </>
    );
}

export default UserAuthenticatedLayout;
