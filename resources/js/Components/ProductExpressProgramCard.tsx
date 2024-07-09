import type { Composition } from "../Models/Composition";
import classes from "../../css/express-program.module.css";
import type { ProductInventory } from "../Models/Product";
import { router } from "@inertiajs/react";

interface ProductExpressProgramCardProps {
    product: Composition;
}

function ProductExpressProgramCard({
    product,
}: ProductExpressProgramCardProps) {
    const getStartingPrice = () => {
        if (product.sideUnits.length > 0) {
            product.sideUnits.sort(
                (a: ProductInventory, b: ProductInventory) => a.msrp - b.msrp
            );
            return (
                product.vanities[0].msrp +
                product.washbasins[0].msrp +
                product.sideUnits[0].msrp
            );
        }

        return product.vanities[0].msrp + product.washbasins[0].msrp;
    };

    const handleProduct = () => {
        router.post("/express-program/set-product", product);
    };

    return (
        <div
            className={classes.expressProgramProductCard}
            onClick={handleProduct}
        >
            <div className={classes.productCardcontent}>
                <div className={classes.compositionImage}>
                    <img
                        src={product.compositionImage}
                        alt="composition image"
                        loading="lazy"
                        onError={(e) => {
                            (e.target as HTMLImageElement).onerror = null;
                            (e.target as HTMLImageElement).src =
                                "https://seven.test/images/express-program/not-image.jpg";
                        }}
                    />
                </div>
                <h1 className={classes.compositionName}>{product.name}</h1>
                <p className={classes.startingPriceLabel}>
                    Starting at ${getStartingPrice()}
                </p>
                <div className={classes.finishesContainer}>
                    {product.finishes.map((value, index) => {
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
            </div>
        </div>
    );
}

export default ProductExpressProgramCard;
