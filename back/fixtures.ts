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
        role: 'superAdmin',
    },{
        email: "AdminNum2@gmail.com",
        password: 'Qwerty123',
        token: randomUUID(),
        role: 'admin',
    },{
        email: "AdminNum3@gmail.com",
        password: 'Qwerty123',
        token: randomUUID(),
        role: 'admin',
    });

    await db.close()

}

run().catch(console.error);