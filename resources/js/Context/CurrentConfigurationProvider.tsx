import { createContext, ReactNode, useState } from "react";

const CurrentConfigContext = createContext({});

interface CurrentConfigurationProviderProps {
    children?: ReactNode;
}

export const CurrentConfigurationProvider = ({
    children,
}: CurrentConfigurationProviderProps) => {
    const [currentConfig, setCurrentConfig] = useState({});

    const handleSetCurrentConfig = (crrConfig: any) => {
        setCurrentConfig(crrConfig);
    };

    return (
        <CurrentConfigContext.Provider
            value={{ currentConfig, handleSetCurrentConfig }}
        >
            {children}
        </CurrentConfigContext.Provider>
    );
};

export default CurrentConfigContext;
