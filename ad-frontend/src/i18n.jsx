import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { HINDI, ENGLISH, SPANISH, ARABIC, URDU } from "../src/utils/languageTranslation"

i18n
  .use(initReactI18next).use(LanguageDetector).use(Backend)
  .init({
    // we init with resources
    resources: {
      en: {
        translations: ENGLISH,
      },
      ae: {
        translations: ARABIC,
      },
      pk: {
        translations: URDU,
      },
      es: {
        translations: SPANISH
      },
      in: {
        translations: HINDI
      },
    },
    fallbackLng: "en",
    debug: false,
    detection: {
      order: ['cookie', 'htmlTag', 'localStorage', 'path', 'subdomain'],
      caches: ['cookie'],
    },

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;