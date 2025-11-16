import mongoose from "mongoose";
import config from "./config";
import Admin from "./models/Admin";
import { randomUUID } from "node:crypto";
import Parcel from "./models/Parcel";
import Contact from "./models/Contact";
import XLSX from "xlsx";
import CourierCity from "./models/CourierCity";
import PickupCity from "./models/PickupCity";
import { CourierCityRow, PickupCityRow } from "./types";
import path from "path";

const importCities = async (filePath: string, type: "courier" | "pickup") => {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  if (type === "courier") {
    const data = XLSX.utils.sheet_to_json<CourierCityRow>(sheet);

    for (const row of data) {
      await CourierCity.create({
        nameCity: row["Название города"],
        country: row["Страна"] || "",
      });
    }
  } else if (type === "pickup") {
    const data = XLSX.utils.sheet_to_json<PickupCityRow>(sheet);

    for (const row of data) {
      await PickupCity.create({
        name: row["Название города"],
        region: row["Регион"] || "",
      });
    }
  }
};
const run = async () => {
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection("admins");
    await db.dropCollection("parcels");
    await db.dropCollection("couriercities");
    await db.dropCollection("pickupcities");
    await db.dropCollection("contacts");
  } catch (e) {
    console.log("No collection, skipping", e);
  }

  await Admin.create(
    {
      email: "AdminNum1@gmail.com",
      password: "Qwerty123",
      token: randomUUID(),
      role: "superAdmin",
      displayName: "Main Admin",
    },
    {
      email: "AdminNum2@gmail.com",
      password: "Qwerty123",
      token: randomUUID(),
      role: "admin",
      displayName: "Some Admin",
    },
    {
      email: "AdminNum3@gmail.com",
      password: "Qwerty123",
      token: randomUUID(),
      role: "admin",
      displayName: "Post Admin",
    },
  );

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
      },
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
    },
  ]);

  const courierFile = path.join(
    __dirname,
    "public/files/Список_городов_Е_КИТ_и_ПВЗ_5POST_051125.xlsx",
  );
  const pickupFile = path.join(
    __dirname,
    "public/files/Список_городов_Е_КИТ_и_ПВЗ_5POST_051125_2_Курьер_доставка_до_двери.xlsx",
  );

  await importCities(courierFile, "courier");
  await importCities(pickupFile, "pickup");
  await db.close();
};

run().catch(console.error);
