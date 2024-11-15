import classes from "../../css/loading-spinner.module.css";

function LoadingSpinner({ message = "" }: { message?: string }) {
    return (
        <p className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-7 text-center">
            <img
                className={classes.logoLoadSpinner}
                src={`https://${location.hostname}/images/davidici-logo-no-letters.svg`}
                alt="home icon"
            />
            {message}
        </p>
    );
}

export default LoadingSpinner;
