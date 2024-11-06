import type { Composition } from "../Models/Composition";
import classes from "../../css/express-program.module.css";
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
                    <div className={classes.compositionInfo}>
                        <div className={classes.nameAndPriceWrapper}>
                            <h1 className={classes.compositionName}>
                                {splitedCompositionName[0]} <br />
                                {composition.model === "RAFFAELLO" ||
                                composition.model === "MIRRORS"
                                    ? ""
                                    : "Incl"}
                                {splitedCompositionName[1]}
                            </h1>
                            <p className={classes.startingPriceLabel}>
                                Starting at ${composition.startingPrice}
                            </p>
                        </div>
                        <div className={classes.finishesContainer}>
                            {composition.finishes.map((value, index) => {
                                return (
                                    <Finish
                                        key={index}
                                        composition={composition}
                                        finishObj={value}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductExpressProgramCard;

interface FinishProps {
    composition: Composition;
    finishObj: {
        finish: string;
        url: string;
    };
}

function Finish({ composition, finishObj }: FinishProps) {
    const formatFinishLabel = () => {
        if (composition.model === "ELORA" && finishObj.finish.includes("-")) {
            return finishObj.finish.split("-")[0].replace("MATT LACQ. ", "");
        }

        if (
            composition.model === "NEW BALI" ||
            composition.model === "OPERA" ||
            composition.model === "KORA" ||
            (composition.model === "MARGI" &&
                finishObj.finish.includes("MATT LACQ. "))
        ) {
            return finishObj.finish.replace("MATT LACQ. ", "");
        }

        if (
            composition.model === "NEW YORK" &&
            finishObj.finish.includes("GLOSSY LACQ. ")
        ) {
            return finishObj.finish.replace("GLOSSY LACQ. ", "");
        }

        return finishObj.finish;
    };

    return (
        <div className={classes.finish}>
            <img src={finishObj.url} />
            <p>{formatFinishLabel()}</p>
        </div>
    );
}
