import { useForm } from "@inertiajs/react";
import { FormEvent } from "react";
import FlashMessage from "../../Components/FlashMessage";

function ChangePassword({
    message = "",
    email,
}: {
    message: string;
    email: string;
}) {
    console.log("==== ChangePassword =====");
    console.log(message);

    const { setData, post, errors, data, reset } = useForm({
        email: email,
        password: "",
        password_confirmation: "",
    });

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
                            <input
                                type="password"
                                name="password"
                                value={data.password}
                                placeholder="Password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />

                            <input
                                type="password"
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
