export * from '../constants/api.constants';

export * from '../constants/service.constants';

export const STORAGE_KEYS = {
  USER_DATA: '@city_pulse_user_data',
  FAVORITES: '@city_pulse_favorites',
  LANGUAGE: '@city_pulse_language',
  ONBOARDING_COMPLETE: '@city_pulse_onboarding',
  BIOMETRIC_ENABLED: '@city_pulse_biometric',
  THEME: '@city_pulse_theme',
} as const;

export const COLORS = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primaryLight: '#818CF8',

  secondary: '#F59E0B',
  secondaryDark: '#D97706',
  secondaryLight: '#FCD34D',

  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  background: '#FFFFFF',
  backgroundDark: '#111827',
  surface: '#F9FAFB',
  surfaceDark: '#1F2937',

  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textLight: '#FFFFFF',
  textMuted: '#9CA3AF',

  // Border Colors
  border: '#E5E7EB',
  borderDark: '#374151',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
} as const;

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

// Typography
export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
  },
} as const;

// Border Radius
export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
} as const;

// Animation Durations
export const ANIMATION = {
  fast: 200,
  medium: 300,
  slow: 500,
} as const;

export const SCREEN = {
  HEADER_HEIGHT: 60,
  TAB_BAR_HEIGHT: 80,
  STATUS_BAR_HEIGHT: 44,
} as const;

export const LANGUAGES = {
  ENGLISH: 'en',
  ARABIC: 'ar',
} as const;

export const MAP_CONFIG = {
  INITIAL_REGION: {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  MARKER_DELTA: {
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  },
} as const;

export const IMAGE_SIZES = {
  thumbnail: { width: 60, height: 60 },
  small: { width: 120, height: 120 },
  medium: { width: 200, height: 150 },
  large: { width: 400, height: 300 },
  banner: { width: 800, height: 200 },
} as const;

export const APP_CONFIG = {
  APP_NAME: 'City Pulse',
  VERSION: '1.0.0',
  SPLASH_DURATION: 2000,
  DEBOUNCE_DELAY: 500,
  PAGINATION_THRESHOLD: 0.7,
  MAX_FAVORITES: 100,
  SUPPORTED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'webp'],
} as const;

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_SPECIAL_CHARS: /[!@#$%^&*(),.?":{}|<>]/,
  USERNAME_MIN_LENGTH: 2,
  USERNAME_MAX_LENGTH: 30,
  SEARCH_MIN_LENGTH: 2,
} as const;
