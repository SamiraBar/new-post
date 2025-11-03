import express from "express";
import User from "../models/User";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if (!user) {
            return res.status(400).send({error: "User not found"});
        }

        const isMatch = await user.checkPassword(req.body.password)

        if (!isMatch) {
            return res.status(400).send({error: "Invalid password"});
        }

        user.generateToken();
        await user.save();

        res.send(user);
    } catch (error) {
        next(error)
    }
});

usersRouter.delete('/', async (req, res, next) => {
    try {
        const token = req.get('Authorization');

        if (!token) {
            return res.status(204).send();
        }

        const user = await User.findOne({token});

        if (!user) {
            return res.status(204).send();
        }

        user.generateToken();
        user.save();

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default usersRouter;