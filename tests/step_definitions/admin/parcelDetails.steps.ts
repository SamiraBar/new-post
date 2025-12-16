import { I } from "../steps";

const cardSelector = '[data-testid="parcel-item"]';

When('нажимаю на кнопку {string} у первой карточки', async (buttonText: string) => {
    await I.scrollTo(`${cardSelector}:nth-of-type(1)`);

    const buttons = await I.grabTextFromAll(
        `${cardSelector}:nth-of-type(1) button`
    );

    const index = buttons.findIndex(
        text => text.trim() === buttonText
    );

    if (index === -1) {
        throw new Error(`Кнопка с текстом "${buttonText}" не найдена`);
    }

    await I.click(
        `${cardSelector}:nth-of-type(1) button:nth-of-type(${index + 1})`
    );
    I.wait(1);
});

Then('я перехожу на страницу детали посылки', async () => {
    const url = await I.grabCurrentUrl();

    if (!/\/parcels\/.+/.test(url)) {
        throw new Error(
            `Ожидался URL вида /parcels/:id, но найдено ${url}`
        );
    }

    I.see('Вес:');
});

When('нажимаю на ссылку {string}', (linkText: string) => {
    I.click(`//span[text()='${linkText}']`);
    I.wait(1);
});

Then('я возвращаюсь на страницу панели администратора', async () => {
    const currentUrl = await I.grabCurrentUrl();

    if (!currentUrl.endsWith('/admin')) {
        throw new Error(
            `Ожидался переход на /admin, но текущий URL: ${currentUrl}`
        );
    }

    await I.see('Управление посылками');
});