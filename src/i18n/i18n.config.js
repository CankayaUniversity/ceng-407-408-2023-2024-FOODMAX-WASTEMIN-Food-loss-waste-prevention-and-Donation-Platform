import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en, tr } from './translations';

const resources = {
  en: {
    translation: en,
  },
  tr: {
    translation: tr,
  },
};

// Check if i18next is already initialized before initializing it
if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    debug: false,
    lng: 'en',
    // language to use if translation in user language not available
    fallbackLng: 'en',
    resources,
  });
}

export default i18next;
