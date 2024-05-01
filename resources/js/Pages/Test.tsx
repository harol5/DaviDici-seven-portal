import UserAuthenticatedLayout from "../Layouts/UserAuthenticatedLayout";

function Test({ response }: { response: any }) {
    console.log(response);
    return (
        <UserAuthenticatedLayout crrPage="orders">
            {JSON.stringify(response, null, 1)}
        </UserAuthenticatedLayout>
    );
}

export default Test;
