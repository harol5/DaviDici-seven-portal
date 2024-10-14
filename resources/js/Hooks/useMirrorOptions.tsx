import { useMemo, useReducer, useState } from "react";
import { ProductInventory } from "../Models/Product";
import type { Option, OtherItems } from "../Models/ExpressProgramModels";
import {
    Name,
    MirrorCabinet,
    MirrorCabinetsOptions,
    MirrorCategory,
    MirrorCategoriesObj,
    MirrorConfig,
} from "../Models/MirrorConfigTypes";
import { getSkuAndPrice } from "../utils/helperFunc";
import { ItemFoxPro } from "../Models/ModelConfigTypes";

function useMirrorOptions(mirrors: ProductInventory[]) {
    const createMirrorsMap = (): MirrorCategoriesObj => {
        const ledMirrorModels = {
            Florence: 1,
            Verona: 2,
            Naples: 3,
            Venice: 4,
            Capri: 5,
            Bologna: 6,
            Amalfi: 7,
            Positano: 8,
        };

        const mirrorsMap = new Map();
        mirrorsMap.set("mirrorCabinets", []);
        mirrorsMap.set("openCompMirrors", []);
        mirrorsMap.set("ledMirrors", []);

        mirrors.forEach((mirror) => {
            if (
                mirror.model === "MIRROR CABINET" &&
                mirror.descw.includes("DOOR")
            ) {
                mirrorsMap.get("mirrorCabinets").push(mirror);
            }

            if (
                mirror.model === "MIRROR CABINET" &&
                mirror.descw.includes("OPEN COMPARTMENTS")
            ) {
                mirrorsMap.get("openCompMirrors").push(mirror);
            }

            if (
                ledMirrorModels[mirror.model as keyof typeof ledMirrorModels] ||
                mirror.uscode === "20-LD-V2036-NE-US" ||
                mirror.uscode === "20-LD-R36-NE-US"
            ) {
                mirrorsMap.get("ledMirrors").push(mirror);
            }
        });

        return Object.fromEntries(mirrorsMap);
    };

    const getMirrorCabinetsOptions = (
        mirrorCabinets: ProductInventory[]
    ): MirrorCabinetsOptions => {
        let baseSku: string = "";
        const sizeOptionsMap = new Map();
        const finishOptionsMap = new Map();

        mirrorCabinets.forEach((mirror, index) => {
            const codes = mirror.uscode.split("-");
            // the following logic is only for margi because each model has a different sku number order.
            // EX:   29  -     021     - M23
            //    base sku   size      finish

            // only get base sku from first mirror.
            if (index === 0) {
                baseSku = codes[0];
            }

            if (!sizeOptionsMap.has(`${codes[1]}`))
                sizeOptionsMap.set(`${codes[1]}`, {
                    code: codes[1],
                    imgUrl: `https://${location.hostname}/images/express-program/mirrors/mirror-cabinets/${codes[1]}.webp`,
                    title: `${codes[1].substring(1)} inches`,
                    validSkus: [],
                    isDisabled: false,
                });

            sizeOptionsMap.get(`${codes[1]}`).validSkus.push(mirror.uscode);

            let finishLabel = mirror.finish;

            if (mirror.finish.includes("MATT LACQ. ")) {
                finishLabel = finishLabel.replace("MATT LACQ. ", "");
            }

            if (!finishOptionsMap.has(`${codes[2]}`))
                finishOptionsMap.set(`${codes[2]}`, {
                    code: codes[2],
                    imgUrl: `https://portal.davidici.com/images/express-program/finishes/${mirror.finish}.jpg`,
                    title: finishLabel,
                    validSkus: [],
                    isDisabled: false,
                });

            finishOptionsMap.get(`${codes[2]}`).validSkus.push(mirror.uscode);
        });

        return {
            baseSku,
            sizeOptions: Object.values(Object.fromEntries(sizeOptionsMap)),
            finishOptions: Object.values(Object.fromEntries(finishOptionsMap)),
        };
    };

    const getLedMirrorsOptions = (ledMirrors: ProductInventory[]) => {
        const all: Option[] = [];
        ledMirrors.forEach((ledMirror) => {
            all.push({
                code: ledMirror.uscode,
                imgUrl: `https://${location.hostname}/images/express-program/mirrors/led-mirrors/${ledMirror.uscode}.webp`,
                title: ledMirror.descw,
                validSkus: [ledMirror.uscode],
                isDisabled: false,
            });
        });

        return all;
    };

    const getOpenCompMirrorsOptions = (openCompMirrors: ProductInventory[]) => {
        const all: Option[] = [];
        openCompMirrors.forEach((openCompMirror) => {
            all.push({
                code: openCompMirror.uscode,
                imgUrl: `https://${location.hostname}/images/express-program/mirrors/open-comp/${openCompMirror.uscode}.webp`,
                title: openCompMirror.descw,
                validSkus: [openCompMirror.uscode],
                isDisabled: false,
            });
        });
        return all;
    };

    const {
        initialMirrorCabinetOptions,
        initialLedMirrorOptions: ledMirrorOptions,
        initialOpenCompMirrorOptions: openCompMirrorOptions,
    } = useMemo(() => {
        const mirrorCategories = createMirrorsMap();
        const initialMirrorCabinetOptions = getMirrorCabinetsOptions(
            mirrorCategories.mirrorCabinets
        );
        const initialLedMirrorOptions = getLedMirrorsOptions(
            mirrorCategories.ledMirrors
        );
        const initialOpenCompMirrorOptions = getOpenCompMirrorsOptions(
            mirrorCategories.openCompMirrors
        );

        return {
            initialMirrorCabinetOptions,
            initialLedMirrorOptions,
            initialOpenCompMirrorOptions,
        };
    }, []);

    // mirror cabinets are the only one that has a complex sku
    const [mirrorCabinetOptions, setMirrorCabinetOptions] = useState(
        initialMirrorCabinetOptions
    );

    const [mirrorCabinetStatus, setMirrorCabinetStatus] = useState({
        isMirrorCabinetSelected: false,
        isMirrorCabinetValid: false,
    });

    const [crrMirrorCategory, setCrrMirrorCategory] =
        useState<MirrorCategory>("mirrorCabinet");

    const initialMirrorsConfig: MirrorConfig = useMemo(() => {
        const mirrorCabinet: MirrorCabinet = {
            baseSku: mirrorCabinetOptions.baseSku,
            size: "",
            finish: "",
        };

        return {
            mirrorCabinet,
            mirrorCabinetSku: "",
            mirrorCabinetPrice: 0,
            ledMirror: "",
            ledMirrorPrice: 0,
            openCompMirror: "",
            openCompMirrorPrice: 0,
            currentProducts: [],
        };
    }, []);

    const reducer = (
        state: MirrorConfig,
        action: { type: string; payload: string | number | ProductInventory[] }
    ) => {
        switch (action.type) {
            // |===vvvvvv SAME MIRROR CASES FOR ALL MODELS VVVVV===|

            case "set-mirrorCabinet-size":
                return {
                    ...state,
                    mirrorCabinet: {
                        ...state.mirrorCabinet,
                        size: action.payload as string,
                    },
                };

            case "set-mirrorCabinet-finish":
                return {
                    ...state,
                    mirrorCabinet: {
                        ...state.mirrorCabinet,
                        finish: action.payload as string,
                    },
                };

            case "set-mirrorCabinet-sku":
                return {
                    ...state,
                    mirrorCabinetSku: action.payload as string,
                };

            case "set-mirrorCabinet-price":
                return {
                    ...state,
                    mirrorCabinetPrice: action.payload as number,
                };

            case "reset-mirrorCabinet":
                return {
                    ...state,
                    mirrorCabinet: {
                        ...initialMirrorsConfig.mirrorCabinet,
                    },
                    mirrorCabinetPrice: initialMirrorsConfig.mirrorCabinetPrice,
                    mirrorCabinetSku: initialMirrorsConfig.mirrorCabinetSku,
                };

            case "set-ledMirror-type":
                return {
                    ...state,
                    ledMirror: action.payload as string,
                };

            case "set-ledMirror-price":
                return {
                    ...state,
                    ledMirrorPrice: action.payload as number,
                };

            case "reset-ledMirror":
                return {
                    ...state,
                    ledMirror: initialMirrorsConfig.ledMirror,
                    ledMirrorPrice: initialMirrorsConfig.ledMirrorPrice,
                };

            case "set-openCompMirror-type":
                return {
                    ...state,
                    openCompMirror: action.payload as string,
                };

            case "set-openCompMirror-price":
                return {
                    ...state,
                    openCompMirrorPrice: action.payload as number,
                };

            case "reset-openCompMirror":
                return {
                    ...state,
                    openCompMirror: initialMirrorsConfig.openCompMirror,
                    openCompMirrorPrice:
                        initialMirrorsConfig.openCompMirrorPrice,
                };

            case "update-current-products":
                return {
                    ...state,
                    currentProducts: action.payload as ProductInventory[],
                };

            case "reset-mirror-configurator":
                return {
                    ...initialMirrorsConfig,
                };

            default:
                throw new Error("case condition not found");
        }
    };

    const [currentMirrorsConfiguration, dispatch] = useReducer(
        reducer,
        initialMirrorsConfig
    );

    // |===== HELPER FUNC =====|
    const updateCurrentProducts = (
        item: ItemFoxPro,
        action: "update" | "remove",
        product?: ProductInventory
    ) => {
        const updatedCurrentProducts = structuredClone(
            currentMirrorsConfiguration.currentProducts
        );
        const index = updatedCurrentProducts.findIndex(
            (product) => product.item === item
        );

        if (action === "update" && product) {
            if (index !== -1) updatedCurrentProducts[index] = product;
            else updatedCurrentProducts.push(product);
        }

        if (action === "remove" && index !== -1) {
            updatedCurrentProducts.splice(index, 1);
        }

        console.log("=== updateCurrentProducts ===");
        console.log(updatedCurrentProducts);

        dispatch({
            type: `update-current-products`,
            payload: updatedCurrentProducts,
        });
    };

    const handleMirrorOptionSelected = (
        item: string,
        property: string,
        option: string,
        mirrorsInventory: ProductInventory[]
    ) => {
        if (item === "mirrorCabinet") {
            const copyOptions = structuredClone(mirrorCabinetOptions);

            for (const sizeOption of copyOptions.sizeOptions) {
                if (property === "size") break;
                for (let i = 0; i < sizeOption.validSkus.length; i++) {
                    const validSku = sizeOption.validSkus[i];
                    if (validSku.includes(option)) {
                        sizeOption.isDisabled = false;
                        break;
                    }

                    if (i === sizeOption.validSkus.length - 1)
                        sizeOption.isDisabled = true;
                }
            }

            for (const finishOption of copyOptions.finishOptions) {
                if (property === "finish") break;
                for (let i = 0; i < finishOption.validSkus.length; i++) {
                    const validSku = finishOption.validSkus[i];
                    if (validSku.includes(option)) {
                        finishOption.isDisabled = false;
                        break;
                    }

                    if (i === finishOption.validSkus.length - 1)
                        finishOption.isDisabled = true;
                }
            }

            const mirrorCabinetCurrentConfiguration = structuredClone(
                currentMirrorsConfiguration.mirrorCabinet
            );

            mirrorCabinetCurrentConfiguration[
                property as keyof typeof mirrorCabinetCurrentConfiguration
            ] = option;

            const { sku, price, product } = getSkuAndPrice(
                Name,
                item,
                mirrorCabinetCurrentConfiguration,
                mirrorsInventory
            );

            dispatch({ type: `set-${item}-sku`, payload: sku });
            dispatch({
                type: `set-${item}-price`,
                payload: price,
            });
            dispatch({ type: `set-${item}-${property}`, payload: `${option}` });

            setMirrorCabinetOptions(copyOptions);
            !mirrorCabinetStatus.isMirrorCabinetSelected &&
                setMirrorCabinetStatus((prev) => ({
                    ...prev,
                    isMirrorCabinetSelected: true,
                }));

            setMirrorCabinetStatus((prev) => ({
                ...prev,
                isMirrorCabinetValid: price > 0,
            }));

            if (product) {
                updateCurrentProducts("MIRROR", "update", product);
            }
        }

        if (item === "ledMirror") {
            const { sku, price, product } = getSkuAndPrice(
                Name,
                item,
                {},
                mirrorsInventory,
                option
            );

            dispatch({
                type: `set-${item}-type`,
                payload: sku === "none" ? "" : sku,
            });
            dispatch({
                type: `set-${item}-price`,
                payload: price,
            });

            if (product) {
                updateCurrentProducts("MIRROR", "update", product);
            }
        }

        if (item === "openCompMirror") {
            const { sku, price, product } = getSkuAndPrice(
                Name,
                item,
                {},
                mirrorsInventory,
                option
            );

            dispatch({
                type: `set-${item}-type`,
                payload: sku === "none" ? "" : sku,
            });
            dispatch({
                type: `set-${item}-price`,
                payload: price,
            });

            if (product) {
                updateCurrentProducts("MIRROR", "update", product);
            }
        }
    };

    const handleSwitchCrrMirrorCategory = (mirrorCategory: MirrorCategory) => {
        if (crrMirrorCategory === "mirrorCabinet") {
            setMirrorCabinetOptions(initialMirrorCabinetOptions);
            setMirrorCabinetStatus({
                isMirrorCabinetSelected: false,
                isMirrorCabinetValid: false,
            });
        }

        setCrrMirrorCategory(mirrorCategory);
        dispatch({ type: `reset-${crrMirrorCategory}`, payload: "" });
    };

    const handleResetMirrorConfigurator = () => {
        setMirrorCabinetOptions(initialMirrorCabinetOptions);
        setMirrorCabinetStatus({
            isMirrorCabinetSelected: false,
            isMirrorCabinetValid: false,
        });
        setCrrMirrorCategory("mirrorCabinet");
        dispatch({ type: "reset-mirror-configurator", payload: "" });
    };

    const handleClearMirrorCategory = (mirrorCategory: MirrorCategory) => {
        switch (mirrorCategory) {
            case "mirrorCabinet":
                updateCurrentProducts("MIRROR", "remove");
                setMirrorCabinetOptions(initialMirrorCabinetOptions);
                setMirrorCabinetStatus({
                    isMirrorCabinetSelected: false,
                    isMirrorCabinetValid: false,
                });
                dispatch({ type: "reset-mirrorCabinet", payload: "" });
                break;

            case "ledMirror":
                updateCurrentProducts("MIRROR", "remove");
                dispatch({ type: "reset-ledMirror", payload: "" });
                break;

            case "openCompMirror":
                updateCurrentProducts("MIRROR", "remove");
                dispatch({ type: "reset-openCompMirror", payload: "" });
                break;

            default:
                throw new Error("case condition not found");
        }
    };

    const getFormattedMirrorSkus = (
        model: string,
        label: string,
        allFormattedSkus: string[]
    ) => {
        const {
            mirrorCabinetSku,
            ledMirror: ledMirrorSku,
            openCompMirror: openCompMirrorSku,
        } = currentMirrorsConfiguration;

        const mirrorCabinetFormattedSku = mirrorCabinetSku
            ? `${mirrorCabinetSku}!!${model}--1##${label}`
            : "";
        mirrorCabinetFormattedSku &&
            allFormattedSkus.push(mirrorCabinetFormattedSku);

        const ledMirrorFormattedSku = ledMirrorSku
            ? `${ledMirrorSku}!!${model}--1##${label}`
            : "";
        ledMirrorFormattedSku && allFormattedSkus.push(ledMirrorFormattedSku);

        const openCompMirrorFormattedSku = openCompMirrorSku
            ? `${openCompMirrorSku}!!${model}--1##${label}`
            : "";
        openCompMirrorFormattedSku &&
            allFormattedSkus.push(openCompMirrorFormattedSku);
    };

    const getMirrorProductObj = (
        mirrorsInventory: ProductInventory[],
        otherProducts: OtherItems
    ) => {
        const {
            mirrorCabinetSku,
            ledMirror: ledMirrorSku,
            openCompMirror: openCompMirrorSku,
        } = currentMirrorsConfiguration;

        const mirrorSku = mirrorCabinetSku || ledMirrorSku || openCompMirrorSku;

        const mirrorObj = mirrorsInventory.find(
            (mirror) => mirror.uscode === mirrorSku
        );
        mirrorObj && otherProducts.mirror.push(mirrorObj);
    };

    const isMirrorCabinetConfigValid = () => {
        const { isMirrorCabinetSelected, isMirrorCabinetValid } =
            mirrorCabinetStatus;

        return (
            !isMirrorCabinetSelected ||
            (isMirrorCabinetSelected && isMirrorCabinetValid)
        );
    };

    return {
        mirrorCabinetOptions,
        ledMirrorOptions,
        openCompMirrorOptions,
        crrMirrorCategory,
        currentMirrorsConfiguration,
        handleSwitchCrrMirrorCategory,
        handleMirrorOptionSelected,
        handleResetMirrorConfigurator,
        handleClearMirrorCategory,
        getFormattedMirrorSkus,
        getMirrorProductObj,
        isMirrorCabinetConfigValid,
    };
}

export default useMirrorOptions;
