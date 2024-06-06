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

/**
 * admin = 3478
 * operations = 3480
 * owner = 1919
 * salesperson = 1950
 */

export type role = "admin" | "salesperson" | "owner" | "operations";
