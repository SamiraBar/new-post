import * as fs from "fs";
import * as path from "path";

type TranslationObject = {
  [key: string]: string | TranslationObject;
};

class I18nHelper {
  private translations: {
    ru: TranslationObject;
    kg: TranslationObject;
  };

  private currentLanguage: "ru" | "kg" = "ru";

  constructor() {
    const frontendPath = path.join(__dirname, "../../front/src/i18n/locales");

    this.translations = {
      ru: this.loadTranslations(path.join(frontendPath, "ru.json")),
      kg: this.loadTranslations(path.join(frontendPath, "kg.json")),
    };
  }

  private loadTranslations(filePath: string): TranslationObject {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      console.warn(`Failed to load translations from ${filePath}`);
      return {};
    }
  }

  t(key: string, lang?: "ru" | "kg"): string {
    const language = lang || this.currentLanguage;
    const keys = key.split(".");

    let value: any = this.translations[language];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        console.warn(
          `Translation key not found: ${key} for language: ${language}`,
        );
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  }

  setLanguage(lang: "ru" | "kg") {
    this.currentLanguage = lang;
  }

  getLanguage(): "ru" | "kg" {
    return this.currentLanguage;
  }
}

export const i18n = new I18nHelper();
