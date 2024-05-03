export type Delivery = {
    address: string[];
    cellphoneNumber: string[];
    city: string[];
    contactName: string[];
    customerEmail: string[];
    customerName: string[];
    deliveryType: string[];
    state: string[];
    telephoneNumber: string[];
    wholesalerEmail: string[];
    zipCode: string[];
    ln: number;
    qty: number;
};

export type DeliveryFoxpro = {
    contact: string;
    deldate: string;
    dtype: string;
    ln: number;
    qty: number;
    sadd: string;
    scell: string;
    scity: string;
    semail: string;
    shipper: string;
    sname: string;
    spinst: string;
    sst: string;
    stel: string;
    swmail: string;
    szip: string;
    uscode: string;
    waddress: string;
};
