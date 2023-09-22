import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

import translationEN from '@/assets/locales/en.json';
import translationIT from '@/assets/locales/it.json';

const initialLanguage = 'en';

const options = {
    interpolation: {
        escapeValue: false,
    },
    lng: initialLanguage,
    fallbackLng: "en",
    resources: {
        en: {
            translation: translationEN,
        },
        it: {
            translation: translationIT,
        },
    },
};

i18n.use(initReactI18next).init(options);




export function handleTranslation() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { t: trans, i18n } = useTranslation()
    return {
        trans,
        i18n
    }
}


export default i18n;
