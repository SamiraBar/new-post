import { I } from "../steps";

const cardSelector = '[data-testid="parcel-item"]';
const timeline = '[data-testid="parcel-status-timeline"]';

const editTooltip = "Изменить статус";
const cancelTooltip = "Отменить";
const saveTooltip = "Сохранить статус";

When('нажимаю на кнопку {string} у первой карточки', (buttonText: string) => {
    I.waitForElement(`${cardSelector}:nth-of-type(1)`, 5);
    I.scrollTo(`${cardSelector}:nth-of-type(1)`);
    I.grabTextFromAll(`${cardSelector}:nth-of-type(1) button`).then(buttons => {
        const index = buttons.findIndex(text => text.trim() === buttonText);
        if (index === -1) throw new Error(`Кнопка "${buttonText}" не найдена`);
        I.click(`${cardSelector}:nth-of-type(1) button:nth-of-type(${index + 1})`);
        I.wait(1);
    });
});

Then('я перехожу на страницу детали посылки', () => {
    I.waitForFunction(() => window.location.pathname.includes('/parcels/'), 5);
    I.grabCurrentUrl().then(url => {
        if (!/\/parcels\/.+/.test(url)) {
            throw new Error(`Ожидался URL вида /parcels/:id, но найдено ${url}`);
        }
    });
    I.see('Вес:');
    I.waitForElement('[data-testid="partner-tracking-row"]', 5);
});

Then('вижу таймлайн статусов посылки', () => {
    I.seeElement(timeline);
});

Then('в таймлайне активен текущий статус', () => {
    I.seeElement(`${timeline} div.bg-gradient-to-br.from-green-500.to-green-600`);
});

Then('предыдущие статусы помечены как выполненные', () => {
    I.seeElement(`${timeline} svg.lucide-check`);
});

When('я нажимаю на кнопку "Изменить статус"', () => {
    I.moveCursorTo(timeline);
    I.see(editTooltip);
    I.click(`//div[text()='${editTooltip}']/ancestor::button`);
});

Then('вижу подсказку {string}', (text: string) => {
    I.see(text);
});

When('выбираю статус {string}', (status: string) => {
    I.click(`//div[@data-testid="parcel-status-timeline"]//div[text()='${status}']/ancestor::div[contains(@class,'flex-col')]`);
});

Then('выбранный статус подсвечивается', () => {
    I.seeElement(`${timeline} .animate-ping`);
});

When('нажимаю на кнопку "Сохранить"', () => {
    I.see(saveTooltip);
    I.click(`//div[text()='${saveTooltip}']/ancestor::button`);
});

Then('вижу индикатор загрузки сохранения', () => {
    I.seeElement('[data-testid="status-save-loader"]');
});

Then('статус посылки обновляется на {string}', (status: string) => {
    I.see(status, timeline);
});

When('нажимаю на кнопку "Отменить"', () => {
    I.see(cancelTooltip);
    I.click(`//div[text()='${cancelTooltip}']/ancestor::button`);
});

Then('статус посылки не изменяется', () => {
    I.dontSeeElement(`${timeline} .animate-ping`);
});

Then('кнопка "Сохранить" недоступна', () => {
    I.seeElement(`${timeline} button[disabled]`);
});

Then('вижу лоадер сохранения статуса', () => {
    I.seeElement('[data-testid="status-save-loader"]');
});
