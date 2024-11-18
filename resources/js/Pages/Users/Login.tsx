import { useForm, Link } from "@inertiajs/react";
import FlashMessage from "../../Components/FlashMessage";
import { FormEvent, useState } from "react";
import Modal from "../../Components/Modal";
import classes from "../../../css/login.module.css";
import ForgotPwdForm from "./ForgotPwdForm";

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

    const [crrForm, setCrrForm] = useState<"login" | "forgot pwd">("login");

    const handleCrrForm = (form: "login" | "forgot pwd") => setCrrForm(form);

    const [isVisible, setIsVisible] = useState(false);

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
                    {crrForm === "login" && (
                        <>
                            <form onSubmit={handleSubmit}>
                                {errors.email && <p>{errors.email}</p>}
                                <input
                                    type="text"
                                    name="email"
                                    placeholder="Email"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                {errors.password && <p>{errors.password}</p>}
                                <div className={classes.inputPwdWrapper}>
                                    <input
                                        type={isVisible ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                    />
                                    <svg
                                        onClick={() => setIsVisible(!isVisible)}
                                        className={
                                            isVisible
                                                ? `${classes.eyeIcon} ${classes.actived}`
                                                : classes.eyeIcon
                                        }
                                        clipRule="evenodd"
                                        fillRule="evenodd"
                                        strokeLinejoin="round"
                                        strokeMiterlimit="2"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="m11.998 5c-4.078 0-7.742 3.093-9.853 6.483-.096.159-.145.338-.145.517s.048.358.144.517c2.112 3.39 5.776 6.483 9.854 6.483 4.143 0 7.796-3.09 9.864-6.493.092-.156.138-.332.138-.507s-.046-.351-.138-.507c-2.068-3.403-5.721-6.493-9.864-6.493zm8.413 7c-1.837 2.878-4.897 5.5-8.413 5.5-3.465 0-6.532-2.632-8.404-5.5 1.871-2.868 4.939-5.5 8.404-5.5 3.518 0 6.579 2.624 8.413 5.5zm-8.411-4c2.208 0 4 1.792 4 4s-1.792 4-4 4-4-1.792-4-4 1.792-4 4-4zm0 1.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z"
                                            fillRule="nonzero"
                                        />
                                    </svg>
                                </div>
                                <button type="submit">Login </button>
                            </form>
                            <button
                                className={classes.forgotPwdButton}
                                onClick={() => handleCrrForm("forgot pwd")}
                            >
                                Reset Password
                            </button>
                        </>
                    )}
                    {crrForm === "forgot pwd" && (
                        <ForgotPwdForm handleCrrForm={handleCrrForm} />
                    )}
                </div>
                <div className="flex justify-center py-10">
                    <Link
                        href="/express-program"
                        className="bg-davidiciGold py-2 px-6 rounded"
                    >
                        Express Program
                    </Link>
                </div>
            </div>
            <FlashMessage message={message} time={6000} />
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
