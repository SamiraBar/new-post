import { I } from "../steps";

const cardSelector = '[data-testid="parcel-item"]';

const pageMap: Record<string, string> = {
    "входа": "/admin/login",
    "панель администратора": "/admin",
};

const userPasswords: Record<string, string> = {
    "AdminNum1@gmail.com": "Qwerty123"
};

Given('я залогинен как {string}', (email: string) => {
    I.amOnPage(pageMap["входа"]);
    I.wait(1);
    I.fillField("Почта", email);
    I.wait(1);
    I.fillField("Пароль", userPasswords[email]);
    I.wait(1);
    I.click('//button[text()="Login"]');
    I.waitForText("Управление посылками", 5);
    I.waitForElement(cardSelector, 5);
});

When('нажимаю на кнопку {string} у первой карточки', (buttonText: string) => {
    I.scrollTo(`${cardSelector}:nth-of-type(1)`);
    I.grabTextFromAll(`${cardSelector}:nth-of-type(1) button`).then(buttons => {
        const index = buttons.findIndex(text => text.trim() === buttonText);
        if (index === -1) throw new Error(`Кнопка "${buttonText}" не найдена`);
        I.click(`${cardSelector}:nth-of-type(1) button:nth-of-type(${index + 1})`);
        I.wait(1);
    });
});

Then('я перехожу на страницу детали посылки', () => {
    I.grabCurrentUrl().then(url => {
        if (!/\/parcels\/.+/.test(url)) throw new Error(`Ожидался URL вида /parcels/:id, но найдено ${url}`);
    });
    I.see('Вес:');
    I.waitForElement('[data-testid="partner-tracking-row"]', 5);
});

When('нажимаю на кнопку "Изменить" для трек номера партнера', () => {
    I.scrollTo('[data-testid="edit-partner-tracking"]');
    I.click('[data-testid="edit-partner-tracking"]');
    I.waitForElement('[data-testid="partner-tracking-input"]', 5);
});

When('ввожу новый трек номер партнера {string}', (value: string) => {
    I.fillField('[data-testid="partner-tracking-input"]', value);
    I.wait(1);
});

When('сохраняю трек номер партнера', () => {
    I.click('[data-testid="save-partner-tracking"]');
    I.waitForText('Трек номер партнера обновлен', 5);
});

Then('текст подтверждения об успешном обновлении отображается', () => {
    I.see('Трек номер партнера обновлен');
});

When('нажимаю на ссылку "список посылок"', async () => {
    await I.waitForElement('//a[.//span[text()="список посылок"]]', 5);
    await I.click('//a[.//span[text()="список посылок"]]');
    I.wait(1);
});

Then('я возвращаюсь на страницу панели администратора', () => {
    I.grabCurrentUrl().then(url => {
        if (!url.endsWith('/admin')) throw new Error(`Ожидался URL /admin, но найдено ${url}`);
    });
    I.see('Управление посылками');
});