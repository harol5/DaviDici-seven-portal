import { useForm } from "@inertiajs/react";
import FlashMessage from "../../Components/FlashMessage";
import { FormEvent } from "react";
import { Link } from "@inertiajs/react";

function SalesPersonRegister({ message }: { message: string }) {
    const { data, setData, post, errors, reset } = useForm({
        firstName: "",
        lastName: "",
        phone: "",
        businessPhone: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post("/users/salesperson", {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <>
            <section className="py-5 bg-gray-700 w-[100%]">
                <img
                    className="w-[220px] mx-auto my-2"
                    src="https://portal.davidici.com/images/davidici-logo-nav-cropped.png"
                />
            </section>
            <div className="main-content-wrapper py-4">
                <Link href="/orders" className="border px-4 py-2 rounded">
                    Go back to orders
                </Link>
                <section className="flex flex-col items-center my-8">
                    <h1 className="text-2xl">Sales person registration</h1>
                    <p className="">please type all information.</p>
                </section>
                <form onSubmit={handleSubmit} className="mb-12">
                    <div className="mb-6 first-name">
                        <label
                            htmlFor="name"
                            className="inline-block text-lg mb-2"
                        >
                            First Name
                        </label>
                        <input
                            type="text"
                            className="border border-gray-200 rounded p-2 w-full"
                            name="firstName"
                            value={data.firstName}
                            onChange={(e) =>
                                setData("firstName", e.target.value)
                            }
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
                            onChange={(e) =>
                                setData("lastName", e.target.value)
                            }
                        />

                        {errors.lastName && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.lastName}
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
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
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

                    <div className="mb-6 button text-center">
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
        </>
    );
}

export default SalesPersonRegister;
