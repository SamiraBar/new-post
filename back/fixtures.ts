import mongoose from "mongoose";
import config from "./config"
import User from "./models/User";
import {randomUUID} from "node:crypto";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('users');
    } catch (e) {
        console.log("No collection, skipping", e);
    }

    await User.create({
        email: 'AdminNum1',
        password: 'Qwerty123',
        token: randomUUID(),
    });

    await db.close()

}

run().catch(console.error);