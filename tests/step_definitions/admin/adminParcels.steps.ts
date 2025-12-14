import { I } from "../steps";

const cardSelector = '[data-testid="parcel-item"]';

Given('вижу хотя бы одну карточку посылки', async () => {
    const count = await I.grabNumberOfVisibleElements(cardSelector);
    if (count === 0) throw new Error('Не найдено ни одной карточки посылки');
});

When('нажимаю на кнопку {string} у первой карточки', async (buttonText) => {
    await I.scrollTo(`${cardSelector}:nth-of-type(1)`);
    await I.click(`${cardSelector}:nth-of-type(1) button`);
    await I.wait(1);
});

Then('я перехожу на страницу детали посылки', async () => {
    const url = await I.grabCurrentUrl();
    if (!url.match(/\/parcels\/\w+/)) {
        throw new Error(`Ожидался URL вида /parcels/:id, но найдено ${url}`);
    }
    await I.see('Получатель');
});
