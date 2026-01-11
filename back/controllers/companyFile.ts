import { Request, Response, NextFunction } from "express";
import CompanyFile from "../models/CompanyFile";
import path from "path";
import fs from "fs";

export const getFiles = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const files = await CompanyFile.find();
        res.json(files);
    } catch (e) {
        next(e);
    }
};

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const type = req.body.type;
        if (!type) return res.status(400).json({ error: "File type is required" });
        if (!req.file) return res.status(400).json({ error: "File is required" });

        const newFile = await CompanyFile.create({
            type,
            fileName: req.file.originalname,
            fileUrl: `/uploads/company-files/${req.file.filename}`,
            uploadedAt: new Date(),
        });

        res.json(newFile);
    } catch (e) {
        next(e);
    }
};

export const replaceFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = await CompanyFile.findById(req.params.id);
        if (!file) return res.status(404).json({ error: "File not found" });

        if (req.file) {
            const oldPath = path.join(process.cwd(), "public", "company-files", path.basename(file.fileUrl));
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

            file.fileName = req.file.originalname;
            file.fileUrl = `/uploads/company-files/${req.file.filename}`;
            file.uploadedAt = new Date();
        }

        await file.save();
        res.json(file);
    } catch (e) {
        next(e);
    }
};

export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = await CompanyFile.findById(req.params.id);
        if (!file) return res.status(404).json({ error: "File not found" });

        const filePath = path.join(process.cwd(), "public", "company-files", path.basename(file.fileUrl));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        await file.deleteOne();
        res.json({ ok: true });
    } catch (e) {
        next(e);
    }
};

export const downloadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = await CompanyFile.findById(req.params.id);
        if (!file) return res.status(404).json({ error: "Файл не найден" });

        const filePath = path.join(process.cwd(), "public", "company-files", path.basename(file.fileUrl));
        if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Файл не найден на сервере" });

        res.setHeader(
            "Content-Disposition",
            `attachment; filename*=UTF-8''${encodeURIComponent(file.fileName)}`
        );

        res.sendFile(filePath);
    } catch (e) {
        next(e);
    }
};

export const getAgreementFile = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const file = await CompanyFile.findOne({ type: "agreement" }).sort({ uploadedAt: -1 });
        if (!file) return res.status(404).json({ error: "Файл соглашения не найден" });

        res.json({
            fileUrl: file.fileUrl,
            fileName: file.fileName,
        });
    } catch (e) {
        next(e);
    }
};