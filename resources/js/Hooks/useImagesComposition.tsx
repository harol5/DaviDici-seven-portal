import { useQuery } from "@tanstack/react-query";
import { Model } from "../Models/ModelConfigTypes";
import axios from "axios";
import { ProductInventory } from "../Models/Product";
import { useMemo } from "react";

function useImagesComposition(
    model: Model,
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

    const skus = useMemo(() => {
        const skus: string[] = [];
        currentProducts.forEach((product) => skus.push(product.uscode));
        currentMirrors.forEach((mirror) => skus.push(mirror.uscode));
        return skus;
    }, [currentProducts, currentMirrors]);

    if (compositionImages) {
        console.log("==== useImagesComposition ====");
        console.log(compositionImages);
        console.log(skus);
    }
}

export default useImagesComposition;
