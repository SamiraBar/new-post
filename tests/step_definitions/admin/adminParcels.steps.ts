import { I } from "../steps";

const cardSelector = '[data-testid="parcel-item"]';

Given('вижу хотя бы одну карточку посылки', async () => {
    const count = await I.grabNumberOfVisibleElements(cardSelector);
    if (count === 0) throw new Error('Не найдено ни одной карточки посылки');
});

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

Then('я перехожу на страницу детали посылки', async () => {
    I.waitForFunction(() => window.location.pathname.includes('/parcels/'), 10);
    const url = await I.grabCurrentUrl();
    if (!/\/parcels\/.+/.test(url)) {
        throw new Error(`Ожидался URL вида /parcels/:id, но найдено ${url}`);
    }
    I.see('Получатель:');
});
