import { useForm } from "@inertiajs/react";
import { FormEvent } from "react";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import User from "../../Models/User";
import FlashMessage from "../../Components/FlashMessage";

interface ChangePasswordAdmProps {
    auth: User;
    message: string;
}

function ChangePasswordAdm({ auth, message }: ChangePasswordAdmProps) {
    console.log("=== ChangePasswordAdm ===");
    console.log(message);

    const { setData, post, errors, data, reset } = useForm({
        email: "",
        password: "",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post("/users/admin/pwd", {
            onSuccess: () => reset(),
        });
    };

    return (
        <UserAuthenticatedLayout auth={auth} crrPage="orders">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    onChange={(e) => setData("email", e.target.value)}
                />
                {errors.email && <p>{errors.email}</p>}
                <input
                    type={"password"}
                    name="password"
                    value={data.password}
                    placeholder="Password"
                    onChange={(e) => setData("password", e.target.value)}
                />
                {errors.password && <p>{errors.password}</p>}

                <button type="submit">Submit</button>
            </form>
            {message && <FlashMessage message={message} time={6000} />}
        </UserAuthenticatedLayout>
    );
}

export default ChangePasswordAdm;
