export interface Admin {
    _id: string;
    email: string;
    token: string;
}

export interface GlobalError {
    error: string;
}

export interface LoginMutation {
    email: string;
    password: string;
}