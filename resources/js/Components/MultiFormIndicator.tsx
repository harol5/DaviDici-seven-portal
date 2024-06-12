import type { formIndicator } from "../Models/MultiFormIndicators";

function MultiFormIndicator({ indicators }: { indicators: formIndicator[] }) {
    return (
        <section className="flex justify-between my-16">
            {indicators.map((indicator, index) => {
                if (indicator.name === "Commercial credit application") {
                    return (
                        <span
                            key={index}
                            className={
                                indicator.isActive
                                    ? "bg-davidiciGold text-white border rounded text-center text-sm p-2"
                                    : indicator.isCompleted
                                    ? "border border-davidiciGold bg-gray-800/10 rounded text-center text-sm p-2 text-gray-500"
                                    : "border rounded text-center text-sm p-2"
                            }
                        >
                            {indicator.name}
                        </span>
                    );
                } else {
                    return (
                        <>
                            <span
                                key={index}
                                className={
                                    indicator.isActive
                                        ? "bg-davidiciGold text-white border rounded text-center text-sm p-2"
                                        : indicator.isCompleted
                                        ? "border border-davidiciGold bg-gray-800/10 rounded text-center text-sm p-2 text-gray-500"
                                        : "border rounded text-center text-sm p-2"
                                }
                            >
                                {indicator.name}
                            </span>
                            <div className="w-[20%] flex items-center px-2">
                                <span
                                    className={
                                        indicator.isCompleted
                                            ? "w-[100%] border-b-2 border-dotted border-b-davidiciGold block"
                                            : "w-[100%] border-b-2 border-dotted border-b-gray-800 block"
                                    }
                                ></span>
                            </div>
                        </>
                    );
                }
            })}
        </section>
    );
}

export default MultiFormIndicator;
