import { useEffect, useState } from "react";

function FlashMessage({ message }) {
    const [flashMessage, setMessage] = useState(message);
    useEffect(() => {
        if (message) {
            const timeout = setTimeout(() => {
                setMessage("");
            }, 3000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, []);
    
    return flashMessage ? (
        <div
            id="flash-message"
            className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-davidiciGold text-white px-48 py-3"
        >
            <p>{message}</p>
        </div>
    ) : (
        <></>
    );
}

export default FlashMessage;
