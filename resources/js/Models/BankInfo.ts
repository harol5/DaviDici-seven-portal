export type BankInfo = {
    bankAccount: {
        name: string;
        accountNumber: string;
        accountType: string;
        routingNumber: string;
        phone: string;
    };
    paymentMode: "WEB";
    amount: number;
};
