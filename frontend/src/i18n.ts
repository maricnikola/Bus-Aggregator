import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import sr from './locales/sr';

i18next
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: en,
      sr: sr,
    },
  });

export default i18next;
