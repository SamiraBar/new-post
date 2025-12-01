import express from "express";
import { adminCreate, adminDelete, adminEdit, adminLogin, adminLogout, allAdmins } from '../controllers/admin';
import auth from "../middleware/auth";
import permit from "../middleware/permit";

const adminsRouter = express.Router();

adminsRouter.get("/", auth, permit("superAdmin"), allAdmins);
adminsRouter.post("/", adminLogin);
adminsRouter.post("/create", auth, permit("superAdmin"), adminCreate);
adminsRouter.delete("/:id", auth, permit("superAdmin"), adminDelete);
adminsRouter.patch("/:id", auth, permit("superAdmin"), adminEdit);
adminsRouter.delete('/', adminLogout);

export default adminsRouter;