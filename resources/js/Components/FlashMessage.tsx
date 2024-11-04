import { useEffect, useState } from "react";

function FlashMessage({
    message,
    time = 3000,
}: {
    message: string;
    time?: number;
}) {
    const [flashMessage, setMessage] = useState(message);

    useEffect(() => {
        if (message) {
            setMessage(message);

            const timeout = setTimeout(() => {
                setMessage("");
            }, time);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [message]);

    return flashMessage ? (
        <div
            id="flash-message"
            className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-davidiciGold text-white px-10 py-3 md:px-20 md:py-6 rounded-md"
        >
            <p>{flashMessage}</p>
        </div>
    ) : (
        <></>
    );
}

export default FlashMessage;
