import express from 'express';
import cors from 'cors';
import mongoose from "mongoose";
import config from "./config";
import adminsRouter from "./routers/admins";
import pricesRouter from "./routers/prices";
import parcelsRouter from "./routers/parcels";
import sendersRouter from "./routers/senders";
import recipientsRouter from "./routers/recipients";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.use("/admins", adminsRouter);
app.use("/prices", pricesRouter);
app.use("/parcels", parcelsRouter);
app.use("/recipients", recipientsRouter);
app.use("/senders", sendersRouter);

const run = async () => {
    await mongoose.connect(config.db);
    app.listen(port, () => {
        console.log(`Server on port ${port}`);
    });
};

run().catch(console.error);