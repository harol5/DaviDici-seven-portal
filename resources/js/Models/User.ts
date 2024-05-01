export default interface User {
    user: {
        created_at: string | null;
        email: string;
        email_verified_at: string | null;
        is: number;
        name: string;
        role: number;
        updated_at: string | null;
        username: string;
    };
}
