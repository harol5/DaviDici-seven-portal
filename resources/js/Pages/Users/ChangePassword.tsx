import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import { useForm } from "@inertiajs/react";
import User from "../../Models/User";
import { FormEvent } from "react";

interface loginCred {
    email: string;
    password: string;
}

function ChangePassword({ auth }: { auth: User }) {
    const { setData, post, errors } = useForm<loginCred>({
        email: "",
        password: "",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post("/users/change-password/handle");
    };

    return (
        <UserAuthenticatedLayout auth={auth} crrPage="">
            <div className="main-content-wrapper">
                <div className="gretting-search-wrapper">
                    <form onSubmit={handleSubmit}>
                        {errors.email && <p>{errors.email}</p>}
                        <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            onChange={(e) => setData("email", e.target.value)}
                        />

                        {errors.password && <p>{errors.password}</p>}
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </UserAuthenticatedLayout>
    );
}

export default ChangePassword;
