export type Order = {
    orderdate: string;
    ordernum: string;
    slmn: string;
    slmuser: string;
    status: string; // "Will Ship From Italy and ETA approx. 6-8" |
    submitted: string;
    subtotal: number | string;
    total: number | string;
    totcredit: number | string;
};

// this is just exclusive for formatting the data that will be pass to inertia route or link.
export type OrderRecord = Record<keyof Order, string | number>;
