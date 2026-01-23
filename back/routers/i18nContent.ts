import express from "express";
import path from "path";
import fs from "fs/promises";
import auth from "../middleware/auth";
import permit from "../middleware/permit";

const router = express.Router();
type Lang = "ru" | "kg";

const LOCALES_DIR = process.env.LOCALES_DIR
  ? path.resolve(process.env.LOCALES_DIR)
  : process.env.NODE_ENV === "production"
    ? path.resolve(process.cwd(), "dist/i18n/locales")
    : path.resolve(process.cwd(), "i18n/locales");


const allowedKeys = new Set([
    "aboutCompany.textInfo",
    "importantInfo.textInfo",
    "footer.address",
    "contacts.phone",
    "contacts.email",
]);

const localePath = (lang: Lang) => path.join(LOCALES_DIR, `${lang}.json`);

const readJson = async (lang: Lang) => JSON.parse(await fs.readFile(localePath(lang), "utf-8"));

const writeJson = async (lang: Lang, data: any) =>
    fs.writeFile(localePath(lang), JSON.stringify(data, null, 2) + "\n", "utf-8");

const setDeep = (obj: any, dotted: string, value: any) => {
    const parts = dotted.split(".");
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        cur[parts[i]] ??= {};
        cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
};

router.get("/:lang", async (req, res, next) => {
    try {
        const lang = req.params.lang as Lang;
        if (!["ru", "kg"].includes(lang)) return res.status(400).send({ error: "Bad lang" });

        res.send(await readJson(lang));
    } catch (e: any) {
        console.error("i18n-content read error:", e?.message);
        next(e);
    }
});


router.patch("/:lang", auth, permit("superAdmin"), async (req, res, next) => {
    try {
        const lang = req.params.lang as Lang;
        if (!["ru", "kg"].includes(lang)) return res.status(400).send({ error: "Bad lang" });

        const updates: Record<string, string> = req.body?.updates || {};
        for (const k of Object.keys(updates)) {
            if (!allowedKeys.has(k)) return res.status(400).send({ error: `Key not allowed: ${k}` });
        }

        const json = await readJson(lang);
        for (const [k, v] of Object.entries(updates)) setDeep(json, k, String(v ?? ""));
        await writeJson(lang, json);

        res.send({ ok: true });
    } catch (e) {
        next(e);
    }
});

export default router;
