import { Request, Response, NextFunction } from "express";
import SiteContent from "../models/SiteContent";

export const getSiteContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lang = String(req.query.lang || "ru");
        const docs = await SiteContent.find({ lang }).sort({ key: 1 });
        res.send(docs);
    } catch (e) {
        next(e);
    }
};

export const getSiteContentByKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { key } = req.params;
        const lang = String(req.query.lang || "ru");
        const doc = await SiteContent.findOne({ key, lang });
        if (!doc) return res.status(404).send({ error: "Not found" });
        res.send(doc);
    } catch (e) {
        next(e);
    }
};

export const upsertSiteContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { key } = req.params;
        const { lang, value } = req.body;

        if (!lang) return res.status(400).send({ error: "lang is required" });

        const doc = await SiteContent.findOneAndUpdate(
            { key, lang },
            { $set: { value } },
            { upsert: true, new: true }
        );

        res.send(doc);
    } catch (e) {
        next(e);
    }
};
