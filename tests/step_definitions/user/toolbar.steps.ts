import { I } from "../steps";
import { i18n } from "../../helpers/i18nHelper";

const pageMap: Record<string, string> = {
  "главной странице": "/",
};

const navHrefMap: Record<string, string> = {
  importantInfo: "#important-info",
  about: "#about",
  contacts: "#contacts",
};

const navTextExpected = {
  ru: {
    "nav.importantInfo": "Важная информация",
    "nav.about": "О компании",
    "nav.contacts": "Контакты",
  },
  kg: {
    "nav.importantInfo": "Маанилүү маалымат",
    "nav.about": "Биз жөнүндө",
    "nav.contacts": "Байланыштар",
  },
} as const;

const selectors = {
  logo: 'img[alt="New Post logo"]',
  logoLink: 'a[href="/"]',

  navigationLinkByHref: (href: string) =>
    `nav[aria-label="Main"] a[href="${href}"], nav[aria-label="Main"] a[href$="${href}"]`,

  navigationMenu: 'nav[aria-label="Main"]',

  importantInfoBlock: "#important-info",
  importantInfoTitle: "#important-info h3",

  aboutBlock: "#about",
  aboutTitle: "#about h3",

  footer: "footer#contacts",
  footerAddress: '//footer[contains(., "Новая Почта")]',
  footerPhone: 'footer a[href*="tel"]',
  footerEmail: 'footer a[href*="mailto"]',

  calculateDeliveryHeader: `//h4[contains(text(), "эсептөө") or contains(text(), "доставку")]`,
  trackParcelHeader: `//h4[contains(text(), "көзөмөлдөө") or contains(text(), "посылку")]`,

  languageSwitcher: 'button[role="switch"]',
  languageText: "span.text-sm.font-semibold.uppercase",

  burgerButton: 'button[aria-label="Toggle menu"]',
  mobileMenu: ".sm\\:hidden nav",
};

function getNavHref(navKey: string): string {
  const href = navHrefMap[navKey];
  if (!href) throw new Error(`Неизвестный href для navKey: ${navKey}`);
  return href;
}

function demonstratePageTranslation() {
  I.scrollTo("#calculator");
  I.wait(1);

  I.scrollTo(selectors.importantInfoBlock);
  I.wait(1);

  I.scrollTo(selectors.aboutBlock);
  I.wait(1);

  I.scrollTo('footer#contacts a[href*="mailto"]');
  I.wait(2);

  I.scrollPageToTop();
  I.wait(2);
}

Given("я нахожусь на {string}", (page: string) => {
  const url = pageMap[page];
  if (!url) {
    throw new Error(`Неизвестная страница: ${page}`);
  }

  I.amOnPage(url);
  I.wait(2);
  I.waitForElement(selectors.logo, 10);
  I.seeElement(selectors.navigationMenu);
});

Given("язык интерфейса установлен на {string}", (lang: "ru" | "kg") => {
  i18n.setLanguage(lang);
  I.wait(1);

  const expectedLangText = lang === "ru" ? "РУС" : "КЫР";

  try {
    I.see(expectedLangText, selectors.languageText);
  } catch (e) {
    I.click(selectors.languageSwitcher);
    I.wait(1);
    I.waitForText(expectedLangText, 5, selectors.languageText);
  }
});

When("я переключаю язык на {string}", (lang: "ru" | "kg") => {
  const currentLang = i18n.getLanguage();

  if (currentLang !== lang) {
    I.moveCursorTo(selectors.languageSwitcher);
    I.wait(0.5);

    I.click(selectors.languageSwitcher);
    I.wait(1);

    i18n.setLanguage(lang);

    const expectedLangText = lang === "ru" ? "РУС" : "КЫР";
    I.waitForText(expectedLangText, 5, selectors.languageText);
  } else {
    console.log(`✅ Язык уже установлен: ${lang}`);
  }
});

When("я переключаюсь между языками", () => {
  I.moveCursorTo(selectors.languageSwitcher);
  I.wait(0.5);

  I.click(selectors.languageSwitcher);
  I.wait(1);
  i18n.setLanguage("kg");
  I.waitForText("КЫР", 5, selectors.languageText);

  demonstratePageTranslation();

  I.moveCursorTo(selectors.languageSwitcher);
  I.wait(0.5);

  I.click(selectors.languageSwitcher);
  I.wait(1);
  i18n.setLanguage("ru");
  I.waitForText("РУС", 5, selectors.languageText);

  demonstratePageTranslation();
});

When("я кликаю на навигационную ссылку {string}", (navKey: string) => {
  const href = getNavHref(navKey);

  const linkSelector = selectors.navigationLinkByHref(href);
  I.waitForElement(linkSelector, 10);

  I.moveCursorTo(linkSelector);
  I.wait(1);

  I.click(linkSelector);
  I.wait(2);
});

When("я кликаю на логотип", () => {
  I.click(selectors.logoLink);
  I.wait(1);
});

When("я прокручиваю страницу вниз", () => {
  I.scrollTo(selectors.footer);
  I.wait(5);
});

Then("я вижу блок {string}", (blockKey: string) => {
  I.wait(1);

  switch (blockKey) {
    case "importantInfo":
      I.wait(1);

      I.waitForElement(selectors.importantInfoBlock, 10);
      I.seeElement(selectors.importantInfoBlock);

      I.waitForElement(selectors.importantInfoTitle, 10);
      I.seeElement(selectors.importantInfoTitle);
      break;

    case "about":
      I.wait(1);

      I.waitForElement(selectors.aboutBlock, 10);
      I.seeElement(selectors.aboutBlock);

      I.waitForElement(selectors.aboutTitle, 10);
      I.seeElement(selectors.aboutTitle);
      break;

    default:
      throw new Error(`Неизвестный блок: ${blockKey}`);
  }
});

Then("я вижу блок заголовка страницы", () => {
  I.waitForElement(selectors.calculateDeliveryHeader, 10);
  I.waitForElement(selectors.trackParcelHeader, 10);

  I.seeElement(selectors.calculateDeliveryHeader);
  I.seeElement(selectors.trackParcelHeader);
});

Then("я вижу футер с контактами", () => {
  I.scrollTo(selectors.footer);
  I.wait(5);

  I.waitForElement(selectors.footer, 10);
  I.seeElement(selectors.footer);

  I.see("Новая Почта", selectors.footer);
  I.see("+996 778 465 557", selectors.footer);
  I.see("janypochta.kg@gmail.com", selectors.footer);
});

Then("я вижу навигационную ссылку {string}", (navKey: string) => {
  const href = getNavHref(navKey);

  const linkSelector = selectors.navigationLinkByHref(href);
  I.wait(1);

  I.moveCursorTo(linkSelector);
  I.wait(0.8);

  I.waitForElement(linkSelector, 10);
  I.seeElement(linkSelector);
});

Then("я вижу текст навигации {string} на русском", (i18nKey: string) => {
  const text = (navTextExpected.ru as any)[i18nKey];
  if (!text) throw new Error(`Неизвестный ключ: ${i18nKey}`);
  I.see(text, selectors.navigationMenu);
});

Then("я вижу текст навигации {string} на кыргызском", (i18nKey: string) => {
  const text = (navTextExpected.kg as any)[i18nKey];
  if (!text) throw new Error(`Неизвестный ключ: ${i18nKey}`);
  I.see(text, selectors.navigationMenu);
});

Then("все навигационные ссылки отображаются корректно", () => {
  const navKeys = ["importantInfo", "about", "contacts"];

  navKeys.forEach((navKey) => {
    const href = getNavHref(navKey);

    const linkSelector = selectors.navigationLinkByHref(href);

    I.moveCursorTo(linkSelector);
    I.wait(0.5);

    I.waitForElement(linkSelector, 10);
    I.seeElement(linkSelector);
  });
});
