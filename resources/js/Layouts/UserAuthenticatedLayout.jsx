import { Link } from '@inertiajs/react';

function UserAuthenticatedLayout({children, crrPage}) {
    return (
        <>
            <nav>
                <div>
                    {/* <img
                        className="nav-logo"
                        src="/images/davidici-logo-nav-cropped.png"
                    /> */}
                    <h1 className="nav-logo">davidici</h1>
                    <ul className="nav-links">
                        <li className={crrPage === "orders" ? "active" : ""}>
                            <Link href="/orders">Orders</Link>
                        </li>
                        <li className={crrPage === "inventory" ? "active" : ""}>
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