import { TextInputProps as RNTextInputProps } from 'react-native';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'small' | 'medium' | 'large';
}

export interface TextInputConfig {
  variant: 'default' | 'filled' | 'outlined';
  size: 'small' | 'medium' | 'large';
  hasError: boolean;
  hasLabel: boolean;
  hasLeftIcon: boolean;
  hasRightIcon: boolean;
}

export interface IconProps {
  name: string;
  color: string;
  size: number;
}

export interface InputStyleConfig {
  containerStyle: any[];
  inputStyle: any[];
  iconColor: string;
}
