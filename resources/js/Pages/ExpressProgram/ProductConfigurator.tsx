import { useEffect, useMemo, useState } from "react";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import User from "../../Models/User";
import { Composition } from "../../Models/Composition";
import classes from "../../../css/product-configurator.module.css";
import FinishesOptionsConfigurator from "../../Components/ExpressProgramConfigurator/FinishesOptionsConfigurator";
import { ProductInventory } from "../../Models/Product";

interface ProductConfiguratorProps {
    auth: User;
    composition: Composition;
}

function ProductConfigurator({ auth, composition }: ProductConfiguratorProps) {
    const sideUnitFinishes: { finish: string; url: string }[] = useMemo(() => {
        // if there is any side unit, get finishes available
        if (composition.sideUnits.length > 0) {
            const listOfFinishesMap = new Map();

            composition.sideUnits.forEach((sideUnit) => {
                let finish = sideUnit.finish;

                if (finish.includes("/"))
                    finish = sideUnit.finish.replace("/", "-");

                const finishObj = {
                    finish: finish,
                    url: `https://portal.davidici.com/images/express-program/finishes/${finish}.jpg`,
                };

                if (!listOfFinishesMap.has(finish))
                    listOfFinishesMap.set(finish, finishObj);
            });

            return Object.values(Object.fromEntries(listOfFinishesMap));
        }

        return [];
    }, []);

    const handleSelectedFinish = (
        item: "vanities" | "sideUnits",
        finish: string
    ) => {
        let finishCopy = finish;
        if (finish.includes("-")) {
            finishCopy = finish.replace("-", "/");
        }

        const matches: ProductInventory[] = [];
        const items = composition[item];

        items.forEach((item) =>
            item.finish === finishCopy ? matches.push(item) : null
        );
    };

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = true;
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    return (
        <UserAuthenticatedLayout auth={auth} crrPage="orders">
            <div className="main-content-wrapper">
                <div className={classes.compositionConfiguratorWrapper}>
                    <section className={classes.leftSideConfiguratorWrapper}>
                        <section className={classes.backButtonAndNameWrapper}>
                            <span
                                className={classes.backButtonWrapper}
                                onClick={() => history.back()}
                            >
                                <img
                                    src="https://seven.test/images/back-triangle.svg"
                                    alt="golden triangle"
                                />
                                <p>BACK</p>
                            </span>
                            <h1>{composition.name}</h1>
                        </section>
                        <section className={classes.compositionImageWrapper}>
                            <img
                                src={composition.compositionImage}
                                alt="product images"
                            />
                        </section>
                        <section
                            className={classes.vanitiesAndSideUnitFinishes}
                        >
                            <FinishesOptionsConfigurator
                                item="vanities"
                                title="CHOOSE YOUR VANITY FINISH"
                                finishes={composition.finishes}
                                onSelectedFinish={handleSelectedFinish}
                            />

                            {sideUnitFinishes.length > 0 && (
                                <FinishesOptionsConfigurator
                                    item="sideUnits"
                                    title="CHOOSE YOUR SIDE UNIT FINISH"
                                    finishes={sideUnitFinishes}
                                    onSelectedFinish={handleSelectedFinish}
                                />
                            )}
                        </section>
                    </section>
                    <section
                        className={classes.rightSideConfiguratorWrapper}
                    ></section>
                </div>
            </div>
        </UserAuthenticatedLayout>
    );
}

export default ProductConfigurator;
