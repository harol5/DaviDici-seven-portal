import { ReactNode, useRef, useState } from "react";
import type { RegistrationFormTabs } from "../Models/MultiFormIndicators";

interface SignaturePagesProps {
    children?: ReactNode;
    onFormTabCompleted: (tab: RegistrationFormTabs) => void;
    formTab: RegistrationFormTabs;
}

function SignaturePage({
    children,
    onFormTabCompleted,
    formTab,
}: SignaturePagesProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState("");

    const handlePrintName = () => {
        if (!inputRef.current?.value) {
            setError("you must print your name");
            return;
        }
        setError("");
        onFormTabCompleted(formTab);
    };

    return (
        <section>
            {children}
            <section className="flex items-start justify-evenly">
                <div className="flex text-center">
                    <label htmlFor="">print full name:</label>
                    <div>
                        <input
                            type="text"
                            name="fullName"
                            className={
                                error
                                    ? "border rounded border-red-500 mx-2 py-1 px-2"
                                    : "border rounded border-black mx-2 py-1 px-2"
                            }
                            ref={inputRef}
                        />
                        {error && (
                            <p className="text-red-500 text-xs mt-1">{error}</p>
                        )}
                    </div>
                </div>
                <button
                    onClick={handlePrintName}
                    className="rounded border shadow-sm shadow-gray-100 px-5 py-1 transition-shadow hover:shadow-gray-700"
                >
                    next
                </button>
            </section>
        </section>
    );
}

export default SignaturePage;
