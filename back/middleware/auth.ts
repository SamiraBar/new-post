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

    const token = req.get('Authorization');
    if (!token) return res.status(401).send({ error: 'Token missing!' });

    let payload: JwtAdminPayload;

    try {
        payload = jwt.verify(token, secret) as JwtAdminPayload;
    } catch {
        return res.status(401).send({ error: 'The token is invalid or has expired!' });
    }

    const admin = await Admin.findOne({ _id: payload.id, token, isActive: true }); // ✅ add isActive

    if (!admin) {
        return res.status(401).send({ error: 'Token is out of date!' });
    }

    req.admin = admin;
    next();
};

export default auth;