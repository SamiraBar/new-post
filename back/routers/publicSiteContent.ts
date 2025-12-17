import express from "express";
import SiteContent from "../models/SiteContent";

const publicSiteContentRouter = express.Router();

// GET /public/site-content?lang=ru&keys=important.info,about.company,footer.address
publicSiteContentRouter.get("/", async (req, res, next) => {
    try {
        const lang = String(req.query.lang || "ru");
        const keysParam = String(req.query.keys || "");
        const keys = keysParam
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean);

        if (!keys.length) return res.send({});

        const docs = await SiteContent.find({ lang, key: { $in: keys } });

        const result: Record<string, string> = {};
        for (const d of docs) result[d.key] = String(d.value ?? "");

        res.send(result);
    } catch (e) {
        next(e);
    }
});

export default publicSiteContentRouter;
