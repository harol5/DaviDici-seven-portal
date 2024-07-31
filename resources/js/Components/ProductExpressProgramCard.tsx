import type { Composition } from "../Models/Composition";
import classes from "../../css/express-program.module.css";
import type { ProductInventory } from "../Models/Product";
import { router } from "@inertiajs/react";

interface ProductExpressProgramCardProps {
    composition: Composition;
}

function ProductExpressProgramCard({
    composition,
}: ProductExpressProgramCardProps) {
    const handleProduct = () => {
        router.post("/express-program/set-product", composition);
    };

    const splitedCompositionName = composition.name.split("Incl");

    return (
        <div className={classes.expressProgramProductCardLayout}>
            <div
                className={classes.expressProgramProductCard}
                onClick={handleProduct}
            >
                <div className={classes.productCardcontent}>
                    <div className={classes.compositionImage}>
                        <img
                            src={composition.compositionImage}
                            alt="composition image"
                            loading="lazy"
                            onError={(e) => {
                                (e.target as HTMLImageElement).onerror = null;
                                (e.target as HTMLImageElement).src =
                                    "https://portal.davidici.com/images/express-program/not-image.jpg";
                            }}
                        />
                    </div>
                    <div className={classes.finishesContainer}>
                        {composition.finishes.map((value, index) => {
                            const finishObj = value as {
                                finish: string;
                                url: string;
                            };
                            return (
                                <div key={index} className={classes.finish}>
                                    <img src={finishObj.url} />
                                    <p>{finishObj.finish}</p>
                                </div>
                            );
                        })}
                    </div>
                    <h1 className={classes.compositionName}>
                        {splitedCompositionName[0]} <br />
                        Incl{splitedCompositionName[1]}
                    </h1>
                    <p className={classes.startingPriceLabel}>
                        Starting at ${composition.startingPrice}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ProductExpressProgramCard;
