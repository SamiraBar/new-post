import { I } from "../steps";

When('ввожу в поле {string} значение {string}', (name: string, value: string) => {
    I.fillField(name, value);
    I.wait(1);
});

Then('вижу текст {string}', (text: string) => {
    I.see(text);
    I.wait(1);
});

When('нажимаю на кнопку "Загрузить ещё" для списка посылок', () => {
    I.click('//button[contains(text(),"Загрузить ещё")]');
    I.wait(2);
});

Then('вижу больше карточек посылок на странице', () => {
    I.grabNumberOfVisibleElements('//div[contains(@class,"parcel-item")]').then((count) => {
        if (count === 0) throw new Error("Карточек посылок не найдено");
    });
    I.wait(1);
});
