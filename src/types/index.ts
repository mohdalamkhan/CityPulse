// API Types
export * from './api.types';

// Service Types
export * from './service.types';

// User Types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
  lastLoginAt?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: 'en' | 'ar';
  favoriteGenres: string[];
  defaultCity?: string;
  notifications: boolean;
  biometricEnabled: boolean;
}

// Favorites
export interface FavoriteEvent {
  eventId: string;
  eventData: TicketmasterEvent;
  addedAt: string;
  userId?: string;
}

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  Home: undefined;
  EventDetails: { eventId: string; event?: TicketmasterEvent };
  Profile: undefined;
};

// UI Component Types
export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}

export interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

// Language/Localization Types
export type LanguageCode = 'en' | 'ar';

export interface TranslationResource {
  [key: string]: string | TranslationResource;
}

// Storage Types
export interface StorageKeys {
  USER_DATA: 'user_data';
  FAVORITES: 'favorites';
  LANGUAGE: 'language';
  ONBOARDING_COMPLETE: 'onboarding_complete';
  BIOMETRIC_ENABLED: 'biometric_enabled';
}

// Map Types
export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface MapMarker {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description?: string;
}

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
}

// Theme Types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: object;
    h2: object;
    h3: object;
    body: object;
    caption: object;
  };
}
