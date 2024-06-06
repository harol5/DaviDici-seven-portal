import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import User from "../../Models/User";

function Inventory({ auth }: { auth: User }) {
    return (
        <UserAuthenticatedLayout auth={auth} crrPage="inventory">
            <div className="main-content-wrapper">
                <div className="gretting-search-wrapper">
                    <h1 className="greeting">Coming Soon!!</h1>
                </div>
            </div>
        </UserAuthenticatedLayout>
    );
}

export default Inventory;
