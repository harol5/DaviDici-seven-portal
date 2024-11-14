function EULA() {
    return (
        <section>
            <section className="py-5 bg-gray-700 w-[100%]">
                <div className="max-w-[90rem] mx-auto">
                    <img
                        className="w-[220px]"
                        src="https://portal.davidici.com/images/davidici-logo-nav-cropped.png"
                    />
                </div>
            </section>

            <main className="max-w-[90em] mx-auto my-16">
                <header className="flex flex-col items-center">
                    <h1>End User License Agreement (EULA)</h1>
                    <p>
                        <strong>Effective Date:</strong> November 13th, 2024
                    </p>
                </header>
                <section>
                    <h2>1. License Grant and Restrictions</h2>
                    <p>
                        Davidici ("we," "us," or "our") grants you ("User") a
                        non-exclusive, non-transferable, limited right to access
                        and use Portal Davidici ("App") according to this EULA.
                        This license is for your personal, non-commercial use,
                        and does not include any rights to:
                    </p>
                    <ul>
                        <li>
                            Distribute, license, sublicense, sell, or resell the
                            App or any part of it.
                        </li>
                        <li>
                            Copy, modify, or create derivative works of the App.
                        </li>
                        <li>
                            Attempt to reverse-engineer, decompile, or
                            disassemble any part of the App.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2>2. User Responsibilities and Acceptable Use</h2>
                    <p>Users agree to use the App responsibly and avoid:</p>
                    <ul>
                        <li>
                            Misusing the App or attempting unauthorized access
                            to our systems.
                        </li>
                        <li>
                            Using the App for illegal activities or to promote
                            prohibited content.
                        </li>
                        <li>
                            Violating any terms or policies related to the App.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2>3. Intellectual Property</h2>
                    <p>
                        All content, features, and functionality in the App,
                        including but not limited to images, text, software, and
                        trademarks, are the property of Davidici. Users agree
                        not to infringe on these rights or use the App in a way
                        that violates our intellectual property.
                    </p>
                </section>

                <section>
                    <h2>4. Payment, Pricing, and Refund Policy</h2>
                    <p>
                        Users are responsible for payments related to purchases
                        made within the App, including applicable taxes and
                        fees.
                    </p>
                    <ul>
                        <li>
                            <strong>Pricing:</strong> Prices for
                            products/services are specified within the App and
                            may be subject to change.
                        </li>
                        <li>
                            <strong>Refunds:</strong> [Specify refund policy,
                            such as “All sales are final” or “Refunds are
                            available under certain conditions.”]
                        </li>
                        <li>
                            <strong>Subscriptions</strong> (if applicable):
                            Subscriptions automatically renew unless canceled by
                            the User. [Outline cancellation and renewal terms.]
                        </li>
                    </ul>
                </section>

                <section>
                    <h2>5. Privacy and Data Use</h2>
                    <p>
                        We collect and process certain data about Users as
                        outlined in our Privacy Policy{" "}
                        <a href={`/privacy-policy`}>here</a>. By using the App,
                        you consent to our collection, use, and disclosure of
                        your data according to our policy.
                    </p>
                </section>

                <section>
                    <h2>6. Limitation of Liability</h2>
                    <p>
                        To the maximum extent permitted by law, we are not
                        liable for damages arising from:
                    </p>
                    <ul>
                        <li>
                            Use or inability to use the App, including data loss
                            or service interruptions.
                        </li>
                        <li>
                            Losses related to transactions conducted through the
                            App.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2>7. Warranty Disclaimer</h2>
                    <p>
                        The App is provided “as is” without any warranties,
                        express or implied. We disclaim all warranties,
                        including but not limited to fitness for a particular
                        purpose, availability, and accuracy.
                    </p>
                </section>

                <section>
                    <h2>8. Termination</h2>
                    <p>
                        We reserve the right to suspend or terminate your access
                        to the App if you violate this EULA or engage in
                        prohibited activities.
                    </p>
                    <p>
                        Upon termination, Users must discontinue use of the App
                        and delete any copies of the App or its content in their
                        possession.
                    </p>
                </section>

                <section>
                    <h2>9. Governing Law and Dispute Resolution</h2>
                    <p>
                        This EULA is governed by the laws of [Your
                        Jurisdiction]. Any disputes arising from or related to
                        this EULA will be resolved by [arbitration/court
                        jurisdiction].
                    </p>
                </section>

                <section>
                    <h2>10. Amendments</h2>
                    <p>
                        We may modify this EULA at any time. We will notify
                        Users of changes, and continued use of the App will
                        constitute acceptance of the modified terms.
                    </p>
                </section>
            </main>
        </section>
    );
}

export default EULA;
