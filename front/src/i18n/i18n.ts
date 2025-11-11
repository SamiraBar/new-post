import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ru from './locales/ru.json';
import kg from './locales/kg.json';

const resources = {
  ru: {
    translation: ru,
  },
  kg: {
    translation: kg,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'ru',
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng: string) => {
  localStorage.setItem('language', lng);
});

export default i18n;
