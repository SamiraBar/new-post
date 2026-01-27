import { I } from "../steps";

const selectors = {
  headerCalculate: '//h4[contains(normalize-space(.), "Рассчитать доставку")]',
  headerTracking: '//h4[contains(normalize-space(.), "Отследить посылку")]',

  calculateButton: '//button[contains(normalize-space(.), "Рассчитать")]',

  modal: '[role="dialog"]',
  modalContent: '[role="dialog"] > div',
  modalTitle: '//h2[contains(normalize-space(.), "Выберите тип доставки")]',

  modalCloseButton: '[role="dialog"] button[class*="rounded-full"]',
  modalCloseButtonInHeader: '[role="dialog"] div[class*="gradient"] button:last-of-type',

  pickupButton: '//button[contains(normalize-space(.), "Доставка до пункта выдачи")]',
  doorButton: '//button[contains(normalize-space(.), "Доставка посылки до двери")]',

  calculator: "#calculator",
  calculatorPickupButton: '//button[contains(normalize-space(.), "ПВЗ")]',
  calculatorDoorButton: '//button[contains(normalize-space(.), "Курьер")]',
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
    I.see("Рассчитать доставку");
  } else if (headerText.toLowerCase().includes("отследить")) {
    I.waitForElement(selectors.headerTracking, 10);
    I.seeElement(selectors.headerTracking);
    I.see("Отследить посылку");
  }
});

When("я кликаю на кнопку {string}", (buttonText: string) => {
  const lowerText = buttonText.toLowerCase();

  if (lowerText.includes("рассчитать")) {
    I.waitForElement(selectors.calculateButton, 10);
    I.click(selectors.calculateButton);
    I.wait(1.5);
  } else if (lowerText.includes("пункта выдачи")) {
    I.waitForElement(selectors.pickupButton, 10);
    I.click(selectors.pickupButton);
    I.wait(0.5);
  } else if (lowerText.includes("посылки до двери")) {
    I.waitForElement(selectors.doorButton, 10);
    I.click(selectors.doorButton);
    I.wait(0.5);
  }
});

Then("я вижу модальное окно выбора доставки", () => {
  I.waitForElement(selectors.modal, 10);
  I.seeElement(selectors.modal);
  I.seeElement(selectors.modalContent);
  I.wait(0.5);
});

Then("я вижу заголовок {string} в модальном окне", (title: string) => {
  I.waitForElement(selectors.modalTitle, 10);
  I.seeElement(selectors.modalTitle);
  I.see("Выберите тип доставки", selectors.modal);
});

Then("я вижу кнопку {string} в модальном окне", (buttonText: string) => {
  I.wait(0.5);

  if (buttonText.toLowerCase().includes("пункта выдачи")) {
    I.waitForElement(selectors.pickupButton, 10);
    I.seeElement(selectors.pickupButton);
  } else if (buttonText.toLowerCase().includes("посылки до двери")) {
    I.waitForElement(selectors.doorButton, 10);
    I.seeElement(selectors.doorButton);
  }
});

Then("я вижу иконку закрытия модального окна выбора доставки", () => {
  I.wait(0.5);
  I.waitForElement(selectors.modalCloseButtonInHeader, 5);
  I.seeElement(selectors.modalCloseButtonInHeader);
});

Then("я вижу иконку закрытия модального окна", () => {
  I.wait(0.5);
  I.waitForElement(selectors.modalCloseButtonInHeader, 5);
  I.seeElement(selectors.modalCloseButtonInHeader);
});

When("я кликаю на иконку закрытия модального окна", () => {
  I.wait(0.5);

  I.executeScript(() => {
    const modal = document.querySelector('[role="dialog"]');
    if (modal) {
      const closeButton = modal.querySelector(
        'button[class*="rounded-full"]',
      ) as HTMLElement;
      if (closeButton) {
        closeButton.click();
        return true;
      }

      const header = modal.querySelector('[class*="gradient"]');
      if (header) {
        const buttons = header.querySelectorAll("button");
        const lastButton = buttons[buttons.length - 1] as HTMLElement;
        if (lastButton) {
          lastButton.click();
          return true;
        }
      }
    }
    return false;
  });

  I.wait(1);
});

Then("модальное окно выбора доставки закрыто", () => {
  I.wait(1);
  I.dontSeeElement(selectors.modal);
});

When("я кликаю вне модального окна", () => {
  I.pressKey("Escape");
  I.wait(0.5);
});

Then("модальное окно выбора доставки закрывается", () => {
  I.wait(2);

  I.dontSeeElement(selectors.modal);
});

Then("я вижу калькулятор доставки", () => {
  I.wait(2);

  I.waitForElement(selectors.calculator, 10);
  I.seeElement(selectors.calculator);

  I.see("Калькулятор расчёта стоимости доставки");
});

Then("тип доставки {string} выбран автоматически", (deliveryType: string) => {
  I.wait(1);

  const lowerType = deliveryType.toLowerCase();

  if (lowerType.includes("пвз")) {
    I.waitForElement(selectors.calculatorPickupButton, 5);
    I.seeElement(selectors.calculatorPickupButton);

    I.executeScript(() => {
      const pvzButton = document.evaluate(
        '//button[contains(normalize-space(.), "ПВЗ")]',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue as HTMLElement;

      if (!pvzButton) {
        throw new Error("Кнопка ПВЗ не найдена в калькуляторе");
      }

      const hasActiveClass =
        pvzButton.className.includes("bg-white") ||
        pvzButton.className.includes("bg-orange");

      if (!hasActiveClass) {
        throw new Error("Кнопка ПВЗ не имеет активного состояния");
      }

    return true;
    });
  } else if (lowerType.includes("курьер")) {
    I.waitForElement(selectors.calculatorDoorButton, 5);
    I.seeElement(selectors.calculatorDoorButton);

    I.executeScript(() => {
      const courierButton = document.evaluate(
        '//button[contains(normalize-space(.), "Курьер")]',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue as HTMLElement;

      if (!courierButton) {
        throw new Error("Кнопка Курьер не найдена в калькуляторе");
      }

      const hasActiveClass =
        courierButton.className.includes("bg-white") ||
        courierButton.className.includes("bg-orange");

      if (!hasActiveClass) {
        throw new Error("Кнопка Курьер не имеет активного состояния");
      }

      return true;
    });
  }
});
