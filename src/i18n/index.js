import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import fr from './fr.json';

i18n.use(initReactI18next).init({
    resources: { fr: { translation: fr }, en: { translation: en } },
    lng: navigator.language.startsWith('fr') ? 'fr' : 'en',
    fallbackLng: 'fr',
    interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (lng) => {
    document.documentElement.setAttribute('lang', lng);
});

export default i18n;
