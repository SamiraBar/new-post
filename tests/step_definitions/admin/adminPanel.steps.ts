import { I } from "../steps";

When('ввожу в поле {string} значение {string}', (name: string, value: string) => {
    I.fillField(name, value);
    I.wait(1);
});

Then('вижу текст {string}', (text: string) => {
    I.see(text);
    I.wait(1);
});

let parcelsBefore = 0;
const cardSelector = '[data-testid="parcel-item"]';

When('нажимаю на кнопку {string} для списка посылок', async (buttonText) => {
    parcelsBefore = await I.grabNumberOfVisibleElements(cardSelector);

    I.scrollPageToBottom();
    I.click(`//button[contains(., "${buttonText}")]`);
    I.wait(2);
});

Then('вижу больше карточек посылок на странице', async () => {
    const parcelsAfter = await I.grabNumberOfVisibleElements(cardSelector);

    if (parcelsAfter <= parcelsBefore) {
        throw new Error(`Карточек не прибавилось: было ${parcelsBefore}, стало ${parcelsAfter}`);
    }
});