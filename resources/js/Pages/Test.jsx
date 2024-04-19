import UserAuthenticatedLayout from "../Layouts/UserAuthenticatedLayout";

function Test({response}){
    console.log(response);
    return (
        <UserAuthenticatedLayout crrPage="orders">
            {JSON.stringify(response)}
        </UserAuthenticatedLayout>
    );
}

export default Test;