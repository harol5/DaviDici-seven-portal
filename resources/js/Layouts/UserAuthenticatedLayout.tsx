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
            <nav>
                <div className="nav-content">
                    <a
                        className="homeAndNavLogoWrapper"
                        href="https://www.davidici.com/"
                        target="_blank"
                    >
                        <img
                            className="nav-logo"
                            src="https://portal.davidici.com/images/davidici-logo-nav-cropped.png"
                        />
                        <img
                            className="home-logo"
                            src="https://portal.davidici.com/images/home.svg"
                            alt="home icon"
                        />
                    </a>
                    <ul className={auth?.user ? "nav-links" : "guess-links"}>
                        {auth?.user ? (
                            <>
                                <li
                                    className={
                                        crrPage === "orders"
                                            ? "common-button active"
                                            : "common-button"
                                    }
                                >
                                    <Link href="/orders">Orders</Link>
                                </li>
                                <li
                                    className={
                                        crrPage === "inventory"
                                            ? "common-button active"
                                            : "common-button"
                                    }
                                >
                                    <Link href="/inventory">Inventory</Link>
                                </li>
                                <li
                                    className={
                                        crrPage === "inventory"
                                            ? "common-button active"
                                            : "common-button"
                                    }
                                >
                                    <Link href="/express-program">
                                        Express Program
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li
                                    className={
                                        crrPage === "inventory"
                                            ? "common-button active"
                                            : "common-button"
                                    }
                                >
                                    <Link href="/express-program">
                                        Express Program
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                    {auth?.user && (
                        <div className="settings-wrapper">
                            <img
                                src="https://portal.davidici.com/images/user-icon.svg"
                                alt="user icon"
                            />
                            {auth?.user.role === 3478 && (
                                <ul>
                                    <li>
                                        <Link
                                            href="/register/salesperson"
                                            as="button"
                                            type="button"
                                        >
                                            Add sales person
                                        </Link>
                                    </li>
                                    <li onClick={handleOpenModal}>Invite</li>
                                    <li>
                                        <Link
                                            href="/register"
                                            as="button"
                                            type="button"
                                        >
                                            Register new user
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            type="button"
                                        >
                                            Logout
                                        </Link>
                                    </li>
                                </ul>
                            )}
                            {auth?.user.role === 1919 && (
                                <ul>
                                    <li>
                                        <Link
                                            href="/register/salesperson"
                                            as="button"
                                            type="button"
                                        >
                                            Add sales person
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            type="button"
                                        >
                                            Logout
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
                                            Logout
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </div>
                    )}
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
