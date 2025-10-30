import {Request} from "express";
import {HydratedDocument, Types} from "mongoose";

export interface UserFields {
    username: string;
    password: string;
    token: string;
    role: 'user' | 'admin';
}

export interface RequestWithUser extends Request {
    user: HydratedDocument<UserFields>
}