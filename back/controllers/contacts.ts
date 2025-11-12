import {NextFunction, Request, Response} from "express";
import Contact from "../models/Contact";
import mongoose from "mongoose";

export const createContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fullName, phoneNumber, email, address, description, type } = req.body;
        if (!fullName || !phoneNumber || !email || !address || !type) {
            return res.status(400).json({
                error: "Not all required fields are filled",
                required: ["fullName", "phoneNumber", "email", "address", "type"]
            });
        }

        if (!['sender', 'recipient'].includes(type)) {
            return res.status(400).json({
                error: "Invalid contact type",
                allowedTypes: ["sender", "recipient"]
            });
        }
        if (type === 'sender' && !description) {
            return res.status(400).json({
                error: "Description is required for sender type"
            });
        }

        const newContact = new Contact({
            fullName,
            phoneNumber,
            email,
            address,
            description: type === 'sender' ? description : undefined,
            type
        });

        await newContact.save();
        res.status(201).json({
            message: "Contact successfully created",
            contact: newContact
        });
    } catch (e) {
        next(e);
    }
}

export const getContacts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.query;

        let filter = {};
        if (type && ['sender', 'recipient'].includes(type as string)) {
            filter = { type };
        }

        const contacts = await Contact.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            count: contacts.length,
            contacts
        });

    } catch (e) {
        next(e);
    }
}

export const getContactById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid contact ID" });
        }

        const contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }

        res.status(200).json({ contact });

    } catch (e) {
        next(e);
    }
}