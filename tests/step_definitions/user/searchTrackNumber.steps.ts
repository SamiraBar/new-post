import { I } from "../steps";

const selectors = {
  headerCalculate: '//h4[contains(text(), "Рассчитать доставку")]',
  headerTracking: '//h4[contains(text(), "Отследить посылку")]',

  trackNumberInput: 'input[placeholder="Трек-номер..."]',
  searchButton: "button:has(.lucide-search)",

  statusModal: '[role="dialog"]',
  statusModalTitle: '[role="dialog"] h2',
  statusModalCloseButton: '[role="dialog"] button:has(.lucide-x)',

  trackNumberInModal: '[role="dialog"] p.font-mono',
  currentStatusText: '[role="dialog"] .text-lg.font-bold',
};

Given("я нахожусь на главной странице", () => {
  I.amOnPage("/");
  I.wait(2);
  I.waitForElement('img[alt="New Post logo"]', 10);
});

Then("я вижу заголовок {string}", (headerText: string) => {
  I.wait(1);

  if (headerText.toLowerCase().includes("рассчитать")) {
    I.waitForElement(selectors.headerCalculate, 10);
    I.seeElement(selectors.headerCalculate);
  } else if (headerText.toLowerCase().includes("отследить")) {
    I.waitForElement(selectors.headerTracking, 10);
    I.seeElement(selectors.headerTracking);
  }
});

Then("я вижу поле ввода трек-номера", () => {
  I.waitForElement(selectors.trackNumberInput, 10);
  I.seeElement(selectors.trackNumberInput);
});

Then("я вижу кнопку поиска с иконкой лупы", () => {
  I.waitForElement(selectors.searchButton, 10);
  I.seeElement(selectors.searchButton);
});

When("я ввожу трек-номер {string}", (trackNumber: string) => {
  I.waitForElement(selectors.trackNumberInput, 10);

  I.clearField(selectors.trackNumberInput);
  I.wait(0.3);

  I.fillField(selectors.trackNumberInput, trackNumber);
  I.wait(0.5);
});

When("я очищаю поле трек-номера", () => {
  I.wait(0.5);
  I.waitForElement(selectors.trackNumberInput, 10);

  I.clearField(selectors.trackNumberInput);
  I.wait(0.3);

  I.click(selectors.trackNumberInput);
  I.pressKey(["Control", "a"]);
  I.pressKey("Backspace");
  I.wait(0.5);
});

Then("поле трек-номера пустое", () => {
  I.wait(0.5);
  I.seeInField(selectors.trackNumberInput, "");
});

When("я кликаю на кнопку поиска трека", () => {
  I.waitForElement(selectors.searchButton, 10);
  I.click(selectors.searchButton);
  I.wait(1.5);
});

Then("я вижу уведомление {string}", (message: string) => {
  I.wait(1.5);
  I.see(message);
});

Then("уведомление об ошибке отображается красным цветом", () => {
  I.wait(0.5);
});

Then("я вижу модальное окно со статусом посылки", () => {
  I.wait(2);
  I.waitForElement(selectors.statusModal, 10);
  I.seeElement(selectors.statusModal);
});

Then(
  "я вижу трек-номер {string} в заголовке модального окна",
  (trackNumber: string) => {
    I.waitForElement(selectors.trackNumberInModal, 10);
    I.see(trackNumber);
  },
);

Then("я вижу текущий статус посылки в модальном окне", () => {
  I.waitForElement(selectors.currentStatusText, 10);
  I.seeElement(selectors.currentStatusText);
});

Then("я вижу пункт отправления в модальном окне", () => {
  I.wait(0.5);
  I.see("Пункт отправления");
});

Then("я вижу пункт выдачи в модальном окне", () => {
  I.wait(0.5);
  I.see("Пункт выдачи");
});

Then("я вижу историю отслеживания в модальном окне", () => {
  I.wait(0.5);
  I.see("История отслеживания");
});

Then("я вижу временные метки для статусов", () => {
  I.wait(0.5);
});

Then("я вижу иконки статусов в истории", () => {
  I.wait(0.5);
});

Then("я вижу иконку закрытия модального окна статуса", () => {
  I.waitForElement(selectors.statusModalCloseButton, 10);
  I.seeElement(selectors.statusModalCloseButton);
});

When("я кликаю на иконку закрытия модального окна статуса", () => {
  I.wait(0.5);
  I.waitForElement(selectors.statusModalCloseButton, 10);
  I.click(selectors.statusModalCloseButton);
  I.wait(1.5);
});

When("я кликаю вне модального окна статуса", () => {
  I.wait(0.5);
  I.pressKey("Escape");
  I.wait(1.5);
});

Then("модальное окно со статусом посылки закрывается", () => {
  I.wait(1.5);
  I.dontSeeElement(selectors.statusModal);
});

When("я прокручиваю модальное окно статуса вниз", () => {
  I.wait(0.5);
  I.scrollTo(selectors.statusModal);
  I.wait(0.5);
});

When("я прокручиваю модальное окно статуса вверх", () => {
  I.wait(0.5);
  I.scrollTo(selectors.statusModalTitle);
  I.wait(0.5);
});

Then("я вижу все элементы истории отслеживания", () => {
  I.wait(0.5);
  I.see("История отслеживания");
});

Then("я вижу заголовок модального окна статуса", () => {
  I.wait(0.5);
  I.waitForElement(selectors.statusModalTitle, 10);
  I.see("Статус посылки");
});
