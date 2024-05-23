import { useForm } from "@inertiajs/react";
import FlashMessage from "../../Components/FlashMessage";
import { FormEvent, useState } from "react";
import Modal from "../../Components/Modal";

interface loginCred {
    email: string;
    password: string;
}

function Login({ message = "" }) {
    console.log(message);
    const { setData, post, errors } = useForm<loginCred>({
        email: "",
        password: "",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post("/auth");
    };

    return (
        <section className="main-login">
            <div id="login-page">
                <div id="LogoDiv">
                    <div id="loader-wrap">
                        <div className="loader" id="loader"></div>
                    </div>
                    <img id="Logo" src="images/davidici-logo.png" />
                </div>
                <div id="form-wrapper">
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
                        <button type="submit">Login </button>
                    </form>
                </div>
            </div>
            <FlashMessage message={message} />
            {message ===
                "The page expired, please refresh the page and login" && (
                <Modal show={true} onClose={() => {}} maxWidth="w-1/4">
                    <div className="m-4 text-center py-4">
                        <h1 className="text-red-500">
                            This session has expired.
                        </h1>
                        <p className="mb-3">
                            please reaload the page and enter your email and
                            password in order to access the portal again.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="rounded border shadow-sm shadow-gray-950 px-5 py-2 text-sm transition-shadow hover:shadow-none"
                        >
                            reload page
                        </button>
                    </div>
                </Modal>
            )}
        </section>
    );
}

export default Login;
