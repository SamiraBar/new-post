import { Router } from "express";
import CourierCity from "../models/CourierCity";
import PickupCity from "../models/PickupCity";

const router = Router();

router.get("/courier-cities", async (req, res) => {
    try {
        const cities = await CourierCity.find().sort({ nameCity: 1 });
        res.json(cities);
    } catch (error) {
        console.error("Ошибка при получении городов курьеров:", error);
        res.status(500).json({ message: "Ошибка при получении городов курьеров" });
    }
});

router.get("/pickup-cities", async (req, res) => {
    try {
        const cities = await PickupCity.find().sort({ name: 1 });
        res.json(cities);
    } catch (error) {
        console.error("Ошибка при получении городов ПВЗ:", error);
        res.status(500).json({ message: "Ошибка при получении городов ПВЗ" });
    }
});

export default router;
