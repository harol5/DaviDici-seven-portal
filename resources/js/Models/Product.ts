export type Product = {
    color: string;
    item: string;
    linenum: number;
    size: string;
    model: string;
    notes: string;
    uscode: string;
    price: number;
    qty: number;
    total: number;
    status: string;
    stock: string;
};

// this is just exclusive for formatting the data that will be pass to inertia route or link.
export type ProductRecord = Record<keyof Product, string | number>;
