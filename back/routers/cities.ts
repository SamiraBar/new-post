import { Router } from "express";
import CourierCity from "../models/CourierCity";
import PickupCity from "../models/PickupCity";

const citiesRouter = Router();

citiesRouter.get("/courier-cities", async (req, res) => {
    try {
        const cities = await CourierCity.find().sort({ nameCity: 1 });
        res.json(cities);
    } catch (error) {
        console.error("Error receiving city couriers:", error);
        res.status(500).json({ message: "Error receiving courier cities" });
    }
});

citiesRouter.get("/pickup-cities", async (req, res) => {
    try {
        const cities = await PickupCity.find().sort({ name: 1 });
        res.json(cities);
    } catch (error) {
        console.error("Error while getting pickup point cities:", error);
        res.status(500).json({ message: "Error while getting pickup point cities" });
    }
});

export default citiesRouter;
