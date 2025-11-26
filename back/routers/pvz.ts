import express from "express";
import { getPvzList } from "../controllers/pvz";

const pvzRouter = express.Router();

pvzRouter.get("/", getPvzList);

export default pvzRouter;
