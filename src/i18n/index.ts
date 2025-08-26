import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

import en from './locales/en.json';
import ar from './locales/ar.json';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

const getDeviceLanguage = (): string => {
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDeviceLanguage(),
    fallbackLng: 'en',
    debug: __DEV__,
    
    interpolation: {
      escapeValue: false,
    },
    
    react: {
      useSuspense: false,
    },
  });

export const changeLanguage = async (language: string) => {
  try {
    await i18n.changeLanguage(language);
    
    const isRTL = language === 'ar';
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    
    return true;
  } catch (error) {
    console.error('Error changing language:', error);
    return false;
  }
};

export const getCurrentLanguage = (): string => {
  return i18n.language;
};

export const isRTL = (): boolean => {
  return i18n.language === 'ar';
};

export default i18n; 