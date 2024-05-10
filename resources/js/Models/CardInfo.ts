export type CardInfo = {
    number: string;
    expMonth: string;
    expYear: string;
    cvc: string;
    name: string;
    address: {
        streetAddress: string;
        postalCode: string;
        city: string;
        region: string;
    };
};
