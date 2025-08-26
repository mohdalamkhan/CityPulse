import { useState, useEffect, useCallback } from 'react';
import { LanguageCode } from '@types';
import { settingsStorage } from '@storage';

export const useLanguage = () => {
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [isRTL, setIsRTL] = useState(false);

  const loadLanguage = useCallback(async () => {
    try {
      const storedLanguage = await settingsStorage.getLanguage();
      setLanguageState(storedLanguage);
      setIsRTL(storedLanguage === 'ar');

      const { changeLanguage } = await import('../../i18n');
      await changeLanguage(storedLanguage);
    } catch (err) {
      console.error('Failed to load language:', err);
    }
  }, []);

  const setLanguage = useCallback(async (newLanguage: LanguageCode) => {
    try {
      const success = await settingsStorage.setLanguage(newLanguage);
      if (success) {
        setLanguageState(newLanguage);
        setIsRTL(newLanguage === 'ar');

        const { changeLanguage } = await import('../../i18n');
        await changeLanguage(newLanguage);

        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to set language:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    loadLanguage();
  }, [loadLanguage]);

  return {
    language,
    isRTL,
    setLanguage,
    loadLanguage,
  };
};
