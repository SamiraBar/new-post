export interface AdminDef {
    email: string;
    password: string;
    token: string;
}

export interface MongooseError extends Error {
    name: string;
    errors?: { [key: string]: { message: string } };
    code?: number;
    keyValue?: { [key: string]: any };
    status?: number;
}