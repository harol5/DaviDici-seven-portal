import { useQuery } from "@tanstack/react-query";
import { Model } from "../Models/ModelConfigTypes";
import axios from "axios";
import { ProductInventory } from "../Models/Product";
import { useMemo } from "react";

/**
 * TODO:
 * 1, come up with a format for images that has double sink or double side units.
 *
 * images that include double sink will have at the end of the vanity sku "**2"
 * for example: 56-VB-024-RR**2~other_skus...
 */

function useImagesComposition(
    model: Model,
    vanitySku: string,
    isDoubleSink: boolean,
    hasSideUnit: boolean,
    sideUnitSku: string,
    isDoubleSideUnit: boolean,
    currentProducts: ProductInventory[],
    currentMirrors: ProductInventory[]
) {
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
        console.log("==== useImagesComposition (useMemo ran!!) ====");
        console.log("composition images:", compositionImages);
        console.log("vanity sku:", vanitySku);
        console.log("has side unit:", hasSideUnit);
        console.log("side unit sku:", sideUnitSku);

        if (!vanitySku || (hasSideUnit && !sideUnitSku))
            return ["not image for this config (display deafult image)"];

        const skus: string[] = [];

        skus.push(`(?=.*${vanitySku})`);
        hasSideUnit && skus.push(`(?=.*${sideUnitSku})`);

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

                if (skusRegex.test(name)) {
                    console.log("== checking image name ==");
                    console.log("At least one string from the set is present.");
                    console.log("image name:", name);
                    console.log("current skus:", skus);
                    imageUrls.push(image["image_url"]);
                }
            });
        }

        return imageUrls.length === 0
            ? ["not image for this config (display deafult image)"]
            : imageUrls;
    }, [
        currentProducts,
        currentMirrors,
        compositionImages,
        vanitySku,
        sideUnitSku,
    ]);
}

export default useImagesComposition;
