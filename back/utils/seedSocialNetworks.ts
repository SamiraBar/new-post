import SocialMedia from "../models/SocialMedia";

export const seedSocialNetworks = async () => {
  try {
    const count = await SocialMedia.countDocuments();
    if (count > 0) {
      return;
    }

    const defaultSocials = [
      {
        name: "WhatsApp",
        url: "https://wa.me/996778465557?text=Здравствуйте%2C+у+меня+есть+вопрос",
        icon: "public/static/social/whatsapp.png",
        order: 0,
      },
      {
        name: "Instagram",
        url: "https://www.instagram.com/newpost.kg/",
        icon: "public/static/social/instagram.png",
        order: 1,
      },
    ];

    await SocialMedia.insertMany(defaultSocials);
  } catch (error) {
    console.error("Error seeding social networks:", error);
  }
};
