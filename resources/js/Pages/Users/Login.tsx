import { useForm } from "@inertiajs/react";
import FlashMessage from "../../Components/FlashMessage";
import { FormEvent } from "react";

interface loginCred {
    email: string;
    password: string;
}

function Login({ message = "" }) {
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
        </section>
    );
}

export default Login;