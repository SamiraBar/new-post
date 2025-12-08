import {I} from "../steps"

const pageMap: Record<string, string> = {
    "входа": "/admin/login",
    "панель администратора": "/admin",
    "управление администраторами": "/admin/moderation"
}

const userPasswords: Record<string, string> = {
        "AdminNum1@gmail.com": "Qwerty123"
}

Given("я нахожусь на странице {string}",(page: string) => {
    I.amOnPage(pageMap[page])
    I.wait(1)
});

Given("я залогинен как {string}", (email: string) => {
    I.amOnPage(pageMap["входа"])
    I.wait(1)
    I.fillField("Почта", email)
    I.wait(1)
    I.fillField("Пароль", userPasswords[email])
    I.wait(1)
    I.click(`//button[text()="Login"]`)
    I.wait(1)
    I.see("Управление посылками")
})

When('ввожу в поле {string} значение {string}', (name: string, value: string) => {
    I.fillField(name, value);
    I.wait(1);
});

When('нажимаю на кнопку {string}', (buttonName: string) => {
    I.click(`//button[text()='${buttonName}']`)
    I.wait(1);
});

When('нажимаю на тег div с текстом {string}', (name: string) => {
    I.click(`//div[text()='${name}']`)
    I.wait(1);
});

When('нажимаю на кнопку {string} для администратора с именем {string}', (buttonName: string, adminEmail: string) => {
    I.click(`//div[text()='${adminEmail}']/following-sibling::div//button[text()='${buttonName}']`);
    I.wait(1);
});

When('нажимаю на кнопку {string} для администратора с email {string}', (buttonName: string, adminEmail: string) => {
    I.click(`//p[text()='${adminEmail}']/following-sibling::div//button[text()='${buttonName}']`);
    I.wait(1);
});

When('вижу тег p с текстом {string}', (name: string) => {
    I.seeElement(`//p[text()='${name}']`)
    I.wait(1);
});

Then('не вижу тег {string} с текстом {string}', (tag: string, name: string) => {
    I.dontSeeElement(`//${tag}[text()='${name}']`);
    I.wait(1);
});

Then('вижу тег {string} с текстом {string}', (tag: string, text: string) => {
    I.seeElement(`//${tag}[text()='${text}']`);
    I.wait(1);
});

Then('вижу текст {string}', (text: string) => {
    I.see(text);
    I.wait(1);
});

Then('администратор успешно изменен', () => {
    I.wait(1);
});