import express from "express";
import { printSticker } from "../controllers/printer";

const printerRouter = express.Router();

printerRouter.post("/print", printSticker);

export default printerRouter;
