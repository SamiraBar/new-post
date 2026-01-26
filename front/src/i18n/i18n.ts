import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: localStorage.getItem('language') || 'ru',
    fallbackLng: 'ru',
    interpolation: { escapeValue: false },
    backend: {
      loadPath: `${import.meta.env.VITE_API_URL}/i18n-content/{{lng}}`,
    },
  });

i18n.on('languageChanged', (lng: string) => {
  localStorage.setItem('language', lng);
});

export default i18n;
