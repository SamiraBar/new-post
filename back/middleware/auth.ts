import {Request, Response, NextFunction} from "express";
import {HydratedDocument} from "mongoose";
import {AdminDef, JwtAdminPayload} from "../types";
import Admin from "../models/Admin";
import jwt from "jsonwebtoken";
import {secret} from "../config";

export interface RequestWithAdmin extends Request {
    admin: HydratedDocument<AdminDef>
}

const auth = async (expressReq: Request, res: Response, next: NextFunction) => {
    const req = expressReq as RequestWithAdmin;
    let payload: JwtAdminPayload;

    const token = req.get('Authorization');
    if (!token) {
        return res.status(401).send({error: 'Токен отсутствует!'});
    }

    try {
        payload = jwt.verify(token, secret) as JwtAdminPayload;
    } catch (err) {
        return res.status(401).send({error: 'Токен недействителен или истёк!'});
    }

    const admin = await Admin.findOne({_id: payload.id, token});
    if (!admin) {
        return res.status(401).send({error: 'Токен устарел!'});
    }

    req.admin = admin;
    next();
};

export default auth;