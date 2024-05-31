import { useForm } from "@inertiajs/react";
import FlashMessage from "../../Components/FlashMessage";
import { FormEvent } from "react";
import type { TwoLetterStateAbbreviations } from "../../Models/UsaStates";

/**
 * TODO:
 *
 * FINISH "ADDRESS INPUT" AND CONTINUE WITH THE LIST.
 *
 *
 */

function Register({ message }: { message: string }) {
    console.log("Register from rerendered!");
    const { data, setData, post, errors, reset } = useForm({
        firstName: "",
        lastName: "",
        companyName: "",
        phone: "",
        businessPhone: "",
        address: "",
        city: "",
        state: "", // 2 letters
        zip: "",
        isTaxExempt: "no", // will be a radio default to "no"
        einNumber: "", // if isTaxExempt == "yes", input not needed.
        ownerType: "", // will be a checkbox.
        stateIncorporated: "", // 2 letters
        email: "",
        username: "",
        role: "user",
        password: "",
        password_confirmation: "",
    });
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post("/users", {
            onSuccess: () => reset(),
        });
    };
    return (
        <div className="main-content-wrapper">
            <form onSubmit={handleSubmit}>
                <div className="mb-6 first-name">
                    <label htmlFor="name" className="inline-block text-lg mb-2">
                        First Name
                    </label>
                    <input
                        type="text"
                        className="border border-gray-200 rounded p-2 w-full"
                        name="firstName"
                        value={data.firstName}
                        onChange={(e) => setData("firstName", e.target.value)}
                    />

                    {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.firstName}
                        </p>
                    )}
                </div>

                <div className="mb-6 last-name">
                    <label
                        htmlFor="last-name"
                        className="inline-block text-lg mb-2"
                    >
                        Last Name
                    </label>
                    <input
                        type="text"
                        className="border border-gray-200 rounded p-2 w-full"
                        name="lastName"
                        value={data.lastName}
                        onChange={(e) => setData("lastName", e.target.value)}
                    />

                    {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.lastName}
                        </p>
                    )}
                </div>

                <div className="mb-6 company-name">
                    <label
                        htmlFor="company-name"
                        className="inline-block text-lg mb-2"
                    >
                        Company Name
                    </label>
                    <input
                        type="text"
                        className="border border-gray-200 rounded p-2 w-full"
                        name="companyName"
                        value={data.companyName}
                        onChange={(e) => setData("companyName", e.target.value)}
                    />

                    {errors.companyName && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.companyName}
                        </p>
                    )}
                </div>

                <div className="mb-6 phone">
                    <label
                        htmlFor="phone"
                        className="inline-block text-lg mb-2"
                    >
                        phone
                    </label>
                    <input
                        type="tel"
                        className="border border-gray-200 rounded p-2 w-full"
                        name="phone"
                        value={data.phone}
                        onChange={(e) => setData("phone", e.target.value)}
                    />

                    {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.phone}
                        </p>
                    )}
                </div>

                <div className="mb-6 business-phone">
                    <label
                        htmlFor="business-phone"
                        className="inline-block text-lg mb-2"
                    >
                        Business phone
                    </label>
                    <input
                        type="tel"
                        className="border border-gray-200 rounded p-2 w-full"
                        name="businessPhone"
                        value={data.businessPhone}
                        onChange={(e) =>
                            setData("businessPhone", e.target.value)
                        }
                    />

                    {errors.businessPhone && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.businessPhone}
                        </p>
                    )}
                </div>

                <div className="mb-6 address">
                    <label
                        htmlFor="address"
                        className="inline-block text-lg mb-2"
                    >
                        Address
                    </label>
                    <input
                        type="text"
                        className="border border-gray-200 rounded p-2 w-full"
                        name="address"
                        value={data.address}
                        onChange={(e) => setData("address", e.target.value)}
                    />

                    {errors.address && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.address}
                        </p>
                    )}
                </div>

                <div className="mb-6 email">
                    <label
                        htmlFor="email"
                        className="inline-block text-lg mb-2"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        className="border border-gray-200 rounded p-2 w-full"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                    />

                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div className="mb-6 password">
                    <label
                        htmlFor="password"
                        className="inline-block text-lg mb-2"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        className="border border-gray-200 rounded p-2 w-full"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                    />

                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.password}
                        </p>
                    )}
                </div>

                <div className="mb-6 confirm-password">
                    <label
                        htmlFor="password2"
                        className="inline-block text-lg mb-2"
                    >
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        className="border border-gray-200 rounded p-2 w-full"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                    />
                </div>

                <div className="mb-6 button">
                    <button
                        type="submit"
                        className="bg-laravel text-black rounded py-2 px-4 hover:bg-black hover:text-white"
                    >
                        Sign Up
                    </button>
                </div>
            </form>
            <FlashMessage message={message} />
        </div>
    );
}

export default Register;
