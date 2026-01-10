import SocialMedia from "../models/SocialMedia";
import fs from "fs";
import path from "path";

export const seedSocialNetworks = async () => {
  try {
    const count = await SocialMedia.countDocuments();
    if (count > 0) {
      console.log("📱 Social networks already exist, skipping seed");
      return;
    }

    // Создаем папку для иконок
    const uploadDir = path.join(__dirname, "../../public/uploads/social");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log("📁 Created uploads/social directory");
    }

    // Пытаемся скопировать иконки из фронта
    const frontIconsDir = path.join(
      __dirname,
      "../../../front/src/assets/cosialIcons",
    );

    try {
      if (fs.existsSync(path.join(frontIconsDir, "whatsapp.png"))) {
        fs.copyFileSync(
          path.join(frontIconsDir, "whatsapp.png"),
          path.join(uploadDir, "whatsapp.png"),
        );
        console.log("✅ Copied WhatsApp icon");
      }

      if (fs.existsSync(path.join(frontIconsDir, "instagram.png"))) {
        fs.copyFileSync(
          path.join(frontIconsDir, "instagram.png"),
          path.join(uploadDir, "instagram.png"),
        );
        console.log("✅ Copied Instagram icon");
      }
    } catch (copyError) {
      console.log(
        "⚠️  Could not copy icons automatically. Please copy manually:",
      );
      console.log("   whatsapp.png → back/public/uploads/social/whatsapp.png");
      console.log(
        "   instagram.png → back/public/uploads/social/instagram.png",
      );
    }

    // Создаем записи в БД
    const defaultSocials = [
      {
        name: "WhatsApp",
        url: "https://wa.me/996778465557?text=Здравствуйте%2C+у+меня+есть+вопрос",
        icon: "uploads/social/whatsapp.png",
        order: 0,
      },
      {
        name: "Instagram",
        url: "https://www.instagram.com/newpost.kg/",
        icon: "uploads/social/instagram.png",
        order: 1,
      },
    ];

    await SocialMedia.insertMany(defaultSocials);
    console.log("✅ Social networks seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding social networks:", error);
  }
};
