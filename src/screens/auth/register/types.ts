export interface RegisterScreenProps {}

export interface RegisterFormData {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterScreenState {
  showPassword: boolean;
  showConfirmPassword: boolean;
}

export interface PasswordRequirement {
  text: string;
  met: boolean;
}
