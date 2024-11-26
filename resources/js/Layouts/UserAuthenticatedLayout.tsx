import { Link } from "@inertiajs/react";
import { ReactNode, useEffect, useState } from "react";
import InviteForm from "../Components/InviteForm";
import User from "../Models/User";
import Modal from "../Components/Modal";
import ShoppingCart from "../Components/ShoppingCart";
import shoppingCartClasses from "../../css/shoppingCart.module.css";
import authClasses from "../../css/user-authenticated-layout.module.css";
import { getShoppingCartCompositions, updateShoppingCartCompositions } from "../utils/shoppingCartUtils";

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
    const handleCloseShoppingCartModal = () => {
        setOpenShoppingCartModal(false);
    };


    /**
     * the counter can be updated from several places, for example:
     * - when a composition is added from the configurator (props -> useEffect to update state).
     * - when navigating to a different page. (component is re-render completely, losing its state).
     */
    const [counter, setCounter] = useState(shoppingCartSize);
    const handleShoppingCartSize = (numOfProducts: number) => {
        setCounter(numOfProducts);
    };
    useEffect(() => {
        console.log("=== auth useEffect ran ====");
        console.log("counter:",counter);        

        const shoppingCartCompositionJSON = localStorage.getItem(
            "shoppingCartComposition"
        );


        // if there is a composition on local storage -> update shoping cart and counter.
        if (shoppingCartCompositionJSON && JSON.parse(shoppingCartCompositionJSON)) {
            console.log("stateful Shopping cart");
            const shoppingCartComposition = JSON.parse(shoppingCartCompositionJSON);            
            const updateShoppingCart = async () => {                
                try {
                    const {compositions} = await updateShoppingCartCompositions(shoppingCartComposition);
                    localStorage.setItem(
                        "shoppingCartComposition",
                        JSON.stringify(null)
                    );                    
                    setCounter(compositions.length);                                      
                } catch (err) {                    
                    console.error(err);
                }
            };         
            updateShoppingCart();
        }else {
            // else -> update counter.
            console.log("shopping cart composition counter");
            const getShoppingCartInfo = async () => {
                try {                
                    const {compositions} = await getShoppingCartCompositions();                                
                    setCounter(compositions.length);                                    
                } catch (err) {                
                    console.error(err);
                }
            };
            getShoppingCartInfo();   
        }        
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
                                <li className="link-button">
                                    <Link href="/">Login</Link>
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
                        )}
                    </ul>
                    {auth?.user && (
                        <img
                            src={`https://${location.hostname}/images/menu-icon.svg`}
                            alt="menu icon"
                            className={authClasses.menuIcon}
                            onClick={() =>
                                setIsNavLinksActived(!isNavLinksActived)
                            }
                        />
                    )}
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
                <ShoppingCart
                    onShoppingSize={handleShoppingCartSize}
                    onClose={handleCloseShoppingCartModal}
                />
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
