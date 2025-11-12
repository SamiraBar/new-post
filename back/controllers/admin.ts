import Admin from "../models/Admin";
import {NextFunction, Request, Response} from "express";
import {AdminDef} from "../types";
import mongoose from "mongoose";

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

export const adminCreate = async (req: Request, res: Response, next: NextFunction) => {
  const adminData: Omit<AdminDef, "token" | "role"> = {
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const admin = new Admin(adminData);
    admin.generateToken();

    await admin.save();
    res.send(admin);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({error});
    }
    next(error);
  }
}

export const adminDelete = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const removeUser = await Admin.findById(req.params.id);

    if (!removeUser) return res.status(404).send({error: "Пользователя не существует"});

    if (removeUser.role === "superAdmin") return res.status(400).send({error: "Нельзя удалить супер Админа"});

    await Admin.findByIdAndDelete(req.params.id)
    res.send({message: "Пользователь удалён из базы:"});
  } catch (error) {
    next(error)
  }
}

export const allAdmins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admins = await Admin.find();
    res.send(admins);
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