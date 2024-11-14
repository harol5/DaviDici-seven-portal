import { useForm } from "@inertiajs/react";
import { FormEvent, useState } from "react";
import FlashMessage from "../../Components/FlashMessage";
import classes from "../../../css/login.module.css";

function ChangePassword({
    message = "",
    email,
}: {
    message: string;
    email: string;
}) {
    const { setData, post, errors, data, reset } = useForm({
        email: email,
        password: "",
        password_confirmation: "",
    });

    const [isVisible, setIsVisible] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post("/users/update/pwd/handle", {
            onSuccess: (data) => {
                console.log(data.props.message);
                data.props.message === "";
                reset();
            },
        });
    };

    return (
        <section className="main-login">
            <div id="login-page">
                <div id="LogoDiv">
                    <div id="loader-wrap">
                        <div className="loader" id="loader"></div>
                    </div>
                    <img
                        id="Logo"
                        src={`https://${location.hostname}/images/davidici-logo.png`}
                    />
                </div>
                <div id="form-wrapper">
                    {!message ? (
                        <form onSubmit={handleSubmit}>
                            {errors.password && <p>{errors.password}</p>}
                            <div className={classes.inputPwdWrapper}>
                                <input
                                    type={isVisible ? "text" : "password"}
                                    name="password"
                                    value={data.password}
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

                            <input
                                type={isVisible ? "text" : "password"}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                placeholder="re-enter password"
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                            />
                            <button type="submit">Submit</button>
                        </form>
                    ) : (
                        <p className="text-center text-green-600">
                            {message}. <br /> You can close this window now
                        </p>
                    )}
                </div>
            </div>
            <FlashMessage message={message} />
        </section>
    );
}

export default ChangePassword;
