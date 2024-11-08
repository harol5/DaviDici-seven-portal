import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import User from "../../Models/User";

interface ConnectProps {
    auth: User;
    authUrl: string;
}

function Connect({ auth, authUrl }: ConnectProps) {
    console.log(authUrl);
    return (
        <UserAuthenticatedLayout auth={auth} crrPage="orders">
            <a href={authUrl} className="bg-green-500 text-white p-3">
                connect to intuit payment
            </a>
        </UserAuthenticatedLayout>
    );
}

export default Connect;
