import express from 'express';
import cors from 'cors';
import mongoose from "mongoose";
import config from "./config";
import adminsRouter from "./routers/admins";
import pricesRouter from "./routers/prices";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.use("/admins", adminsRouter);
app.use("/prices", pricesRouter);

const run = async () => {
    await mongoose.connect(config.db);
    app.listen(port, () => {
        console.log(`Server on port ${port}`);
    });
};

run().catch(console.error);