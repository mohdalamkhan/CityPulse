export interface ProfileScreenProps {}

export interface ProfileScreenState {
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface SettingItem {
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
  type: 'navigation' | 'switch' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export interface SettingSection {
  title: string;
  items: SettingItem[];
}

export interface UserInfo {
  displayName?: string;
  email?: string;
  photoURL?: string;
  uid?: string;
}

export interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}

export interface AppInfo {
  version: string;
  buildNumber?: string;
  lastUpdate?: string;
}
