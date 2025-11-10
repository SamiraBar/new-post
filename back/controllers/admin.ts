import Admin from "../models/Admin";
import {NextFunction, Request, Response} from "express";

export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const admin = await Admin.findOne({email: req.body.email});

        if (!admin) return res.status(400).send({error: "Неверный логин."});

        const isMatch = await admin.checkPassword(req.body.password)

        if (!isMatch) return res.status(400).send({error: "Неверный пароль."});

        admin.generateToken();
        await admin.save();

        res.send(admin);
    } catch (error) {
        next(error)
    }
}

export const adminLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.get('Authorization');

        if (!token) return res.status(204).send();

        const admin = await Admin.findOne({token});

        if (!admin) return res.status(204).send();

        admin.generateToken();
        admin.save();

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}