import {I} from "../steps"

const pageMap: Record<string, string> = {
    'входа': '/admin/login',
}

const userPasswords: Record<string, string> = {
    'AdminNum1@gmail.com': 'Qwerty123'
}

Given("я нахожусь на странице {string}",(page: string) => {
    I.amOnPage(pageMap[page])
    I.wait(2)
});

When('ввожу в поле {string} значение {string}', (name: string, value: string) => {
    I.fillField(name, value);
    I.wait(2);
});

When('нажимаю на кнопку {string}', (name: string) => {
    I.click(`//button[text()='${name}']`)
    I.wait(2);
});

Then('я вижу текст {string}', (text: string) => {
    I.see(text);
    I.wait(2);
});