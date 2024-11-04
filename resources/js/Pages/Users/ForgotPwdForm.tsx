import { useForm } from "@inertiajs/react";
import { FormEvent } from "react";
import classes from "../../../css/login.module.css";

interface ForgotPwdFormProps {
    handleCrrForm: (form: "login" | "forgot pwd") => void;
}

function ForgotPwdForm({ handleCrrForm }: ForgotPwdFormProps) {
    const { setData, post, errors } = useForm({
        email: "",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post("/users/forgot-pwd");
    };

    return (
        <>
            <p className={classes.forgotPwdMessage}>
                In order to reset your password, please enter the email
                associated with your account, you will receive an email with
                further instructions.
            </p>
            <form onSubmit={handleSubmit}>
                {errors.email && <p className="text-red-500">{errors.email}</p>}
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    onChange={(e) => setData("email", e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
            <button
                className={classes.forgotPwdButton}
                onClick={() => handleCrrForm("login")}
            >
                Back to Login
            </button>
        </>
    );
}

export default ForgotPwdForm;
