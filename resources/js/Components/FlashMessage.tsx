import { useEffect, useState } from "react";

function FlashMessage({ message }: { message: string }) {
    const [flashMessage, setMessage] = useState(message);

    useEffect(() => {
        if (flashMessage) {
            const timeout = setTimeout(() => {
                setMessage("");
            }, 3000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [flashMessage]);

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
