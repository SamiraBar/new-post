import { I } from "../steps";

const cardSelector = '[data-testid="parcel-item"]';
const timeline = '[data-testid="parcel-status-timeline"]';

const editTooltip = "Изменить статус";
let lastPickedStatus = '';


When('нажимаю на кнопку {string} у первой карточки', async (buttonText: string) => {
    if (buttonText.trim() !== 'Подробнее') {
        throw new Error(`Ожидалась только кнопка "Подробнее", пришло: "${buttonText}"`);
    }

    const firstCard = `${cardSelector}:nth-of-type(1)`;
    const moreBtn = `${firstCard} button:has(svg.lucide-ellipsis)`;

    I.scrollTo(firstCard);
    I.waitForElement(firstCard, 5);

    I.waitForElement(moreBtn, 10);
    I.click(moreBtn);
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
    I.seeElement(`${timeline} button.bg-gradient-to-br.from-green-500.to-green-600`);
});

Then('предыдущие статусы помечены как выполненные', () => {
    I.seeElement(`${timeline} svg.lucide-check`);
});

When('я нажимаю на кнопку "Изменить статус"', () => {
    I.moveCursorTo(timeline);
    I.see(editTooltip);
    I.click(`//div[text()='${editTooltip}']/ancestor::button`);

    I.waitForFunction(() => {
        const el = document.querySelector('[data-testid="parcel-status-timeline"]');
        return !!el && el.querySelectorAll('button').length > 0;
    }, 5);
});


Then('вижу подсказку {string}', (text: string) => {
    I.see(text);
});

When('выбираю статус {string}', (status: string) => {
    lastPickedStatus = status;

    const btn = `${timeline} button[aria-label="${status}"]`;
    I.waitForElement(btn, 10);

    I.dontSeeElement(`${btn}[disabled]`);

    I.click(btn);
});


Then('выбранный статус подсвечивается', () => {
    if (!lastPickedStatus) throw new Error('lastPickedStatus пустой');

    const btn = `${timeline} button[aria-label="${lastPickedStatus}"]`;

    I.waitForElement(btn, 5);
    I.seeElement(`${btn}.bg-gradient-to-br.from-green-500.to-green-600`);
    I.seeElement(`${btn}[class*="shadow-green-200"]`);
});

When('в панели статуса нажимаю {string}', (action: string) => {
    const map: Record<string, string> = {
        'Сохранить': 'Сохранить статус',
        'Отменить': 'Отменить',
    };

    const tooltip = map[action] ?? action;

    const btn = `//div[@data-testid="parcel-status-timeline"]//button[.//div[normalize-space(.)='${tooltip}']]`;

    I.waitForElement(btn, 5);
    I.click(btn);
});

Then('статус посылки обновляется на {string}', (status: string) => {
    I.waitForText(status, 10, timeline);
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
