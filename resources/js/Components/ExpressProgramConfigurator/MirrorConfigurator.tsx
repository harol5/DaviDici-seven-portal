import ItemPropertiesAccordion from "./ItemPropertiesAccordion";
import Options from "./Options";
import classes from "../../../css/product-configurator.module.css";
import {
    MirrorCabinetsOptions,
    MirrorCategory,
    MirrorConfig,
} from "../../Models/MirrorConfigTypes";
import type { Item } from "../../Models/ModelConfigTypes";
import type { Option } from "../../Models/ExpressProgramModels";

interface MirrorConfiguratorProps {
    mirrorCabinetOptions: MirrorCabinetsOptions;
    ledMirrorOptions: Option[];
    openCompMirrorOptions: Option[];
    crrMirrorCategory: MirrorCategory;
    currentMirrorsConfiguration: MirrorConfig;
    accordionState: Record<Item, boolean>;
    handleSwitchCrrMirrorCategory: (mirrorCategory: MirrorCategory) => void;
    clearMirrorCategory: (mirrorCategory: MirrorCategory) => void;
    handleOptionSelected: (
        item: string,
        property: string,
        option: string
    ) => void;
    handleAccordionState: (item: Item) => void;
}

function MirrorConfigurator({
    mirrorCabinetOptions,
    ledMirrorOptions,
    openCompMirrorOptions,
    crrMirrorCategory,
    currentMirrorsConfiguration,
    accordionState,
    handleSwitchCrrMirrorCategory,
    clearMirrorCategory,
    handleOptionSelected,
    handleAccordionState,
}: MirrorConfiguratorProps) {
    const isDisplayable = (mirrorCategory: MirrorCategory): boolean => {
        if (mirrorCategory === "mirrorCabinet") {
            return (
                mirrorCabinetOptions.baseSku !== "" &&
                crrMirrorCategory === mirrorCategory
            );
        }

        if (mirrorCategory === "ledMirror") {
            return (
                ledMirrorOptions.length > 0 &&
                crrMirrorCategory === mirrorCategory
            );
        }

        if (mirrorCategory === "openCompMirror") {
            return (
                openCompMirrorOptions.length > 0 &&
                crrMirrorCategory === mirrorCategory
            );
        }

        return false;
    };

    return (
        <ItemPropertiesAccordion
            headerTitle="MIRRORS"
            item="mirror"
            isOpen={accordionState.mirror}
            onClick={handleAccordionState}
        >
            <section className={classes.mirrorCategories}>
                <div className={classes.mirrorCategoriesSwitchers}>
                    <button
                        className={
                            crrMirrorCategory === "mirrorCabinet"
                                ? classes.mirrorCategorySelected
                                : ""
                        }
                        onClick={() =>
                            handleSwitchCrrMirrorCategory("mirrorCabinet")
                        }
                    >
                        MIRROR CABINETS
                    </button>
                    {ledMirrorOptions.length > 0 && (
                        <button
                            className={
                                crrMirrorCategory === "ledMirror"
                                    ? classes.mirrorCategorySelected
                                    : ""
                            }
                            onClick={() =>
                                handleSwitchCrrMirrorCategory("ledMirror")
                            }
                        >
                            LED MIRRORS
                        </button>
                    )}
                    {openCompMirrorOptions.length > 0 && (
                        <button
                            className={
                                crrMirrorCategory === "openCompMirror"
                                    ? classes.mirrorCategorySelected
                                    : ""
                            }
                            onClick={() =>
                                handleSwitchCrrMirrorCategory("openCompMirror")
                            }
                        >
                            OPEN COMPARTMENT MIRRORS
                        </button>
                    )}
                </div>
                {isDisplayable("mirrorCabinet") && (
                    <div>
                        <button
                            className={classes.clearButton}
                            onClick={() => clearMirrorCategory("mirrorCabinet")}
                        >
                            CLEAR
                        </button>
                        <Options
                            item="mirrorCabinet"
                            property="size"
                            title="SELECT SIZE"
                            options={mirrorCabinetOptions.sizeOptions}
                            crrOptionSelected={
                                currentMirrorsConfiguration.mirrorCabinet.size
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                        <Options
                            item="mirrorCabinet"
                            property="finish"
                            title="SELECT FINISH"
                            options={mirrorCabinetOptions.finishOptions}
                            crrOptionSelected={
                                currentMirrorsConfiguration.mirrorCabinet.finish
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                    </div>
                )}
                {isDisplayable("ledMirror") && (
                    <div>
                        <button
                            className={classes.clearButton}
                            onClick={() => clearMirrorCategory("ledMirror")}
                        >
                            CLEAR
                        </button>
                        <Options
                            item="ledMirror"
                            property="type"
                            title="SELECT LED MIRROR"
                            options={ledMirrorOptions}
                            crrOptionSelected={
                                currentMirrorsConfiguration.ledMirror
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                    </div>
                )}
                {isDisplayable("openCompMirror") && (
                    <div>
                        <button
                            className={classes.clearButton}
                            onClick={() =>
                                clearMirrorCategory("openCompMirror")
                            }
                        >
                            CLEAR
                        </button>
                        <Options
                            item="openCompMirror"
                            property="type"
                            title="SELECT OPEN COMPARMENT MIRROR"
                            options={openCompMirrorOptions}
                            crrOptionSelected={
                                currentMirrorsConfiguration.openCompMirror
                            }
                            onOptionSelected={handleOptionSelected}
                        />
                    </div>
                )}
            </section>
        </ItemPropertiesAccordion>
    );
}

export default MirrorConfigurator;
