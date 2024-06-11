import { useForm } from "@inertiajs/react";
import FlashMessage from "../../Components/FlashMessage";
import { FormEvent, useState } from "react";
import { states } from "../../Models/UsaStates";
import type {
    formIndicator,
    RegistrationFormTabs,
} from "../../Models/MultiFormIndicators";
import MultiFormIndicator from "../../Components/MultiFormIndicator";
import TermsAndConditions from "../../Components/TermsAndConditions";

/**
 * MULTIFORM TODO.
 *
 * 1. continue working on terms and conditions.
 *
 */

function Register({ message }: { message: string }) {
    const { data, setData, post, errors, reset } = useForm({
        firstName: "",
        lastName: "",
        companyName: "",
        phone: "",
        businessPhone: "",
        address: "",
        city: "",
        state: "", // 2 letters
        zipCode: "",
        isTaxExempt: "N", // "yes" | "no"
        einNumber: "", // if isTaxExempt == "yes", input not needed.
        ownerType: "", // "PROP"| "PART" | "CORP"
        stateIncorporated: "", // 2 letters
        email: "",
        role: "owner",
        password: "",
        password_confirmation: "",
    });

    const [currentFormTab, setCurrentFormTab] = useState<RegistrationFormTabs>(
        "Partner Terms & Conditions"
    );

    const [indicators, setIndicators] = useState<formIndicator[]>([
        {
            name: "Partner Terms & Conditions",
            isActive: true,
            isCompleted: false,
        },
        { name: "MAP Policy", isActive: false, isCompleted: false },
        {
            name: "Warranty / Customer Service",
            isActive: false,
            isCompleted: false,
        },
        {
            name: "Commercial credit application",
            isActive: false,
            isCompleted: false,
        },
    ]);

    const handleFormTabCompleted = (tab: RegistrationFormTabs) => {
        // TODO:
        // 1. look for that tab on the indicators arrays,
        //    then update its boolean values.
        //    setIndicators(UpdatedIndicators).
        //
        // 2. get next tab and set it as the current one.
        //    setCurrentFormTab();
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post("/users");
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
                <section className="flex flex-col items-center my-12">
                    <h1 className="text-2xl">Account Package</h1>
                </section>

                <MultiFormIndicator indicators={indicators} />

                {currentFormTab === "Partner Terms & Conditions" && (
                    <TermsAndConditions
                        onFormTabCompleted={handleFormTabCompleted}
                    />
                )}

                {currentFormTab === "MAP Policy" && (
                    <section>
                        <section className="flex flex-col items-center my-12">
                            <h3 className="text-2xl">
                                Minimum Advertised Price (MAP) Policy
                            </h3>
                        </section>
                        <section className="my-6">
                            <p>I. Enclosed prices are in USD FOB N.J. </p>
                            <p>
                                II. All orders are to be entered online. a.
                                Orders may not be placed via phone. b. Orders
                                may not be placed via a Davidici Sales Partner -
                                Sample orders are an exception.
                            </p>
                            <p>
                                III. Cancellation of orders will be accepted
                                only if transmitted within and not later than 3
                                working days from the first confirmation.
                            </p>
                            <p>
                                IV. We reserve the right to refuse service to
                                anyone, for any reason, at any time.
                            </p>
                            <p>
                                V. We will always do our best efforts to inform
                                you of any price change however pricing is
                                subject to change at any given time without
                                notice.
                            </p>
                            <p>
                                VI. All designs, texts, graphics, logos, button
                                icons, images, audio and video clips, the
                                selection and arrangement thereof, and all other
                                articles on Davidici.com excluding text fonts
                                Copyright (c) 2020-2022 Davidici Inc. ALL RIGHTS
                                ARE RESERVED. - In addition to other
                                prohibitions, as set forth in the Terms of
                                Service, you are prohibited from using the site
                                or its content o for any unlawful purpose. • to
                                solicit or encourage others to participate in
                                unlawful acts. • to violate international,
                                federal, or state rules, regulations, local
                                ordinances, or laws • to violate or infringe
                                upon on our and/or others’ intellectual property
                                rights. • to harass, abuse, insult, harm,
                                defame, slander, disparage, intimidate, or
                                discriminate based on gender, sexual
                                orientation, religion, ethnicity, race, age,
                                national origin, or disability. • to submit
                                false or misleading information • to upload or
                                transmit viruses or any other type of malicious
                                code that will or may be used in any way that
                                will affect the functionality or operation of
                                the Services or of any related website, other
                                websites, or the Internet. • to collect or track
                                the personal information of others. • for any
                                other immoral or obscene use(s)
                            </p>
                            <p>
                                VII. The colors of the acrylic, marble, and
                                quartz, samples are merely indicative,
                                considering a reasonable approximation. It is
                                advised not to discompose the individual
                                elements of a collection. The realization of a
                                new combining element with the same color tone
                                as the original collection may differ and vary.
                                The company is free from any responsibility
                                deriving from the above-mentioned
                                inconveniences.
                            </p>
                            <p>
                                VIII. Any possible natural mark or imperfection,
                                in particular on natural materials, is not to be
                                considered as a fault or defect but as a natural
                                mark emphasizing the genuine aspects of natural
                                materials used.
                            </p>
                            <p>
                                IX. Davidici keeps the possibility of any
                                modification which could improve their quality
                                or comfort.
                            </p>
                        </section>
                        <section>
                            <label htmlFor="">print full name:</label>
                            <input
                                type="text"
                                name="fullName"
                                className="border mr-8"
                            />
                            <button>next</button>
                        </section>
                    </section>
                )}

                {currentFormTab === "Warranty / Customer Service" && (
                    <section>
                        <section className="flex flex-col items-center my-12">
                            <h3 className="text-2xl">
                                Warranty / Customer Service
                            </h3>
                        </section>
                        <section className="my-6">
                            <p>I. Enclosed prices are in USD FOB N.J. </p>
                            <p>
                                II. All orders are to be entered online. a.
                                Orders may not be placed via phone. b. Orders
                                may not be placed via a Davidici Sales Partner -
                                Sample orders are an exception.
                            </p>
                            <p>
                                III. Cancellation of orders will be accepted
                                only if transmitted within and not later than 3
                                working days from the first confirmation.
                            </p>
                            <p>
                                IV. We reserve the right to refuse service to
                                anyone, for any reason, at any time.
                            </p>
                            <p>
                                V. We will always do our best efforts to inform
                                you of any price change however pricing is
                                subject to change at any given time without
                                notice.
                            </p>
                            <p>
                                VI. All designs, texts, graphics, logos, button
                                icons, images, audio and video clips, the
                                selection and arrangement thereof, and all other
                                articles on Davidici.com excluding text fonts
                                Copyright (c) 2020-2022 Davidici Inc. ALL RIGHTS
                                ARE RESERVED. - In addition to other
                                prohibitions, as set forth in the Terms of
                                Service, you are prohibited from using the site
                                or its content o for any unlawful purpose. • to
                                solicit or encourage others to participate in
                                unlawful acts. • to violate international,
                                federal, or state rules, regulations, local
                                ordinances, or laws • to violate or infringe
                                upon on our and/or others’ intellectual property
                                rights. • to harass, abuse, insult, harm,
                                defame, slander, disparage, intimidate, or
                                discriminate based on gender, sexual
                                orientation, religion, ethnicity, race, age,
                                national origin, or disability. • to submit
                                false or misleading information • to upload or
                                transmit viruses or any other type of malicious
                                code that will or may be used in any way that
                                will affect the functionality or operation of
                                the Services or of any related website, other
                                websites, or the Internet. • to collect or track
                                the personal information of others. • for any
                                other immoral or obscene use(s)
                            </p>
                            <p>
                                VII. The colors of the acrylic, marble, and
                                quartz, samples are merely indicative,
                                considering a reasonable approximation. It is
                                advised not to discompose the individual
                                elements of a collection. The realization of a
                                new combining element with the same color tone
                                as the original collection may differ and vary.
                                The company is free from any responsibility
                                deriving from the above-mentioned
                                inconveniences.
                            </p>
                            <p>
                                VIII. Any possible natural mark or imperfection,
                                in particular on natural materials, is not to be
                                considered as a fault or defect but as a natural
                                mark emphasizing the genuine aspects of natural
                                materials used.
                            </p>
                            <p>
                                IX. Davidici keeps the possibility of any
                                modification which could improve their quality
                                or comfort.
                            </p>
                        </section>
                        <section>
                            <label htmlFor="">print full name:</label>
                            <input
                                type="text"
                                name="fullName"
                                className="border mr-8"
                            />
                            <button>next</button>
                        </section>
                    </section>
                )}

                {currentFormTab === "Commercial credit application" && (
                    <section>
                        <section className="flex flex-col items-center my-12">
                            <h3 className="text-2xl">
                                Commercial credit application
                            </h3>
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
                                    onChange={(e) =>
                                        setData("companyName", e.target.value)
                                    }
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
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
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
                                    onChange={(e) =>
                                        setData("address", e.target.value)
                                    }
                                />

                                {errors.address && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.address}
                                    </p>
                                )}
                            </div>

                            <div className="mb-6 city">
                                <label
                                    htmlFor="city"
                                    className="inline-block text-lg mb-2"
                                >
                                    City
                                </label>
                                <input
                                    type="text"
                                    className="border border-gray-200 rounded p-2 w-full"
                                    name="city"
                                    value={data.city}
                                    onChange={(e) =>
                                        setData("city", e.target.value)
                                    }
                                />

                                {errors.city && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.city}
                                    </p>
                                )}
                            </div>

                            <div className="mb-6 state">
                                <label
                                    htmlFor="state"
                                    className="inline-block text-lg mb-2"
                                >
                                    State
                                </label>
                                <select
                                    className="border border-gray-200 rounded p-2 w-full"
                                    name="state"
                                    value={data.state}
                                    onChange={(e) =>
                                        setData("state", e.target.value)
                                    }
                                >
                                    {states.map((state, index) => (
                                        <option
                                            key={index}
                                            value={state.abbreviation}
                                        >
                                            {state.name}
                                        </option>
                                    ))}
                                </select>

                                {errors.state && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.state}
                                    </p>
                                )}
                            </div>

                            <div className="mb-6 zip-code">
                                <label
                                    htmlFor="zipCode"
                                    className="inline-block text-lg mb-2"
                                >
                                    Zip code
                                </label>
                                <input
                                    type="text"
                                    className="border border-gray-200 rounded p-2 w-full"
                                    name="zipCode"
                                    value={data.zipCode}
                                    onChange={(e) =>
                                        setData("zipCode", e.target.value)
                                    }
                                />

                                {errors.zipCode && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.zipCode}
                                    </p>
                                )}
                            </div>

                            <div className="mb-6 tax-exempt">
                                <label
                                    htmlFor="tax-exempt"
                                    className="inline-block text-lg mb-2"
                                >
                                    Tax Exempt?
                                </label>
                                <select
                                    className="border border-gray-200 rounded p-2 w-full"
                                    name="isTaxExempt"
                                    value={data.isTaxExempt}
                                    onChange={(e) =>
                                        setData("isTaxExempt", e.target.value)
                                    }
                                >
                                    <option value="N">NO</option>
                                    <option value="Y">YES</option>
                                </select>

                                {errors.isTaxExempt && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.isTaxExempt}
                                    </p>
                                )}
                            </div>

                            {data.isTaxExempt === "N" && (
                                <div className="mb-6 ein-number">
                                    <label
                                        htmlFor="einNumber"
                                        className="inline-block text-lg mb-2"
                                    >
                                        EIN Number
                                    </label>
                                    <input
                                        type="text"
                                        className="border border-gray-200 rounded p-2 w-full"
                                        name="einNumber"
                                        value={data.einNumber}
                                        onChange={(e) =>
                                            setData("einNumber", e.target.value)
                                        }
                                    />

                                    {errors.einNumber && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.einNumber}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="mb-6 owner-type">
                                <label
                                    htmlFor="ownerType"
                                    className="inline-block text-lg mb-2"
                                >
                                    Owner Type
                                </label>
                                <select
                                    className="border border-gray-200 rounded p-2 w-full"
                                    name="ownerType"
                                    value={data.ownerType}
                                    onChange={(e) =>
                                        setData("ownerType", e.target.value)
                                    }
                                >
                                    <option value="">-choose one-</option>
                                    <option value="PROP">proprietorship</option>
                                    <option value="PART">partnership</option>
                                    <option value="CORP">corporation</option>
                                </select>

                                {errors.ownerType && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.ownerType}
                                    </p>
                                )}
                            </div>

                            <div className="mb-6 state-incorporated">
                                <label
                                    htmlFor="state"
                                    className="inline-block text-lg mb-2"
                                >
                                    State Incorporated
                                </label>
                                <select
                                    className="border border-gray-200 rounded p-2 w-full"
                                    name="stateIncorporated"
                                    value={data.stateIncorporated}
                                    onChange={(e) =>
                                        setData(
                                            "stateIncorporated",
                                            e.target.value
                                        )
                                    }
                                >
                                    {states.map((state, index) => (
                                        <option
                                            key={index}
                                            value={state.abbreviation}
                                        >
                                            {state.name}
                                        </option>
                                    ))}
                                </select>

                                {errors.stateIncorporated && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.stateIncorporated}
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
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
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
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
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
                    </section>
                )}

                <FlashMessage message={message} />
            </div>
        </>
    );
}

export default Register;
