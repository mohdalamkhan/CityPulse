import { ViewStyle, TextStyle } from 'react-native';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export interface ButtonConfig {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size: 'small' | 'medium' | 'large';
  disabled: boolean;
  loading: boolean;
}

export interface IconConfig {
  name: string;
  position: 'left' | 'right';
  size: number;
  color: string;
}

export interface ButtonStyleConfig {
  buttonStyle: ViewStyle[];
  textStyle: TextStyle[];
  iconColor: string;
  loadingColor: string;
}
