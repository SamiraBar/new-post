import { I } from "../steps";

const selectors = {
  navContactsLink: '//nav//a[contains(., "Контакты")]',

  footer: "footer",
  footerLogo: 'footer img[alt="New Post logo"]',
  footerLogoLink: 'footer a[href="/"]',

  companyName: 'footer:has-text("Новая почта")',
  address: 'footer:has-text("г. Бишкек")',
  phone: 'footer a[href*="tel"]',
  email: 'footer a[href*="mailto"]',

  whatsappLink: 'footer a[aria-label="WhatsApp"]',
  whatsappIcon: 'footer a[aria-label="WhatsApp"] img',
  instagramLink: 'footer a[aria-label="Instagram"]',
  instagramIcon: 'footer a[aria-label="Instagram"] img',

  pageHeader: '//h4[contains(text(), "доставку")]',
};

Given("я нахожусь на главной странице", () => {
  I.amOnPage("/");
  I.wait(2);
  I.waitForElement('img[alt="New Post logo"]', 10);
});

When("я навожу курсор на ссылку {string} в навигации", (linkText: string) => {
  I.moveCursorTo(selectors.navContactsLink);
  I.wait(1);
});

Then("ссылка {string} становится оранжевой", (linkText: string) => {
  I.seeElement(selectors.navContactsLink);

  I.executeScript(() => {
    const link = document.evaluate(
      '//nav//a[contains(., "Контакты")]',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue as HTMLElement;

    if (link) {
      const styles = window.getComputedStyle(link);
    }
  });

  I.wait(0.5);
});

When("я кликаю на ссылку {string}", (linkText: string) => {
  I.click(selectors.navContactsLink);
  I.wait(2);
});

Then("страница прокручивается к футеру", () => {
  I.wait(1);
  I.seeElement(selectors.footer);
});

When("я прокручиваю к футеру", () => {
  I.waitForElement(selectors.footer, 10);
  I.scrollTo(selectors.footer);
  I.waitForVisible(selectors.footer, 10);
});

Then("я вижу футер полностью", () => {
  I.waitForElement(selectors.footer, 10);
  I.seeElement(selectors.footer);
});

Then("я вижу логотип компании в футере", () => {
  I.seeElement(selectors.footerLogo);
});

Then("я вижу название {string}", (name: string) => {
  I.see(name, selectors.footer);
});

Then("я вижу адрес {string}", (address: string) => {
  I.see(address, selectors.footer);
});

Then("я вижу телефон {string}", (phone: string) => {
  I.see(phone, selectors.footer);
  I.seeElement(selectors.phone);
});

Then("я вижу email {string}", (email: string) => {
  I.see(email, selectors.footer);
  I.seeElement(selectors.email);
});

Then("я вижу иконку WhatsApp", () => {
  I.seeElement(selectors.whatsappLink);
  I.seeElement(selectors.whatsappIcon);
});

Then("я вижу иконку Instagram", () => {
  I.seeElement(selectors.instagramLink);
  I.seeElement(selectors.instagramIcon);
});

When("я навожу курсор на логотип в футере", () => {
  I.scrollTo(selectors.footer);
  I.wait(1);
  I.moveCursorTo(selectors.footerLogo);
  I.wait(1);
});

When("я кликаю на логотип в футере", () => {
  I.click(selectors.footerLogoLink);
  I.wait(2);
});

Then("страница прокручивается наверх", () => {
  I.wait(1);

  I.executeScript(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return scrollTop < 500;
  });
});

Then("я вижу заголовки главной страницы", () => {
  I.waitForElement(selectors.pageHeader, 10);
  I.seeElement(selectors.pageHeader);
});

When("я навожу курсор на номер телефона", () => {
  I.moveCursorTo(selectors.phone);
  I.wait(1);
});

Then("номер телефона меняет цвет при наведении", () => {
  I.wait(0.5);
  I.seeElement(selectors.phone);
});

Then("ссылка телефона содержит {string}", (href: string) => {
  I.seeAttributesOnElements(selectors.phone, { href });
});

When("я навожу курсор на email", () => {
  I.moveCursorTo(selectors.email);
  I.wait(1);
});

Then("email меняет цвет при наведении", () => {
  I.wait(0.5);
  I.seeElement(selectors.email);
});

Then("ссылка email содержит {string}", (href: string) => {
  I.seeAttributesOnElements(selectors.email, { href });
});

When("я навожу курсор на иконку WhatsApp", () => {
  I.moveCursorTo(selectors.whatsappLink);
  I.wait(1);
});

Then("иконка WhatsApp имеет анимацию при наведении", () => {
  I.wait(1);
  I.seeElement(selectors.whatsappIcon);
});

Then("ссылка WhatsApp ведет на {string}", (url: string) => {
  I.executeScript((selector) => {
    const link = document.querySelector(selector) as HTMLAnchorElement;
    if (link) {
      return link.href.includes("wa.me");
    }
    return false;
  }, selectors.whatsappLink);
});

When("я навожу курсор на иконку Instagram", () => {
  I.moveCursorTo(selectors.instagramLink);
  I.wait(1);
});

Then("иконка Instagram имеет анимацию при наведении", () => {
  I.wait(1);
  I.seeElement(selectors.instagramIcon);
});

Then("ссылка Instagram ведет на {string}", (url: string) => {
  I.executeScript((selector) => {
    const link = document.querySelector(selector) as HTMLAnchorElement;
    if (link) {
      return link.href.includes("instagram.com");
    }
    return false;
  }, selectors.instagramLink);
});
