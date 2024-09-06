import { useMemo } from "react";
import { ProductInventory } from "../Models/Product";
import type { Option } from "../Models/ExpressProgramModels";
import type { MirrorCabinetsOptions } from "../Models/MirrorConfigTypes";

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

    return useMemo(() => {
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
}

export default useMirrorOptions;
