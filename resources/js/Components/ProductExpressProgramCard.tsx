import type { Composition } from "../Models/Composition";
import classes from "../../css/express-program.module.css";
import type { ProductInventory } from "../Models/Product";

interface ProductExpressProgramCardProps {
    product: Composition;
}

function ProductExpressProgramCard({
    product,
}: ProductExpressProgramCardProps) {
    const getStartingPrice = () => {
        if (product.sideUnits[0]) {
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

    return (
        <div className={classes.expressProgramProductCard}>
            <div className={classes.productCardcontent}>
                <h1>{product.name}</h1>
                <p>Starting at ${getStartingPrice()}</p>
            </div>
        </div>
    );
}

export default ProductExpressProgramCard;
