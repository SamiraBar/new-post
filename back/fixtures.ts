import mongoose from "mongoose";
import config from "./config"
import Admin from "./models/Admin";
import {randomUUID} from "node:crypto";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('admins');
    } catch (e) {
        console.log("No collection, skipping", e);
    }

    await Admin.create({
        email: 'AdminNum1@gmail.com',
        password: 'Qwerty123',
        token: randomUUID(),
    });

    await db.close()

}

run().catch(console.error);