import { Link } from "@inertiajs/react";
import { ReactNode, useEffect, useState } from "react";
import InviteForm from "../Components/InviteForm";
import User from "../Models/User";
import Modal from "../Components/Modal";
import ShoppingCart from "../Components/ShoppingCart";
import shoppingCartClasses from "../../css/shoppingCart.module.css";
import authClasses from "../../css/user-authenticated-layout.module.css";
import axios from "axios";

interface UserAuthenticatedLayoutProps {
    auth: User;
    children?: ReactNode;
    crrPage: string;
    shoppingCartSize?: number;
}

function UserAuthenticatedLayout({
    auth,
    children,
    crrPage,
    shoppingCartSize = 0,
}: UserAuthenticatedLayoutProps) {
    const [isNavLinksActived, setIsNavLinksActived] = useState(false);

    const getNavLinksClass = () => {
        let classes = "";

        classes += auth?.user ? "nav-links" : "guess-links";
        classes += isNavLinksActived ? " active-links" : "";

        return classes;
    };

    // State for invite form modal.
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    // --- Manage Modal shopping cart.
    const [openShoppingCartModal, setOpenShoppingCartModal] = useState(false);
    const [counter, setCounter] = useState(shoppingCartSize);

    const handleShoppingCartSize = (numOfProducts: number) => {
        setCounter(numOfProducts);
    };

    useEffect(() => {
        const getShoppingCartProducts = async () => {
            try {
                // GET SHOPPING CART PRODUTS FROM SERVER.
                const response = await axios.get(
                    "/express-program/shopping-cart/products"
                );

                const shoppingCartProductsServer =
                    response.data.shoppingCartProducts;

                if (shoppingCartProductsServer)
                    setCounter(shoppingCartProductsServer.length);
            } catch (err) {}
        };
        getShoppingCartProducts();
    }, [shoppingCartSize]);

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
                        <img
                            className="nav-logo-mobile"
                            src={`https://${location.hostname}/images/davidici-logo-no-letters.svg`}
                            alt="home icon"
                        />
                    </a>
                    <ul className={getNavLinksClass()}>
                        {auth?.user ? (
                            <>
                                <li
                                    className={
                                        crrPage === "orders"
                                            ? "link-button active"
                                            : "link-button"
                                    }
                                >
                                    <Link href="/orders">Orders</Link>
                                </li>
                                <li
                                    className={
                                        crrPage === "inventory"
                                            ? "link-button active"
                                            : "link-button"
                                    }
                                >
                                    <Link href="/inventory">Inventory</Link>
                                </li>
                                <li
                                    className={
                                        crrPage === "express program"
                                            ? "link-button active"
                                            : "link-button"
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
                                        crrPage === "express program"
                                            ? "link-button active"
                                            : "link-button"
                                    }
                                >
                                    <Link href="/express-program">
                                        Express Program
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                    <img
                        src={`https://${location.hostname}/images/menu-icon.svg`}
                        alt="menu icon"
                        className={authClasses.menuIcon}
                        onClick={() => setIsNavLinksActived(!isNavLinksActived)}
                    />
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
                                    <li>
                                        <Link
                                            href="/salesperson/update"
                                            as="button"
                                            type="button"
                                        >
                                            Edit sales person info
                                        </Link>
                                    </li>
                                    <li>
                                        <button onClick={handleOpenModal}>
                                            Invite
                                        </button>
                                    </li>
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
                                            href="/salesperson/update"
                                            as="button"
                                            type="button"
                                        >
                                            Edit my salesperson info
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
                                            href="/salesperson/update"
                                            as="button"
                                            type="button"
                                        >
                                            Edit my salesperson info
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
                        </div>
                    )}
                </div>
            </nav>
            <main>{children}</main>
            <InviteForm
                openModal={openModal}
                handleCloseModal={handleCloseModal}
            />
            <Modal
                show={openShoppingCartModal}
                onClose={() => setOpenShoppingCartModal(false)}
                customClass={shoppingCartClasses.shoppingCartModal}
            >
                <ShoppingCart onShoppingSize={handleShoppingCartSize} />
            </Modal>
            {auth.user && (
                <button
                    className={shoppingCartClasses.shoppingCartButton}
                    onClick={() => setOpenShoppingCartModal(true)}
                >
                    <img
                        src={`https://${location.hostname}/images/shopping-cart-icon.svg`}
                        alt="shopping cart icon"
                    />
                    <p className={shoppingCartClasses.counter}>{counter}</p>
                </button>
            )}
        </>
    );
}

export default UserAuthenticatedLayout;
