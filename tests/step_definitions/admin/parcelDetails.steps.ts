import { I } from "../steps";

const cardSelector = '[data-testid="parcel-item"]';

When('нажимаю на кнопку {string} у первой карточки', async (buttonText: string) => {
    await I.scrollTo(`${cardSelector}:nth-of-type(1)`);

    const buttons = await I.grabTextFromAll(`${cardSelector}:nth-of-type(1) button`);
    const index = buttons.findIndex(text => text.trim() === buttonText);
    if (index === -1) throw new Error(`Кнопка с текстом "${buttonText}" не найдена`);

    await I.click(`${cardSelector}:nth-of-type(1) button:nth-of-type(${index + 1})`);
    await I.wait(1);
});

Then('я перехожу на страницу детали посылки', async () => {
    const url = await I.grabCurrentUrl();
    if (!url.match(/\/parcels\/\w+/)) {
        throw new Error(`Ожидался URL вида /parcels/:id, но найдено ${url}`);
    }
    await I.see('Вес:');

    const count = await I.grabNumberOfVisibleElements(cardSelector);
    if (count === 0) throw new Error('Не найдено ни одной карточки посылки на странице деталей');
});

