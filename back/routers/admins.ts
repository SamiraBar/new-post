import express from "express";
import Admin from "../models/Admin";

const adminsRouter = express.Router();

adminsRouter.post("/", async (req, res, next) => {
    try {
        const admin = await Admin.findOne({email: req.body.email});

        if (!admin) {
            return res.status(400).send({error: "Wrong credentials."});
        }

        const isMatch = await admin.checkPassword(req.body.password)

        if (!isMatch) {
            return res.status(400).send({error: "Wrong credentials."});
        }

        admin.generateToken();
        await admin.save();

        res.send(admin);
    } catch (error) {
        next(error)
    }
});

adminsRouter.delete('/', async (req, res, next) => {
    try {
        const token = req.get('Authorization');

        if (!token) {
            return res.status(204).send();
        }

        const admin = await Admin.findOne({token});

        if (!admin) {
            return res.status(204).send();
        }

        admin.generateToken();
        admin.save();

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default adminsRouter;