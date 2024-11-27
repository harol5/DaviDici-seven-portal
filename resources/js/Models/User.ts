export default interface User {
    user: {
        created_at: string | null;
        email: string;
        email_verified_at: string | null;
        is: number;
        first_name: string;
        role: number;
        updated_at: string | null;
        username: string;
    };
}

export type SalesRep = {
    add: string;
    beeper: string;
    cell: string;
    city: string
    fax: string;
    level1: number;
    level2: number;
    lname: string;
    name: string;
    percent: number;
    royal1: number;
    royal2: number;
    royal3: number;
    slmn: string;
    ssnum: string;
    st: string;
    tel: string;
    terr: string;
    username: string;
    wcode: string;
    zip:string;
}

/**
 * admin = 3478
 * operations = 3480
 * owner = 1919
 * salesperson = 1950
 */

export type role = "admin" | "salesperson" | "owner" | "operations";
