import classes from "../../../css/product-configurator.module.css";

interface FinishesOptionsConfiguratorProps {
    item: "vanities" | "sideUnits";
    title: string;
    finishes: {
        finish: string;
        url: string;
    }[];
    crrFinishSelected?: string;
    onSelectedFinish: (item: "vanities" | "sideUnits", finish: string) => void;
}

function FinishesOptionsConfigurator({
    item,
    title,
    finishes,
    crrFinishSelected,
    onSelectedFinish: handleSelectedFinish,
}: FinishesOptionsConfiguratorProps) {
    return (
        <section className={classes.titleAndFinishesWrapper}>
            <h1 className={classes.title}>{title}</h1>
            <div className={classes.finishesWrapper}>
                {finishes.map((finish, index) => {
                    return (
                        <div
                            key={index}
                            className={classes.finish}
                            onClick={() =>
                                handleSelectedFinish(item, finish.finish)
                            }
                        >
                            <img src={finish.url} />
                            <p>{finish.finish}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default FinishesOptionsConfigurator;
