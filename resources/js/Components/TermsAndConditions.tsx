import { useRef } from "react";
import type { RegistrationFormTabs } from "../Models/MultiFormIndicators";

interface TermsAndConditionsProps {
    onFormTabCompleted: (tab: RegistrationFormTabs) => void;
}

function TermsAndConditions({ onFormTabCompleted }: TermsAndConditionsProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const handlePrintName = () => {
        /**
         * TODO:
         * 1. check if input value. if so call onFormTabCompleted
         * 2. if not, display error
         */
        console.log(inputRef.current?.value);
        onFormTabCompleted("Partner Terms & Conditions");
    };
    return (
        <section>
            <section className="flex flex-col items-center my-12">
                <h3 className="text-2xl">
                    Davidici Partner Terms & Conditions
                </h3>
                <h5>
                    As a Davidici Partner, you acknowledge and accept the
                    following:
                </h5>
            </section>
            <section className="my-6">
                <p>I. Enclosed prices are in USD FOB N.J. </p>
                <p>
                    II. All orders are to be entered online. a. Orders may not
                    be placed via phone. b. Orders may not be placed via a
                    Davidici Sales Partner - Sample orders are an exception.
                </p>
                <p>
                    III. Cancellation of orders will be accepted only if
                    transmitted within and not later than 3 working days from
                    the first confirmation.
                </p>
                <p>
                    IV. We reserve the right to refuse service to anyone, for
                    any reason, at any time.
                </p>
                <p>
                    V. We will always do our best efforts to inform you of any
                    price change however pricing is subject to change at any
                    given time without notice.
                </p>
                <p>
                    VI. All designs, texts, graphics, logos, button icons,
                    images, audio and video clips, the selection and arrangement
                    thereof, and all other articles on Davidici.com excluding
                    text fonts Copyright (c) 2020-2022 Davidici Inc. ALL RIGHTS
                    ARE RESERVED. - In addition to other prohibitions, as set
                    forth in the Terms of Service, you are prohibited from using
                    the site or its content o for any unlawful purpose. • to
                    solicit or encourage others to participate in unlawful acts.
                    • to violate international, federal, or state rules,
                    regulations, local ordinances, or laws • to violate or
                    infringe upon on our and/or others’ intellectual property
                    rights. • to harass, abuse, insult, harm, defame, slander,
                    disparage, intimidate, or discriminate based on gender,
                    sexual orientation, religion, ethnicity, race, age, national
                    origin, or disability. • to submit false or misleading
                    information • to upload or transmit viruses or any other
                    type of malicious code that will or may be used in any way
                    that will affect the functionality or operation of the
                    Services or of any related website, other websites, or the
                    Internet. • to collect or track the personal information of
                    others. • for any other immoral or obscene use(s)
                </p>
                <p>
                    VII. The colors of the acrylic, marble, and quartz, samples
                    are merely indicative, considering a reasonable
                    approximation. It is advised not to discompose the
                    individual elements of a collection. The realization of a
                    new combining element with the same color tone as the
                    original collection may differ and vary. The company is free
                    from any responsibility deriving from the above-mentioned
                    inconveniences.
                </p>
                <p>
                    VIII. Any possible natural mark or imperfection, in
                    particular on natural materials, is not to be considered as
                    a fault or defect but as a natural mark emphasizing the
                    genuine aspects of natural materials used.
                </p>
                <p>
                    IX. Davidici keeps the possibility of any modification which
                    could improve their quality or comfort.
                </p>
            </section>
            <section>
                <label htmlFor="">print full name:</label>
                <input
                    type="text"
                    name="fullName"
                    className="border mr-8"
                    ref={inputRef}
                />
                <button onClick={handlePrintName}>next</button>
            </section>
        </section>
    );
}

export default TermsAndConditions;
