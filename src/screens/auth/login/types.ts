export interface LoginScreenProps {}

export interface RegisterScreenProps {}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthScreenState {
  showPassword: boolean;
  showConfirmPassword?: boolean;
}

export interface BiometricOptions {
  title: string;
  description: string;
  cancelText: string;
  fallbackText?: string;
}

export type FormErrors<T> = Record<keyof T, string>;
