import mongoose from "mongoose";
import config from "./config";
import Admin from "./models/Admin";
import { randomUUID } from "node:crypto";
import Parcel from "./models/Parcel";
import Contact from "./models/Contact";

const run = async () => {
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection("admins");
    await db.dropCollection("parcels");
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

  const [senderOne, recipientOne, senderTwo, recipientTwo] =
    await Contact.create(
      {
        fullName: "Иванов Петр Сергеевич",
        phoneNumber: "+996 732 274 412",
        email: "sender1@gmail.com",
        address: "daslfw",
        description: "alfwi",
        type: "sender",
        createdAt: "2025-08-11T10:16:31.775Z",
      },
      {
        fullName: "Сидоров Женя Александрович",
        phoneNumber: "+996 500 274 458",
        email: "recipient1@gmail.com",
        address: "daslfw123",
        description: "alfwiasdawf",
        type: "recipient",
        createdAt: "2025-02-11T10:21:31.775Z",
      },

      {
        fullName: "Калиев Арсен Нурланович",
        phoneNumber: "+996 500 987 454",
        email: "sender2@gmail.com",
        address: "daslfw12323",
        description: "alfwiasdawf",
        type: "sender",
        createdAt: "2025-05-11T10:20:31.775Z",
      },
      {
        fullName: "Петрова Алина Дмитриевна",
        phoneNumber: "+996 557 890 223",
        email: "recipient1@gmail.com",
        address: "daslfw123451",
        description: "alfwiasdfgwf",
        type: "recipient",
        createdAt: "2024-02-11T10:17:11.775Z",
      }
    );

  await Parcel.create([
    {
      trackingNumber: "KGZ-312-SLFKDJEWSL",
      partnerTrackingNumber: "№LSDFKJEWXOXS",
      sender: senderOne._id,
      recipient: recipientOne._id,
      originCity: "Бишкек",
      destinationCity: "Москва",
      status: "created",
      isPaid: false,
      partnerStickerReceived: false,
      weight: 0.6,
      createdAt: "2025-09-11T10:16:37.775Z",
    },
    {
      trackingNumber: "KGZ-478-QWERTYUIOP",
      partnerTrackingNumber: "№PLKJHGFDSA",
      sender: senderTwo._id,
      recipient: recipientTwo._id,
      originCity: "Ош",
      destinationCity: "Санкт-Петербург",
      status: "in_transit",
      createdAt: "2025-09-13T14:22:10.123Z",
      isPaid: true,
      partnerStickerReceived: true,
      weight: 1.25,
    },
  ]);

  await db.close();
};

run().catch(console.error);
