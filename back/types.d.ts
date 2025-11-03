import {Request} from "express";
import {HydratedDocument} from "mongoose";

export interface UserDef {
    email: string;
    password: string;
    token: string;
}

export interface RequestWithUser extends Request {
    user: HydratedDocument<UserFields>
}