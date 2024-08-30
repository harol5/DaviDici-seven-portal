import classes from "../../../css/product-configurator.module.css";

interface ConfigurationNameProps {
    crrName: string;
    onChange: (name: string) => void;
    isMissingLabel: boolean;
}

function ConfigurationName({
    crrName,
    onChange: handleConfigurationLabel,
    isMissingLabel,
}: ConfigurationNameProps) {
    return (
        <section className={classes.configurationName}>
            <label htmlFor="compositionName">Name of Composition:</label>
            <input
                type="text"
                name="compositionName"
                value={crrName}
                id="compositionName"
                placeholder="e.g. 'main bathroom'"
                onChange={(e) => handleConfigurationLabel(e.target.value)}
                maxLength={25}
            />
            {isMissingLabel && (
                <p>*Please provide a name to your composition</p>
            )}
        </section>
    );
}

export default ConfigurationName;
