import { useEffect, useMemo, useState } from "react";
import UserAuthenticatedLayout from "../../Layouts/UserAuthenticatedLayout";
import User from "../../Models/User";
import { Composition } from "../../Models/Composition";
import MargiConfigurator from "../../Components/ExpressProgramConfigurator/MargiConfigurator";
import NewBaliConfigurator from "../../Components/ExpressProgramConfigurator/NewBaliConfigurator";
import NewYorkConfigurator from "../../Components/ExpressProgramConfigurator/NewYorkConfigurator";
import EloraConfigurator from "../../Components/ExpressProgramConfigurator/EloraConfigurator";
import OtherModelsConfigurator from "../../Components/ExpressProgramConfigurator/OtherModelsConfigurator";

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
                {composition.model === "MARGI" ? (
                    <MargiConfigurator composition={composition} />
                ) : composition.model === "NEW BALI" ? (
                    <NewBaliConfigurator composition={composition} />
                ) : composition.model === "NEW YORK" ? (
                    <NewYorkConfigurator composition={composition} />
                ) : composition.model === "ELORA" ? (
                    <EloraConfigurator composition={composition} />
                ) : (
                    <OtherModelsConfigurator composition={composition} />
                )}
            </div>
        </UserAuthenticatedLayout>
    );
}

export default ProductConfigurator;
