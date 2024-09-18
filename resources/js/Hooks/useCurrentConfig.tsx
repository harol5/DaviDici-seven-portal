import { useContext } from "react";
import CurrentConfigContext from "../Context/CurrentConfigurationProvider";

const useCurrentConfig = () => {
    return useContext(CurrentConfigContext);
};

export default useCurrentConfig;
