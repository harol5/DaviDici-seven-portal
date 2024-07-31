import { useForm } from "@inertiajs/react";
import FlashMessage from "../../Components/FlashMessage";
import { FormEvent } from "react";
import { Link } from "@inertiajs/react";

function SalesPersonUpdateInfo({ message }: { message: string }) {
    const { data, setData, post, errors, reset } = useForm({
        ssn: "",
        phone: "",
        businessPhone: "",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post("/salesperson/update", {
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
            <div className="main-content-wrapper">
                <section className="goback-heading-wrapper">
                    <Link
                        href="/orders"
                        className="go-back-button border px-4 py-2 rounded"
                    >
                        Go back to orders
                    </Link>
                    <section className="flex flex-col items-center">
                        <h1 className="">Sales person registration</h1>
                        <p className="">
                            please type your social security number.
                        </p>
                    </section>
                </section>
                <form
                    onSubmit={handleSubmit}
                    className="sales-person-form mb-12"
                >
                    <div className="mb-6 ssn">
                        <label
                            htmlFor="ssn"
                            className="inline-block text-lg mb-2"
                        >
                            Social Security Number
                        </label>
                        <input
                            type="text"
                            className="border border-gray-200 rounded p-2 w-full"
                            name="ssn"
                            value={data.ssn}
                            onChange={(e) => setData("ssn", e.target.value)}
                        />

                        {errors.ssn && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.ssn}
                            </p>
                        )}
                    </div>

                    <div className="mb-6 phone">
                        <label htmlFor="phone" className="inline-block  mb-2">
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
                            className="inline-block  mb-2"
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

export default SalesPersonUpdateInfo;
