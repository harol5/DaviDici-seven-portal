import type { formIndicator } from "../Models/MultiFormIndicators";

function MultiFormIndicator({ indicators }: { indicators: formIndicator[] }) {
    return (
        <section>
            {indicators.map((indicator) => (
                <span
                    className={
                        indicator.isActive
                            ? "bg-davidiciGold text-white border"
                            : "border"
                    }
                >
                    {indicator.name}
                </span>
            ))}
        </section>
    );
}

export default MultiFormIndicator;
