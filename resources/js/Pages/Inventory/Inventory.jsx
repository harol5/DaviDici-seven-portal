import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";

function Inventory(){
    return (
        <UserAuthenticatedLayout crrPage="inventory">
            <div className="main-content-wrapper">
                <div className="gretting-search-wrapper">
                    <h1 className="greeting">Coming Soon!!</h1>
                </div>
            </div>
        </UserAuthenticatedLayout>
    );
}

export default Inventory;