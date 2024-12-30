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
 * 65-024-VBB-CP-doublesideunit
 *
 I just want to do a recap on the naming of the images.
    - name should have the sku of the vanity and if the image have a side unit, include it as well.
    - each sku must be separate by a "~" character.
    - add "-left" or "-right" (depending on the position of the vanity) at the end of the vanity sku if the image has a side unit.
    - if the image has double vanity add "-double" to the end of the vanity sku.
    - if the image has double side unit (opera and new york), add "-doublesideunit" at the end of the vanity sku and add "-double" at the end of the side unit sku.
    - if the image has double vanity and a side unit in the middle, add "-doublecenteredsideunit" at the end of the vanity sku.
    - after following this naming convention, if you have more than one picture with the same name, add "~1" or "~2" , etc (depending on the number of images) at the end of the name of the image.
    - NO SPACES!!

Examples
    - image with only vanity: 73-VB-024-M16.webp
    - image with vanity left side and side unit: 73-VB-024-M23-left~73-SO-012-M16.webp
    - image with double vanity: 71-VB-024-M15-V15-double.webp
    - 3rd image with centered vanity and 2 side units on each side: 65-024-VBB-CP-doublesideunit~65-012-SCB-RX-CP-double~3.webp
    - image with double vanity and centered side unit: 71-VB-024-M15-V15-doublecenteredsideunit~65-012-SCB-RX-CP.webp
 *
 */

const imageURL = import.meta.env.MODE === "development" ? "https://portal.davidici.com/api" : "";

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
    // console.log("===== useImagesComposition =====");
    // console.log("model: ", model);
    // console.log("vanitySku: ", vanitySku);
    // console.log("isDoubleSink: ", isDoubleSink);
    // console.log("sinkPosition: ", sinkPosition);
    // console.log("hasSideUnit: ", hasSideUnit);
    // console.log("sideUnitSku: ", sideUnitSku);
    // console.log("isDoubleSideUnit: ", isDoubleSideUnit);
    // console.log("currentProducts: ", currentProducts);
    // console.log("currentMirrors: ", currentMirrors);
    // console.log("==============================");
    const { data: compositionImages } = useQuery({
        queryKey: ["modelImagesCompositionData"],
        queryFn: () =>
            axios
                .get(
                    `${imageURL}/express-program/composition-images?model=${model.toLocaleLowerCase()}`
                )
                .then((res) => res.data),
    });



    return useMemo(() => {
        if (!vanitySku) return [];
        const skus: string[] = [];
        const finalVanitySku = isDoubleSink && !hasSideUnit
            ? `${vanitySku}-double`
            : isDoubleSink && hasSideUnit
            ? `${vanitySku}-doublecenteredsideunit`
            : sinkPosition === "LEFT" || sinkPosition === "RIGHT"
            ? `${vanitySku}-${sinkPosition.toLowerCase()}`
            : isDoubleSideUnit
            ? `${vanitySku}-doublesideunit`
            : vanitySku;

        skus.push(`(?=.*${finalVanitySku})`);

        hasSideUnit &&
            skus.push(
                `(.*${
                    isDoubleSideUnit ? sideUnitSku + "-double" : sideUnitSku
                })?`
            );

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

        console.log("skus:", skus);
        console.log("skusRegex: ", skusRegex);

        if (compositionImages) {
            const { images } = compositionImages;
            console.log("images: ", images);

            for (const image of images) {
                const name: string = image["composition_name"];
                // console.log("-- iterating --");
                // console.log("image name: ", name);
                // console.log("skusRegex: ", skusRegex);
                // console.log("is image name valid: ", skusRegex.test(name));

                if (skusRegex.test(name)) {
                    if (
                        !hasSideUnit &&
                        (name.includes("left") || name.includes("right"))
                    )
                        continue;

                    if (!isDoubleSink && !isDoubleSideUnit && name.includes("double")) continue;
                    if (!isDoubleSideUnit && name.includes("doublesideunit")) continue;

                    imageUrls.push(image["image_url"]);
                }
            }
        }
        // console.log("imageUrls: ", imageUrls);
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
