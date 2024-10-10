import { ProductInventory } from "../../Models/Product";
import classes from "../../../css/configuration-breakdown.module.css";
import { useState } from "react";

interface ConfigurationBreakdownProps {
    productsConfigurator: ProductInventory[];
    mirrorProductsConfigurator: ProductInventory[];
    isDoubleSink: boolean;
    isDoubleSideUnit: boolean;
}

function ConfigurationBreakdown({
    productsConfigurator,
    mirrorProductsConfigurator,
    isDoubleSink,
    isDoubleSideUnit,
}: ConfigurationBreakdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const getClasses = () => {
        let base = classes.configurationBreakdown;
        base += isOpen ? ` ${classes.activeBreakdown}` : "";
        return base;
    };

    const getTriangleIconClasses = () => {
        let base = classes.triangleDownIcon;
        base += isOpen ? ` ${classes.rotateTriangle}` : "";
        return base;
    };

    return (
        <div className={classes.breakdownWrapper}>
            <section className={getClasses()}>
                <div className={classes.configurationBreakdownContent}>
                    <h2 className={classes.headerTitle}>
                        CURRENT PRODUCTS SELECTED
                    </h2>
                    {productsConfigurator.length === 0 &&
                    mirrorProductsConfigurator.length === 0 ? (
                        <p>No Products Selected.</p>
                    ) : null}
                    {productsConfigurator.map((product, index) => (
                        <BreakdownCard
                            key={index}
                            product={product}
                            isDoubleSink={isDoubleSink}
                            isDoubleSideUnit={isDoubleSideUnit}
                        />
                    ))}
                    {mirrorProductsConfigurator.map((product, index) => (
                        <BreakdownCard
                            key={index}
                            product={product}
                            isDoubleSink={isDoubleSink}
                            isDoubleSideUnit={isDoubleSideUnit}
                        />
                    ))}
                </div>
            </section>
            <button
                className={classes.breakdownButton}
                onClick={() => setIsOpen(!isOpen)}
            >
                <img
                    className={getTriangleIconClasses()}
                    src={`https://${location.hostname}/images/arrow-down.svg`}
                    alt="triangle pointing down"
                />
                current config
                <img
                    className={getTriangleIconClasses()}
                    src={`https://${location.hostname}/images/arrow-down.svg`}
                    alt="triangle pointing down"
                />
            </button>
        </div>
    );
}

const BreakdownCard = ({
    product,
    isDoubleSink,
    isDoubleSideUnit,
}: {
    product: ProductInventory;
    isDoubleSink: boolean;
    isDoubleSideUnit: boolean;
}) => {
    const getPrice = () => {
        const price = product.sprice ? product.sprice : product.msrp;
        if (product.item === "VANITY" && isDoubleSink)
            return `$${price} x 2 = $${price * 2}`;
        if (product.item === "SIDE UNIT" && isDoubleSideUnit)
            return `$${price} x 2 = $${price * 2}`;

        return `$${price}`;
    };

    return (
        <div className={classes.breakdownCard}>
            <h3 className={classes.item}>{product.item}:</h3>
            <div className={classes.breakdownCardContent}>
                <p className={classes.description}>{product.descw}</p>
                <p className={classes.sku}>{product.uscode}</p>
                <p className={classes.price}>{getPrice()}</p>
            </div>
        </div>
    );
};

export default ConfigurationBreakdown;
