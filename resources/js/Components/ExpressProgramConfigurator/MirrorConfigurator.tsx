import ItemPropertiesAccordion from "./ItemPropertiesAccordion";
import Options from "./Options";
import classes from "../../../css/product-configurator.module.css";
import {
    MirrorCabinetsOptions,
    MirrorCategory,
    MirrorConfig,
} from "../../Models/MirrorConfigTypes";
import type { Option } from "../../Models/ExpressProgramModels";

interface MirrorConfiguratorProps {
    mirrorCabinetOptions: MirrorCabinetsOptions;
    ledMirrorOptions: Option[];
    openCompMirrorOptions: Option[];
    crrMirrorCategory: MirrorCategory;
    currentMirrorsConfiguration: MirrorConfig;
    handleSwitchCrrMirrorCategory: (mirrorCategory: MirrorCategory) => void;
    clearMirrorCategory: (mirrorCategory: MirrorCategory) => void;
    handleOptionSelected: (
        item: string,
        property: string,
        option: string
    ) => void;
}

function MirrorConfigurator({
    mirrorCabinetOptions,
    ledMirrorOptions,
    openCompMirrorOptions,
    crrMirrorCategory,
    currentMirrorsConfiguration,
    handleSwitchCrrMirrorCategory,
    clearMirrorCategory,
    handleOptionSelected,
}: MirrorConfiguratorProps) {
    return (
        <ItemPropertiesAccordion headerTitle="MIRRORS">
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
                </div>
                {crrMirrorCategory === "mirrorCabinet" && (
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
                {crrMirrorCategory === "ledMirror" && (
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
                {crrMirrorCategory === "openCompMirror" && (
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
