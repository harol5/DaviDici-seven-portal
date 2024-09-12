import { useMemo, useState } from "react";
import { ProductInventory } from "../Models/Product";
import type { Option } from "../Models/ExpressProgramModels";
import type {
    MirrorCabinetsOptions,
    mirrorCategories,
} from "../Models/MirrorConfigTypes";

type MirrorCategories = {
    mirrorCabinets: ProductInventory[];
    openCompMirrors: ProductInventory[];
    ledMirrors: ProductInventory[];
};

function useMirrorOptions(mirrors: ProductInventory[]) {
    const createMirrorsMap = (): MirrorCategories => {
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

            if (ledMirrorModels[mirror.model as keyof typeof ledMirrorModels]) {
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
                    imgUrl: `https://${location.hostname}/images/express-program/not-image.jpg`,
                    title: `${codes[1]}"`,
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
                imgUrl: `https://${location.hostname}/images/express-program/not-image.jpg`,
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
                imgUrl: `https://${location.hostname}/images/express-program/not-image.jpg`,
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
        useState<mirrorCategories>("mirrorCabinet");

    const handleSwitchCrrMirrorCategory = (
        mirrorCategory: mirrorCategories
    ) => {
        if (crrMirrorCategory === "mirrorCabinet") {
            setMirrorCabinetOptions(initialMirrorCabinetOptions);
            setMirrorCabinetStatus({
                isMirrorCabinetSelected: false,
                isMirrorCabinetValid: false,
            });
        }

        setCrrMirrorCategory(mirrorCategory);
    };

    const handleMirrorOptionSelected = (
        item: string,
        property: string,
        option: string,
        isValid: boolean = false
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

            setMirrorCabinetOptions(copyOptions);
            !mirrorCabinetStatus.isMirrorCabinetSelected &&
                setMirrorCabinetStatus((prev) => ({
                    ...prev,
                    isMirrorCabinetSelected: true,
                }));

            setMirrorCabinetStatus((prev) => ({
                ...prev,
                isMirrorCabinetValid: isValid,
            }));
        }
    };

    return {
        initialMirrorCabinetOptions,
        mirrorCabinetOptions,
        setMirrorCabinetOptions,
        ledMirrorOptions,
        openCompMirrorOptions,
        mirrorCabinetStatus,
        setMirrorCabinetStatus,
        crrMirrorCategory,
        setCrrMirrorCategory,
        handleSwitchCrrMirrorCategory,
        handleMirrorOptionSelected,
    };
}

export default useMirrorOptions;
