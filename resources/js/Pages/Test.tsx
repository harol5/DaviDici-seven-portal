import UserAuthenticatedLayout from "../Layouts/UserAuthenticatedLayout";

function Test({ response }: { response: any }) {
    console.log(response);
    return (
        <UserAuthenticatedLayout crrPage="orders">
            {JSON.stringify(response)}
        </UserAuthenticatedLayout>
    );
}

export default Test;
