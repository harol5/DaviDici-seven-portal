import { Link } from "@inertiajs/react";
import { ReactNode } from "react";

interface UserLayoutProps {
    children?: ReactNode;
    crrPage: string;
}

function UserAuthenticatedLayout({ children, crrPage }: UserLayoutProps) {
    return (
        <>
            <nav className="shadow-sm shadow-gray-200 py-1 m-1 mb-2">
                <div>
                    <img
                        className="nav-logo"
                        src="https://seven.test/images/davidici-logo-nav-cropped.png"
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
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        type="button"
                    >
                        Logout
                    </Link>
                </div>
            </nav>
            <main>{children}</main>
        </>
    );
}

export default UserAuthenticatedLayout;
