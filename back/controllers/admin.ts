import Admin from "../models/Admin";
import {NextFunction, Request, Response} from "express";
import {AdminDef} from "../types";
import mongoose from "mongoose";
import {getActiveAdminsCount} from "../utils/adminSessions";

export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const admin = await Admin.findOne({ email: req.body.email });
        if (!admin) return res.status(400).send({ error: "Invalid login" });

        const isMatch = await admin.checkPassword(req.body.password);
        if (!isMatch) return res.status(400).send({ error: "Wrong password" });

        if (admin.role !== "superAdmin") {
            const activeAdminsCount = await getActiveAdminsCount();

            if (activeAdminsCount >= 4) {
                return res.status(403).send({
                    error: "Maximum number of admin sessions reached",
                });
            }
        }
        admin.generateToken();
        admin.isActive = true;
        await admin.save();

        res.send(admin);
    } catch (error) {
        next(error);
    }
};

export const adminCreate = async (req: Request, res: Response, next: NextFunction) => {
    const adminData: Omit<AdminDef, "token" | "role"> = {
        email: req.body.email,
        password: req.body.password,
        displayName: req.body.displayName,
        isActive: false,
    };

    try {
        const admin = new Admin(adminData);
        admin.generateToken();

        await admin.save();
        res.send(admin);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const errors = Object.values(error.errors).map(err => err.message);

            return res.status(400).send({
                error: {
                    message: errors.join(', ')
                }
            });
        }

    next(error);
  }
}

export const adminDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const removeUser = await Admin.findById(req.params.id);

        if (!removeUser) return res.status(404).send({error: "User is not found"});

        if (removeUser.role === "superAdmin") return res.status(400).send({error: "Cannot delete super admin"});

        await Admin.findByIdAndDelete(req.params.id)
        res.send({message: "User is deleted"});
    } catch (error) {
        next(error)
    }
}

export const allAdmins = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const admins = await Admin.find().sort({role: -1});
        res.send(admins);
    } catch (error) {
        next(error)
    }
}

export const adminLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.get('Authorization');
        if (!token) return res.status(204).send();

        const admin = await Admin.findOne({ token });
        if (!admin) return res.status(204).send();

        admin.isActive = false;
        await admin.save();

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const adminEdit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const {
      displayName,
      email,
      password
    } = req.body;
    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).send({error: 'User is not found'});
    if (displayName) admin.displayName = displayName;
    if (email) admin.email = email;
    if (password) admin.password = password;
    await admin.save();
    res.status(200).send(admin);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map(err => err.message);

      return res.status(400).send({
        error: {
          message: errors.join(', ')
        }
      });
    }
    next(error);
  }
};