// back/controllers/socialMedia.ts
import { Request, Response } from "express";
import SocialMedia from "../models/SocialMedia";
import fs from "fs";
import path from "path";

// GET /api/social-networks - Получить все
export const getAllSocialNetworks = async (req: Request, res: Response) => {
  try {
    const socials = await SocialMedia.find().sort({ order: 1 });
    res.json({ socialNetworks: socials });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// POST /api/social-networks - Создать
export const createSocialNetwork = async (req: Request, res: Response) => {
  try {
    const { name, url, order } = req.body;

    // Проверка лимита (максимум 6)
    const count = await SocialMedia.countDocuments();
    if (count >= 6) {
      return res.status(400).json({ error: "Максимум 6 социальных сетей" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Иконка обязательна" });
    }

    const icon = `uploads/social/${req.file.filename}`;

    const social = await SocialMedia.create({
      name,
      url,
      icon,
      order: order !== undefined ? order : count,
    });

    res.status(201).json(social);
  } catch (error) {
    // Удаляем загруженный файл если ошибка
    if (req.file) {
      const filePath = path.join(
        __dirname,
        "../../public/uploads/social",
        req.file.filename,
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    if (error instanceof Error && "code" in error && error.code === 11000) {
      return res
        .status(400)
        .json({ error: "Социальная сеть с таким именем уже существует" });
    }

    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// PATCH /api/social-networks/:id - Обновить
export const updateSocialNetwork = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, url, order } = req.body;

    const social = await SocialMedia.findById(id);
    if (!social) {
      return res.status(404).json({ error: "Социальная сеть не найдена" });
    }

    // Если загружена новая иконка
    if (req.file) {
      // Удаляем старую иконку
      const oldIconPath = path.join(__dirname, "../../public", social.icon);
      if (fs.existsSync(oldIconPath)) {
        fs.unlinkSync(oldIconPath);
      }
      social.icon = `uploads/social/${req.file.filename}`;
    }

    if (name !== undefined) social.name = name;
    if (url !== undefined) social.url = url;
    if (order !== undefined) social.order = order;

    await social.save();
    res.json(social);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === 11000) {
      return res
        .status(400)
        .json({ error: "Социальная сеть с таким именем уже существует" });
    }
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// DELETE /api/social-networks/:id - Удалить
export const deleteSocialNetwork = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const social = await SocialMedia.findById(id);
    if (!social) {
      return res.status(404).json({ error: "Социальная сеть не найдена" });
    }

    // Удаляем файл иконки
    const iconPath = path.join(__dirname, "../../public", social.icon);
    if (fs.existsSync(iconPath)) {
      fs.unlinkSync(iconPath);
    }

    await social.deleteOne();
    res.json({ message: "Социальная сеть удалена успешно" });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// PATCH /api/social-networks/reorder - Изменить порядок
export const reorderSocialNetworks = async (req: Request, res: Response) => {
  try {
    const { items } = req.body; // [{ id: "...", order: 0 }, ...]

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "Items должны быть массивом" });
    }

    // Обновляем order для каждого элемента
    const updates = items.map((item) =>
      SocialMedia.findByIdAndUpdate(item.id, { order: item.order }),
    );

    await Promise.all(updates);

    const socials = await SocialMedia.find().sort({ order: 1 });
    res.json({ socialNetworks: socials });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
