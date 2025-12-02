import {I} from "../steps"

const pageMap: Record<string, string> = {
    "входа": "/admin/login",
    "панель администратора": "/admin",
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

When('нажимаю на кнопку {string}', (name: string) => {
    I.click(`//button[text()='${name}']`)
    I.wait(1);
});

When('нажимаю на div с текстом {string}', (name: string) => {
    I.click(`//div[text()='${name}']`)
    I.wait(1);
});


Then('я вижу текст {string}', (text: string) => {
    I.see(text);
    I.wait(1);
});