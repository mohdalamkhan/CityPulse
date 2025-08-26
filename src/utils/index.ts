import { VALIDATION } from '@constants';
import { LanguageCode } from '@types';

// Validation Utilities
export const validateEmail = (email: string): boolean => {
  return VALIDATION.EMAIL_REGEX.test(email.trim().toLowerCase());
};

export const validatePassword = (
  password: string,
  t?: (key: string, options?: any) => string,
): {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'fair' | 'good' | 'strong';
} => {
  const errors: string[] = [];
  let strengthScore = 0;

  // Length validation
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    errors.push(
      t
        ? t('auth.passwordStrength.tooShort', {
            minLength: VALIDATION.PASSWORD_MIN_LENGTH,
          })
        : `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
    );
  } else {
    strengthScore += 1;
    if (password.length >= 12) strengthScore += 1; // Bonus for longer passwords
  }

  // Uppercase validation
  if (!/[A-Z]/.test(password)) {
    errors.push(
      t
        ? t('auth.passwordStrength.needsUppercase')
        : 'Password must contain at least one uppercase letter',
    );
  } else {
    strengthScore += 1;
  }

  // Lowercase validation
  if (!/[a-z]/.test(password)) {
    errors.push(
      t
        ? t('auth.passwordStrength.needsLowercase')
        : 'Password must contain at least one lowercase letter',
    );
  } else {
    strengthScore += 1;
  }

  // Number validation
  if (!/\d/.test(password)) {
    errors.push(
      t
        ? t('auth.passwordStrength.needsNumber')
        : 'Password must contain at least one number',
    );
  } else {
    strengthScore += 1;
  }

  // Special character validation
  if (!VALIDATION.PASSWORD_SPECIAL_CHARS.test(password)) {
    errors.push(
      t
        ? t('auth.passwordStrength.needsSpecialChar')
        : 'Password must contain at least one special character (!@#$%^&*)',
    );
  } else {
    strengthScore += 1;
  }

  // Determine strength based on score
  let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak';
  if (strengthScore >= 6) strength = 'strong';
  else if (strengthScore >= 5) strength = 'good';
  else if (strengthScore >= 3) strength = 'fair';

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
};

export const validateUsername = (username: string): boolean => {
  const trimmed = username.trim();
  return (
    trimmed.length >= VALIDATION.USERNAME_MIN_LENGTH &&
    trimmed.length <= VALIDATION.USERNAME_MAX_LENGTH
  );
};

export const validateSearchTerm = (term: string): boolean => {
  return term.trim().length >= VALIDATION.SEARCH_MIN_LENGTH;
};

// String Utilities
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str: string): string => {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

export const removeHtmlTags = (html: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Date Utilities
export const formatDate = (
  date: Date | string,
  locale: LanguageCode = 'en',
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return 'Invalid Date';

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat(
    locale === 'ar' ? 'ar-SA' : 'en-US',
    options,
  ).format(dateObj);
};

export const formatTime = (
  date: Date | string,
  locale: LanguageCode = 'en',
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return 'Invalid Time';

  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: locale === 'en',
  };

  return new Intl.DateTimeFormat(
    locale === 'ar' ? 'ar-SA' : 'en-US',
    options,
  ).format(dateObj);
};

export const formatDateTime = (
  date: Date | string,
  locale: LanguageCode = 'en',
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return 'Invalid DateTime';

  return `${formatDate(dateObj, locale)} ${formatTime(dateObj, locale)}`;
};

export const getRelativeTime = (
  date: Date | string,
  locale: LanguageCode = 'en',
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((dateObj.getTime() - now.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US');

  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(diffInSeconds, 'second');
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(diffInMinutes, 'minute');
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (Math.abs(diffInHours) < 24) {
    return rtf.format(diffInHours, 'hour');
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (Math.abs(diffInDays) < 30) {
    return rtf.format(diffInDays, 'day');
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (Math.abs(diffInMonths) < 12) {
    return rtf.format(diffInMonths, 'month');
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return rtf.format(diffInYears, 'year');
};

export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();

  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

export const isTomorrow = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    dateObj.getDate() === tomorrow.getDate() &&
    dateObj.getMonth() === tomorrow.getMonth() &&
    dateObj.getFullYear() === tomorrow.getFullYear()
  );
};

export const isThisWeek = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return dateObj >= startOfWeek && dateObj <= endOfWeek;
};

// Number Utilities
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: LanguageCode = 'en',
): string => {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
  };

  return new Intl.NumberFormat(
    locale === 'ar' ? 'ar-SA' : 'en-US',
    options,
  ).format(amount);
};

export const formatNumber = (
  num: number,
  locale: LanguageCode = 'en',
): string => {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US').format(num);
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Array Utilities
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const removeDuplicates = <T>(array: T[], key?: keyof T): T[] => {
  if (!key) {
    return [...new Set(array)];
  }

  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

export const groupBy = <T, K extends keyof T>(
  array: T[],
  key: K,
): { [key: string]: T[] } => {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as { [key: string]: T[] });
};

// Object Utilities
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (Array.isArray(obj))
    return obj.map(item => deepClone(item)) as unknown as T;

  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
};

export const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
};

export const isEmpty = (value: any): boolean => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

// URL and Link Utilities
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const addProtocol = (url: string): string => {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

// Device and Platform Utilities
export const isAndroid = (): boolean => {
  return require('react-native').Platform.OS === 'android';
};

export const isIOS = (): boolean => {
  return require('react-native').Platform.OS === 'ios';
};

// Async Utilities
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const timeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), ms),
    ),
  ]);
};

export const retry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000,
): Promise<T> => {
  let lastError: Error;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries) {
        await delay(delayMs * (i + 1)); // Exponential backoff
      }
    }
  }

  throw lastError!;
};

// Debounce Utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

// Throttle Utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let lastTime = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      func(...args);
    }
  };
};

// Color Utilities
export const hexToRgb = (
  hex: string,
): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${[r, g, b]
    .map(x => Math.round(clamp(x, 0, 255)).toString(16).padStart(2, '0'))
    .join('')}`;
};

export const addAlpha = (color: string, alpha: number): string => {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clamp(alpha, 0, 1)})`;
};

// Responsive utilities
export * from './responsive';
