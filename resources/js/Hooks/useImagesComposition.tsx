import { useQuery } from "@tanstack/react-query";
import { Model } from "../Models/ModelConfigTypes";
import axios from "axios";
import { ProductInventory } from "../Models/Product";
import { useMemo } from "react";

/**
 * images that have double sink, vanity sku will be named as follows:
 * 68-VB-024D-P1-OR-double
 *
 * images that have vanity position will be named as follows:
 * 68-VB-024D-P1-left
 * 68-VB-024D-P1-right
 *
 *
 */

interface useImagesCompositionProps {
    model: Model;
    vanitySku: string;
    isDoubleSink: boolean;
    sinkPosition: string;
    hasSideUnit: boolean;
    sideUnitSku: string;
    isDoubleSideUnit: boolean;
    currentProducts: ProductInventory[];
    currentMirrors: ProductInventory[];
}

function useImagesComposition({
    model,
    vanitySku,
    isDoubleSink,
    sinkPosition,
    hasSideUnit,
    sideUnitSku,
    isDoubleSideUnit,
    currentProducts,
    currentMirrors,
}: useImagesCompositionProps) {
    const { data: compositionImages } = useQuery({
        queryKey: ["modelImagesCompositionData"],
        queryFn: () =>
            axios
                .get(
                    `/express-program/composition-images?model=${model.toLocaleLowerCase()}`
                )
                .then((res) => res.data),
    });

    return useMemo(() => {
        if (!vanitySku || (hasSideUnit && !sideUnitSku)) return [];

        const skus: string[] = [];

        const finalVanitySku = isDoubleSink
            ? `${vanitySku}-double`
            : sinkPosition === "LEFT" || sinkPosition === "RIGHT"
            ? `${vanitySku}-${sinkPosition}`
            : vanitySku;

        hasSideUnit &&
            skus.push(
                `(?=.*${
                    isDoubleSideUnit ? sideUnitSku + "-double" : sideUnitSku
                })`
            );

        skus.push(`(?=.*${finalVanitySku})`);

        for (const product of currentProducts) {
            if (product.item === "VANITY" || product.item === "SIDE UNIT")
                continue;

            skus.push(`(.*${product.uscode})?`);
        }

        for (const mirror of currentMirrors) {
            skus.push(`(.*${mirror.uscode})?`);
        }

        const skusRegex = new RegExp(skus.join(""));
        const imageUrls: string[] = [];

        if (compositionImages) {
            const { images } = compositionImages;
            images.forEach((image: any) => {
                const name: string = image["composition_name"];
                if (skusRegex.test(name)) imageUrls.push(image["image_url"]);
            });
        }

        return imageUrls.length === 0 ? [] : imageUrls;
    }, [
        currentProducts,
        currentMirrors,
        compositionImages,
        vanitySku,
        sideUnitSku,
    ]);
}

export default useImagesComposition;

// console.log("==== useImagesComposition (useMemo ran!!) ====");
// console.log("composition images:", compositionImages);
// console.log("vanity sku:", vanitySku);
// console.log("has side unit:", hasSideUnit);
// console.log("side unit sku:", sideUnitSku);
// console.log("is double sink?", isDoubleSink);
// console.log("sink position", sinkPosition);
// console.log("is double side unit", isDoubleSideUnit);
// console.log("final vanity sku:", finalVanitySku);
// console.log("skus array for regex:", skus);
// console.log("== checking image name ==");
// console.log("At least one string from the set is present.");
// console.log("image name:", name);
// console.log("current skus:", skus);
