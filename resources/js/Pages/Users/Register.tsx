import { useForm } from "@inertiajs/react";
import FlashMessage from "../../Components/FlashMessage";
import { FormEvent, useState } from "react";
import { states } from "../../Models/UsaStates";
import type {
    formIndicator,
    RegistrationFormTabs,
} from "../../Models/MultiFormIndicators";
import MultiFormIndicator from "../../Components/MultiFormIndicator";
import SignaturePage from "../../Components/SignaturePage";

/**
 * MULTIFORM TODO.
 *
 * 1. continue working on terms and conditions.
 *
 */

function Register({ message }: { message: string }) {
    const { data, setData, post, errors } = useForm({
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
        let nextTab;
        const indicatorCopy = [...indicators];

        for (let i = 0; i < indicatorCopy.length; i++) {
            if (indicatorCopy[i].name === tab) {
                indicatorCopy[i].isActive = false;
                indicatorCopy[i].isCompleted = true;

                if (indicatorCopy[i + 1]) {
                    nextTab = indicatorCopy[i + 1].name;
                    indicatorCopy[i + 1].isActive = true;
                }
            }
        }

        setCurrentFormTab(nextTab as RegistrationFormTabs);
        setIndicators(indicatorCopy);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post("/users");
    };

    return (
        <>
            <section className="py-5 bg-gray-700 w-[100%]">
                <div className="max-w-[90rem] mx-auto">
                    <img
                        className="w-[220px]"
                        src="https://portal.davidici.com/images/davidici-logo-nav-cropped.png"
                    />
                </div>
            </section>
            <div className="max-w-[90em] mx-auto my-16">
                <section className="flex flex-col items-center">
                    <h1 className="text-3xl">Account Package</h1>
                </section>

                <MultiFormIndicator indicators={indicators} />

                {currentFormTab === "Partner Terms & Conditions" && (
                    <SignaturePage
                        onFormTabCompleted={handleFormTabCompleted}
                        formTab="Partner Terms & Conditions"
                    >
                        <section>
                            <section className="flex flex-col items-center">
                                <h3 className="text-2xl">
                                    Davidici Partner Terms & Conditions
                                </h3>
                                <h5>
                                    As a Davidici Partner, you acknowledge and
                                    accept the following:
                                </h5>
                            </section>
                            <section className="my-8 flex flex-col gap-5">
                                <div>
                                    <p>
                                        I. Enclosed prices are in USD FOB N.J.{" "}
                                    </p>
                                </div>

                                <div>
                                    <p>
                                        II. All orders are to be entered online.
                                    </p>
                                    <ul className="ml-6">
                                        <li>
                                            a. Orders may not be placed via
                                            phone.
                                        </li>
                                        <li>
                                            b. Orders may not be placed via a
                                            Davidici Sales Partner - Sample
                                            orders are an exception.
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <p>
                                        III. Cancellation of orders will be
                                        accepted only if transmitted within and
                                        not later than 3 working days from the
                                        first confirmation.
                                    </p>
                                </div>

                                <div>
                                    <p>
                                        IV. We reserve the right to refuse
                                        service to anyone, for any reason, at
                                        any time.
                                    </p>
                                </div>

                                <div>
                                    <p>
                                        V. We will always do our best efforts to
                                        inform you of any price change however
                                        pricing is subject to change at any
                                        given time without notice.
                                    </p>
                                </div>

                                <div>
                                    <p>
                                        VI. All designs, texts, graphics, logos,
                                        button icons, images, audio and video
                                        clips, the selection and arrangement
                                        thereof, and all other articles on
                                        Davidici.com excluding text fonts
                                        Copyright (c) 2020-2022 Davidici Inc.
                                        ALL RIGHTS ARE RESERVED.
                                    </p>

                                    <ul className="ml-6">
                                        <li>
                                            - In addition to other prohibitions,
                                            as set forth in the Terms of
                                            Service, you are prohibited from
                                            using the site or its content o for
                                            any unlawful purpose.
                                        </li>
                                        <li>
                                            - to solicit or encourage others to
                                            participate in unlawful acts.
                                        </li>
                                        <li>
                                            - to violate international, federal,
                                            or state rules, regulations, local
                                            ordinances, or laws.
                                        </li>
                                        <li>
                                            - to violate or infringe upon on our
                                            and/or others’ intellectual property
                                            rights.
                                        </li>
                                        <li>
                                            - to harass, abuse, insult, harm,
                                            defame, slander, disparage,
                                            intimidate, or discriminate based on
                                            gender, sexual orientation,
                                            religion, ethnicity, race, age,
                                            national origin, or disability.
                                        </li>
                                        <li>
                                            - to submit false or misleading
                                            information.
                                        </li>
                                        <li>
                                            - to upload or transmit viruses or
                                            any other type of malicious code
                                            that will or may be used in any way
                                            that will affect the functionality
                                            or operation of the Services or of
                                            any related website, other websites,
                                            or the Internet.
                                        </li>
                                        <li>
                                            - to collect or track the personal
                                            information of others.
                                        </li>
                                        <li>
                                            - for any other immoral or obscene
                                            use(s)
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <p>
                                        VII. The colors of the acrylic, marble,
                                        and quartz, samples are merely
                                        indicative, considering a reasonable
                                        approximation. It is advised not to
                                        discompose the individual elements of a
                                        collection. The realization of a new
                                        combining element with the same color
                                        tone as the original collection may
                                        differ and vary. The company is free
                                        from any responsibility deriving from
                                        the above-mentioned inconveniences.
                                    </p>
                                </div>

                                <div>
                                    <p>
                                        VIII. Any possible natural mark or
                                        imperfection, in particular on natural
                                        materials, is not to be considered as a
                                        fault or defect but as a natural mark
                                        emphasizing the genuine aspects of
                                        natural materials used.
                                    </p>
                                </div>
                                <div>
                                    <p>
                                        IX. Davidici keeps the possibility of
                                        any modification which could improve
                                        their quality or comfort.
                                    </p>
                                </div>
                            </section>
                        </section>
                    </SignaturePage>
                )}

                {currentFormTab === "MAP Policy" && (
                    <SignaturePage
                        onFormTabCompleted={handleFormTabCompleted}
                        formTab="MAP Policy"
                    >
                        <section>
                            <section className="flex flex-col items-center">
                                <h3 className="text-2xl">
                                    Minimum Advertised Price (MAP) Policy
                                </h3>
                            </section>
                            <section className="my-6">
                                <section className="mb-4">
                                    <h4 className="text-xl">Purpose:</h4>
                                    <p>
                                        Effective January 1, 2022 as our
                                        dedicated dealer network, this
                                        unilateral MAP Policy applies to all
                                        advertisements of Davidici products and
                                        is intended to strengthen Davidici’s
                                        brand, and dealer margins and to insure
                                        Davidici products are marketed and
                                        serviced as the luxury level the end
                                        consumer expects. This Policy applies to
                                        all U.S. dealers and the advertised
                                        pricing of all Davidici products.
                                    </p>
                                </section>

                                <section className="mb-4">
                                    <h4 className="text-xl">
                                        Forms of Advertising:
                                    </h4>
                                    <p>
                                        This MAP Policy applies to all
                                        advertisements, whether or not an item
                                        is identified as a Davidici product.
                                        This Policy covers, but is not limited
                                        to, the following forms of media:
                                        Newspapers, inserts, flyers, posters,
                                        coupons, catalogs, mailers, magazines,
                                        email and email blasts, internet or
                                        electronic media content, television,
                                        radio, public signage, and mail order
                                        catalogs.
                                    </p>
                                </section>

                                <section className="mb-4">
                                    <h4 className="text-xl">Pricing:</h4>
                                    <p>
                                        The MAP of 2.0 times cost, as specified
                                        in our pricelist, is a minimum
                                        advertised price. No dealer is required
                                        to sell Davidici products at a mandated
                                        price. The MAP pertains to advertised
                                        prices only. Davidici does not seek
                                        agreements for the prices you charge the
                                        consumer for Davidici products.
                                    </p>
                                </section>

                                <section className="mb-4">
                                    <h4 className="text-xl">
                                        Advertised Pricing:
                                    </h4>
                                    <p>
                                        The advertised price is the price
                                        charged after all deductions,
                                        incentives, and rebates are applied to
                                        Davidici products. They include, but are
                                        not limited to:
                                    </p>
                                    <ul>
                                        <li>
                                            Payments of sales or other taxes for
                                            the consumer.
                                        </li>
                                        <li>
                                            Discounts are given on non-Davidici
                                            products, which are bundled in any
                                            way with Davidici products.
                                        </li>
                                        <li>
                                            Gifts, incentives, gratifications,
                                            or services associated with the
                                            purchase of Davidici products.
                                        </li>
                                        <li>
                                            Freight and delivery discounts or
                                            free-shipping advertisements
                                        </li>
                                    </ul>
                                </section>

                                <section className="mb-4">
                                    <h4 className="text-xl">
                                        MAP Policy Violations:
                                    </h4>
                                    <p>
                                        Be advised, Davidici at its sole
                                        discretion, will evaluate each violation
                                        and determine dealer status for any
                                        retailers who:
                                    </p>
                                    <ul>
                                        <li>
                                            Advertise any Davidici product below
                                            the MAP as specified in our Minimum
                                            Advertised Pricelist.
                                        </li>
                                        <li>
                                            Resell a Davidici product to any
                                            reseller which advertises any
                                            Davidici product below the published
                                            MAP.
                                        </li>
                                    </ul>
                                </section>

                                <h4 className="text-xl text-gray-700">
                                    The above sanctions are in place to ensure
                                    brand and dealer compliance to this policy.
                                </h4>
                            </section>
                        </section>
                    </SignaturePage>
                )}

                {currentFormTab === "Warranty / Customer Service" && (
                    <SignaturePage
                        onFormTabCompleted={handleFormTabCompleted}
                        formTab="Warranty / Customer Service"
                    >
                        <section>
                            <section className="flex flex-col items-center">
                                <h3 className="text-2xl">
                                    Warranty / Customer Service
                                </h3>
                            </section>
                            <section className="my-6 flex flex-col gap-5">
                                <div>
                                    <p>
                                        All Davidici products are made of
                                        high-quality laboratory-tested materials
                                        and are compliant with California codes.{" "}
                                    </p>
                                </div>

                                <div>
                                    <p>
                                        As protective measures, Davidici offers
                                        the following LIMITED WARRANTY against
                                        possible defects in material and
                                        workmanship, with validity starting from
                                        the delivery date printed on the
                                        transport document.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-xl">
                                        LIFETIME ON ALL MODELS:
                                    </h4>
                                    <p>
                                        It is recommended that all goods are
                                        inspected immediately upon delivery. In
                                        the case of any damage, a claim should
                                        be submitted to the transport company
                                        (which is insured against any damages)
                                        at the time of delivery and, if
                                        possible, before the carrier leaves the
                                        warehouse. After having unpacked the
                                        goods, any clear damage must be
                                        immediately communicated to Davidici in
                                        written form. Any hidden damage must be
                                        communicated to Davidici no later than 5
                                        days from the date of delivery.
                                    </p>
                                </div>

                                <div>
                                    <p>
                                        Should a defect emerge during the above
                                        warranty period, please contact Davidici
                                        Customer Service/Assistance, and be
                                        prepared to provide the following
                                        information:
                                    </p>
                                    <ul className="ml-6">
                                        <li>Date of Delivery.</li>
                                        <li>Sales Order Number.</li>
                                        <li>
                                            Identification Code Number(s) -
                                            printed on each individual box,
                                            listed on the packing list.
                                        </li>
                                        <li>
                                            Photos of Damage – must be clear and
                                            complete.
                                        </li>
                                        <li>Description of Damage.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-xl text-gray-700">
                                        All the above information must be
                                        provided. Failure to provide the above
                                        information will result in an automatic
                                        denial of any claim.
                                    </h4>
                                </div>

                                <div>
                                    <p>
                                        All repairs and/or replacements must be
                                        authorized by Davidici in advance. If
                                        under warranty, Davidici will pay to
                                        repair or replace the piece at no
                                        charge. If is the retailer’s
                                        responsibility to coordinate all repairs
                                        and communications with the end user.
                                        Any piece to be returned to Davidici for
                                        local repairs should be well packed,
                                        with each article packaged individually
                                        (the Mini excluded) in order to avoid
                                        further damage during the return
                                        transport. Otherwise, the driver can
                                        refuse to take the piece back.{" "}
                                    </p>
                                </div>

                                <div>
                                    <p>
                                        The WARRANTY is limited to the value of
                                        the product. It does not cover any
                                        damage caused by misuse or neglect,
                                        accidents, abrasion, exposure to extreme
                                        temperatures, solvents, acids, water,
                                        normal wear, and tear, or damage by a
                                        common carrier.{" "}
                                    </p>
                                </div>

                                <div>
                                    <p>
                                        Goods damaged for the above-indicated
                                        causes, defects of materials, or
                                        workmanship registered after expiration
                                        of the warranty period will typically
                                        (depending upon parts availability) be
                                        repaired at the customer’s expense and
                                        delays in repair depend on the
                                        availability of parts and labor. Under
                                        no circumstance does this WARRANTY cover
                                        damages to third parties or interests or
                                        claims beyond the value of the product.{" "}
                                    </p>
                                </div>
                            </section>
                        </section>
                    </SignaturePage>
                )}

                {currentFormTab === "Commercial credit application" && (
                    <section>
                        <section className="flex flex-col items-center">
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
                                    Submit
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
