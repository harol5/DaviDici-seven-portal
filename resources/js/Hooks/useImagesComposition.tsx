import { useQuery } from "@tanstack/react-query";
import { Model } from "../Models/ModelConfigTypes";
import axios from "axios";

function useImagesComposition(model: Model) {
    const { data: compositionImages } = useQuery({
        queryKey: ["modelImagesCompositionData"],
        queryFn: () =>
            axios
                .get(
                    `/express-program/composition-images?model=${model.toLocaleLowerCase()}`
                )
                .then((res) => res.data),
    });

    console.log("==== TESTING REACT QUERY ====");
    if (compositionImages) {
        console.log(compositionImages);
    }
}

export default useImagesComposition;
