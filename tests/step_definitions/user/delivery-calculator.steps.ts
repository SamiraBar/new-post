import { I } from "../steps";

const selectors = {
  headerCalculate: '//h4[contains(text(),"Рассчитать")]',
  calculateButton: '//button[contains(text(),"Рассчитать")]',
  modal: '[role="dialog"]',
  pickupButton: '//button[contains(.,"пункт")]',
  courierButton: '//button[contains(.,"двер")]',
  calculator: '#calculator',
  calculatorPvz: '//button[contains(text(),"ПВЗ")]',
  calculatorCourier: '//button[contains(text(),"Курьер")]',
  cityCombobox: 'button[role="combobox"]',
  weightInput: '//input[@type="number"]',
  priceInput: '//input[@name="parcelValue"]',
  nextButtonDisabled: '//button[@disabled]',
  errorText: 'div.text-red-500',
  officeCard: '[role="radio"]',
  pvzMap: '#measoft-map',
  courierCityInput: 'input[name="receiver.city"]',
  senderNameInput: 'input[name="sender.name"]',
  senderEmailInput: 'input[name="sender.email"]',
  totalSum: '//span[contains(text(),"сом")]',
};

// ---------------- GIVEN ----------------

Given("я нахожусь на главной странице", () => {
  I.amOnPage("/");
  I.waitForElement("body", 10);
});

// ---------------- SMOKE ----------------

Then("я вижу заголовок {string}", () => {
  I.seeElement(selectors.headerCalculate);
});

When("я кликаю на кнопку {string}", () => {
  I.waitForElement(selectors.calculateButton, 10);
  I.click(selectors.calculateButton);
});

Then("я вижу модальное окно выбора доставки", () => {
  I.waitForElement(selectors.modal, 10);
});

// ---------------- DELIVERY TYPE ----------------

When("я выбираю доставку до ПВЗ", () => {
  I.waitForElement(selectors.pickupButton, 10);
  I.click(selectors.pickupButton);
});

When("я выбираю курьерскую доставку", () => {
  I.waitForElement(selectors.courierButton, 10);
  I.click(selectors.courierButton);
});


Then("отображается калькулятор доставки", () => {
  I.waitForElement(selectors.calculator, 10);
});


Then("отображаются поля выбора городов", () => {
  I.waitForElement(selectors.cityCombobox, 10);
  I.seeNumberOfElements(selectors.cityCombobox, 2);
});

const assertDeliveryTypeSelected = (type: string) => {
  if (type === "ПВЗ") {
    I.seeElement(selectors.calculatorPvz);
  }

  if (type === "Курьер") {
    I.seeElement(selectors.calculatorCourier);
  }
};

When("выбран тип доставки {string}", (type: string) => {
  assertDeliveryTypeSelected(type);
});

Then("выбран тип доставки {string}", (type: string) => {
  assertDeliveryTypeSelected(type);
});
// ---------------- MODAL ----------------

Then("я вижу модальное окно выбора доставки", () => {
  I.waitForElement(selectors.modal, 10);
});

Then("я вижу заголовок {string} в модальном окне", (text: string) => {
  I.see(text, selectors.modal);
});

Then("я вижу кнопку {string} в модальном окне", (text: string) => {
  if (text.includes("пункта")) {
    I.seeElement('//button[contains(.,"пункт")]');
  }
  if (text.includes("двер")) {
    I.seeElement('//button[contains(.,"двер")]');
  }
});

Then("я вижу иконку закрытия модального окна", () => {
  I.seeElement(`${selectors.modal} button`);
});

When("я кликаю на иконку закрытия модального окна", () => {
  I.click(`${selectors.modal} button`);
});

When("я кликаю вне модального окна", () => {
  I.pressKey("Escape");
});

Then("модальное окно выбора доставки закрыто", () => {
  I.dontSeeElement(selectors.modal);
});

// ---------------- STEP 1 ----------------

When("отображается калькулятор доставки", () => {
  I.waitForElement(selectors.calculator, 10);
});

Then('кнопка "Далее" неактивна', () => {
  I.seeElement(selectors.nextButtonDisabled);
});

When("пользователь вводит вес посылки {string}", (value: string) => {
  I.waitForElement(selectors.weightInput, 5);
  I.fillField(selectors.weightInput, value);
});

When("пользователь вводит стоимость посылки {string}", (value: string) => {
  I.waitForElement(selectors.priceInput, 5);
  I.fillField(selectors.priceInput, value);
});

Then("значение веса округляется до {string}", (value: string) => {
  I.seeInField(selectors.weightInput, value);
});

Then("отображается ошибка превышения веса", () => {
  I.waitForElement(selectors.errorText, 5);
});

Then("отображается сообщение об ошибке стоимости", () => {
  I.waitForElement(selectors.errorText, 5);
});

// ---------------- STEP 2 ----------------

When("пользователь перешел к шагу выбора офиса отправителя", () => {
  I.waitForElement(selectors.officeCard, 10);
});

Then("отображается список офисов отправителя", () => {
  I.seeElement(selectors.officeCard);
});

When("пользователь не выбрал офис отправителя", () => {
  I.dontSeeElement('//div[@aria-checked="true"]');
});

Then("отображается предупреждение о выборе офиса", () => {
  I.seeElement(selectors.errorText);
});

// ---------------- STEP 3 ----------------

When("пользователь перешел к шагу выбора получателя", () => {
  I.wait(1);
});

Then("отображается карта выбора ПВЗ", () => {
  I.waitForElement(selectors.pvzMap, 15);
});

When("пользователь перешел к шагу ввода адреса", () => {
  I.wait(1);
});

Then("отображается форма ввода адреса доставки", () => {
  I.waitForElement(selectors.courierCityInput, 5);
});

When("пользователь оставил адрес пустым", () => {
  I.fillField(selectors.courierCityInput, " ");
});

Then("отображаются ошибки обязательных полей адреса", () => {
  I.waitForElement(selectors.errorText, 5);
});

// ---------------- STEP 4 ----------------

When("пользователь находится на шаге ввода данных", () => {
  I.waitForElement(selectors.senderNameInput, 10);
});

Then("отображаются поля данных отправителя", () => {
  I.seeElement(selectors.senderNameInput);
});

Then("отображаются поля данных получателя", () => {
  I.seeElement(selectors.courierCityInput);
});

When("пользователь не заполнил имя отправителя", () => {
  I.fillField(selectors.senderNameInput, " ");
});

When("пользователь вводит email отправителя {string}", (email: string) => {
  I.fillField(selectors.senderEmailInput, email);
});

Then("отображается сообщение об ошибке имени отправителя", () => {
  I.waitForElement(selectors.errorText, 5);
});

Then("отображается сообщение об ошибке email отправителя", () => {
  I.waitForElement(selectors.errorText, 5);
});

When("пользователь не заполнил содержимое посылки", () => {
});

Then("он может перейти к следующему шагу", () => {
  I.dontSeeElement(selectors.nextButtonDisabled);
});

// ---------------- STEP 5 ----------------

When("пользователь находится на шаге подтверждения", () => {
  I.waitForElement(selectors.totalSum, 10);
});

Then("отображается маршрут доставки", () => {
  I.see("Маршрут");
});

Then("отображается информация о посылке", () => {
  I.see("кг");
});

Then("отображается итоговая стоимость заказа", () => {
  I.seeElement(selectors.totalSum);
});

Then("итоговая сумма равна сумме доставки и страховки", () => {
  I.seeElement(selectors.totalSum);
});


// ---------- NEGATIVE VISIBILITY (REGRESSION) ----------

Then("список офисов отправителя не отображается", () => {
  I.dontSeeElement('[role="radio"]');
});

Then("карта выбора ПВЗ не отображается", () => {
  I.dontSeeElement('#measoft-map');
});

Then("форма ввода адреса доставки не отображается", () => {
  I.dontSeeElement('input[name="receiver.city"]');
  I.dontSeeElement('input[name="receiver.street"]');
});

Then("поля данных отправителя не отображаются", () => {
  I.dontSeeElement('input[name="sender.name"]');
  I.dontSeeElement('input[name="sender.email"]');
});

Then("поля данных получателя не отображаются", () => {
  I.dontSeeElement('input[name="receiver.name"]');
  I.dontSeeElement('input[name="receiver.email"]');
});

Then("итоговая стоимость заказа не отображается", () => {
  I.dontSee("Маршрут");
  I.dontSee("Итоговая сумма");
});
