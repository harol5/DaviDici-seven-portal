export const intuitMaskTokenUrl =
    import.meta.env.MODE === "development"
        ? "https://sandbox.api.intuit.com"
        : "https://api.intuit.com";

type ErrorIntuit = {
    code: string;
    detail: string;
    infoLink: string;
    message: string;
    moreInfo: string;
    type: string;
};

type ErrorIntuitFinal = {
    code: "PMT-4000" | "PMT-6000";
    detail:
        | "card.cvc"
        | "card.expyear"
        | "card.expmonth"
        | "card.number"
        | "card.ExpirationMonth/ExpirationYear";
    infoLink: string;
    message: string;
    moreInfo: string;
    type: "invalid_request";
};

export type { ErrorIntuit };
