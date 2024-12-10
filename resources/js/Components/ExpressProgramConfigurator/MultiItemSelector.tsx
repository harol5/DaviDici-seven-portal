import type {
    ExtraItems,
    ItemOptions,
} from "../../Models/ExtraItemsHookModels.ts";

interface MultiItemOptionsProps {
    item: keyof ExtraItems;
    initialOptions: ItemOptions;
    extraItems: ExtraItems;
    handleAddExtraProduct: (item: keyof ExtraItems, initialOptions: ItemOptions) => void;
    setCurrentDisplayItem: (item: keyof ExtraItems, index: number) => void;
    removeConfiguration: (item: keyof ExtraItems, index: number) => void;
}

function MultiItemSelector({
    item,
    initialOptions,
    extraItems,
    handleAddExtraProduct,
    setCurrentDisplayItem,
    removeConfiguration
}: MultiItemOptionsProps) {
    return (
        <>
            <div className="flex gap-2">
                <button
                    className={
                        extraItems[item].currentlyDisplay === -1 ? "border rounded bg-davidiciGold text-white py-1 px-2" : "border rounded border-davidiciGold py-1 px-2"
                    }
                    onClick={() => setCurrentDisplayItem(item, -1)}
                >
                    main
                </button>
                {extraItems[item].configurations.map((_configuration, index) => (
                    <span
                        key={index}
                        className={extraItems[item].currentlyDisplay === index ? "flex border rounded bg-davidiciGold" : "flex border rounded border-davidiciGold"}
                    >
                        <span
                            className={extraItems[item].currentlyDisplay === index ? "text-white py-1 px-2 cursor-pointer" : "py-1 px-2 cursor-pointer"}
                            onClick={() => setCurrentDisplayItem(item, index)}
                        >
                            {`${item} ${index + 1}`}
                        </span>
                        <button
                            className="px-2 mr-1 rounded h-[80%] self-center hover:bg-red-500 hover:text-white"
                            onClick={() => removeConfiguration(item, index)}
                        >
                            x
                        </button>
                    </span>)
                )}
                <button
                    className="px-2 rounded hover:bg-davidiciGold hover:text-white"
                    onClick={() => handleAddExtraProduct(item, initialOptions)}
                >
                    +
                </button>
            </div>
        </>
    )
}

export default MultiItemSelector
