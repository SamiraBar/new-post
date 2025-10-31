export interface User {
    role: 'user' | 'admin';
    token: string;
}