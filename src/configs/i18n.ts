import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import EnglishLanguage from '../locales/en.json'
import FinnishLanguage from '../locales/fn.json'

i18n
  .use(Backend)
  .use(LanguageDetector)

  // Enables the hook initialization module
  .use(initReactI18next)
  .init({
    resources: {
      "en": { translation: EnglishLanguage },
      "fn": { translation: FinnishLanguage }
    },
    fallbackLng: "en",
    debug: false,
    keySeparator: false,
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
      formatSeparator: ",",
    },
  });

export default i18n;
