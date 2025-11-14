import mongoose from "mongoose";
import config from "./config";
import Admin from "./models/Admin";
import {randomUUID} from "node:crypto";
import Parcel from "./models/Parcel";
import Contact from "./models/Contact";

const run = async () => {
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection("admins");
    await db.dropCollection("parcels");
    await db.dropCollection("contacts");
  } catch (e) {
    console.log("No collection, skipping", e);
  }

  await Admin.create({
    email: 'AdminNum1@gmail.com',
    password: 'Qwerty123',
    token: randomUUID(),
    role: 'superAdmin',
    displayName: 'Main Admin',
  }, {
    email: "AdminNum2@gmail.com",
    password: 'Qwerty123',
    token: randomUUID(),
    role: 'admin',
    displayName: 'Some Admin',
  }, {
    email: "AdminNum3@gmail.com",
    password: 'Qwerty123',
    token: randomUUID(),
    role: 'admin',
    displayName: 'Post Admin',
  });

  const [senderOne, recipientOne, senderTwo, recipientTwo] =
      await Contact.create(
          {
            fullName: "Иванов Петр Сергеевич",
            phoneNumber: "+996 732 274 412",
            email: "sender1@gmail.com",
            address: "г. Бишкек, ул. Чуй 123",
            description: "Одежда и обувь",
            type: "sender",
          },
          {
            fullName: "Сидоров Женя Александрович",
            phoneNumber: "+996 500 274 458",
            email: "recipient1@gmail.com",
            address: "г. Москва, ул. Ленина 45",
            description: "Одежда и обувь",
            type: "recipient",
          },
          {
            fullName: "Калиев Арсен Нурланович",
            phoneNumber: "+996 500 987 454",
            email: "sender2@gmail.com",
            address: "г. Ош, ул. Московская 67",
            description: "Электроника",
            type: "sender",
          },
          {
            fullName: "Петрова Алина Дмитриевна",
            phoneNumber: "+996 557 890 223",
            email: "recipient2@gmail.com",
            address: "г. Санкт-Петербург, Невский пр. 89",
            description: "Электроника",
            type: "recipient",
          }
      );

  await Parcel.create([
    {
      trackingNumber: "KGZ-312-SLFKDJEWSL",
      partnerTrackingNumber: "LSDFKJEWXOXS",
      sender: senderOne._id,
      recipient: recipientOne._id,
      originCity: "Бишкек",
      destinationCity: "Москва",
      status: "created",
      isPaid: false,
      partnerStickerReceived: false,
      weight: 0.6,
    },
    {
      trackingNumber: "KGZ-478-QWERTYUIOP",
      partnerTrackingNumber: "PLKJHGFDSA",
      sender: senderTwo._id,
      recipient: recipientTwo._id,
      originCity: "Ош",
      destinationCity: "Санкт-Петербург",
      status: "accepted",
      isPaid: true,
      partnerStickerReceived: true,
      weight: 1.25,
    },
    {
      trackingNumber: "KGZ-999-TESTTRACK",
      partnerTrackingNumber: "TEST123456",
      sender: senderOne._id,
      recipient: recipientTwo._id,
      originCity: "Бишкек",
      destinationCity: "Ош",
      status: "draft",
      isPaid: false,
      partnerStickerReceived: false,
      weight: 2.1,
    }
  ]);

  await db.close();
};

run().catch(console.error);