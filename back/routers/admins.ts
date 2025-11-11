import express from "express";
import {adminLogin, adminLogout} from "../controllers/admin";

const adminsRouter = express.Router();

adminsRouter.post("/", adminLogin);
adminsRouter.delete('/', adminLogout);

export default adminsRouter;