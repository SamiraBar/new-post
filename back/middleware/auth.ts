import {Request, Response, NextFunction} from "express";
import {HydratedDocument} from "mongoose";
import {AdminDef} from "../types";
import Admin from "../models/Admin";

export interface RequestWithAdmin extends Request {
    admin: HydratedDocument<AdminDef>
}

const auth = async (expressReq: Request, res: Response, next: NextFunction) => {
    const req = expressReq as RequestWithAdmin;

    const token = req.get('Authorization');
    if (!token) {
        return res.status(401).send({error: 'No token present'});
    }

    const admin = await Admin.findOne({token});
    if (!admin) {
        return res.status(401).send({error: 'Wrong token!'});
    }

    req.admin = admin;
    next();
};

export default auth;