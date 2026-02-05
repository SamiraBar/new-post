import {Request, Response, NextFunction} from "express";
import CompanyFile from "../models/CompanyFile";
import path from "path";
import {promises as fs} from "fs";
import config from "../config";

const UPLOAD_DIR = path.resolve(config.publicPath, "uploads/company-files");

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
    if (!type) return res.status(400).json({error: "File type is required"});
    if (!req.file) return res.status(400).json({error: "File is required"});

    const correctName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');

    const newFile = await CompanyFile.create({
      type,
      fileName: correctName,
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
    if (!file) {
      if (req.file) await fs.unlink(req.file.path).catch(() => {});
      return res.status(404).json({error: "File not found"});
    }

    if (req.file) {
      const oldFileName = path.basename(file.fileUrl);
      const oldPath = path.join(UPLOAD_DIR, oldFileName);

      const correctName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');

      file.fileName = correctName;
      file.fileUrl = `/uploads/company-files/${req.file.filename}`;
      file.uploadedAt = new Date();
      await file.save();

      try {
        await fs.unlink(oldPath);
      } catch (err) {
        console.error("Старый файл не найден или уже удален:", err);
      }
    } else {
      await file.save();
    }

    res.json(file);
  } catch (e) {
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    next(e);
  }
};


export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = await CompanyFile.findById(req.params.id);
    if (!file) return res.status(404).json({error: "File not found"});

    const fileName = path.basename(file.fileUrl);
    const filePath = path.join(UPLOAD_DIR, fileName);

    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error("Ошибка при удалении физического файла:", err);
    }

    await file.deleteOne();
    res.json({ok: true});
  } catch (e) {
    next(e);
  }
};
export const downloadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = await CompanyFile.findById(req.params.id);
    if (!file) return res.status(404).json({ error: "Файл не найден" });

    const filePath = path.join(UPLOAD_DIR, path.basename(file.fileUrl));
    await fs.access(filePath);

    const encodedName = encodeURIComponent(file.fileName);
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="file.pdf"; filename*=UTF-8''${encodedName}`
    );

    res.sendFile(filePath);
  } catch (e) {
    next(e);
  }
};

export const getAgreementFile = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const file = await CompanyFile.findOne({type: "agreement"}).sort({uploadedAt: -1});
    if (!file) return res.status(404).json({error: "Файл соглашения не найден"});

    res.json({
      _id: file._id,
      fileUrl: file.fileUrl,
      fileName: file.fileName,
    });
  } catch (e) {
    next(e);
  }
};

export const getPublicFiles = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const files = await CompanyFile.find({ type: { $ne: "agreement" } })
        .sort({ uploadedAt: -1 });

    res.json(
        files.map(file => ({
          _id: file._id,
          type: file.type,
          fileName: file.fileName,
        }))
    );
  } catch (e) {
    next(e);
  }
};
