import express from "express";
import auth from "../middleware/auth";
import {createContact, getContactById, getContacts} from "../controllers/contacts";

const contactsRouter = express.Router();

contactsRouter.post("/", auth, createContact);

contactsRouter.get("/", auth, getContacts);

contactsRouter.get("/:id", auth, getContactById);

export default contactsRouter;