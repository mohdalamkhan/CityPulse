import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '@constants';

import { styles } from './styles';
import { ButtonProps } from './types';

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}) => {
  const getIconText = (iconName: string) => {
    const iconMap: Record<string, string> = {
      'arrow-forward': '→',
      checkmark: '✓',
      close: '✕',
      add: '+',
      remove: '−',
    };
    return iconMap[iconName] || '•';
  };

  const getButtonStyle = (): StyleProp<ViewStyle> => {
    const baseStyle: StyleProp<ViewStyle> = [styles.button];

    if (size === 'small') {
      baseStyle.push(styles.smallButton);
    } else if (size === 'large') {
      baseStyle.push(styles.largeButton);
    } else {
      baseStyle.push(styles.mediumButton);
    }

    if (variant === 'primary') {
      baseStyle.push(styles.primaryButton);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondaryButton);
    } else if (variant === 'outline') {
      baseStyle.push(styles.outlineButton);
    } else if (variant === 'ghost') {
      baseStyle.push(styles.ghostButton);
    }

    if (disabled || loading) {
      baseStyle.push(styles.disabledButton);
    }

    return [...baseStyle, style];
  };

  const getTextStyle = (): StyleProp<TextStyle> => {
    const baseStyle: StyleProp<TextStyle> = [styles.text];

    if (size === 'small') {
      baseStyle.push(styles.smallText);
    } else if (size === 'large') {
      baseStyle.push(styles.largeText);
    } else {
      baseStyle.push(styles.mediumText);
    }

    if (variant === 'primary' || variant === 'gradient') {
      baseStyle.push(styles.primaryText);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondaryText);
    } else if (variant === 'outline') {
      baseStyle.push(styles.outlineText);
    } else if (variant === 'ghost') {
      baseStyle.push(styles.ghostText);
    }

    if (disabled || loading) {
      baseStyle.push(styles.disabledText);
    }

    return [...baseStyle, textStyle];
  };

  const renderContent = () => {
    const iconElement = icon && !loading && (
      <Text
        style={[
          iconPosition === 'right' ? styles.rightIcon : styles.leftIcon,
          {
            fontSize: size === 'small' ? 16 : size === 'large' ? 24 : 20,
            color: getIconColor(),
          },
        ]}
      >
        {getIconText(icon)}
      </Text>
    );

    const loadingElement = loading && (
      <ActivityIndicator
        size={size === 'small' ? 'small' : 'small'}
        color={getLoadingColor()}
        style={styles.loading}
      />
    );

    const textElement = (
      <Text style={getTextStyle()} numberOfLines={1}>
        {title}
      </Text>
    );

    if (loading) {
      return (
        <View style={styles.contentContainer}>
          {loadingElement}
          {textElement}
        </View>
      );
    }

    if (iconPosition === 'right') {
      return (
        <View style={styles.contentContainer}>
          {textElement}
          {iconElement}
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        {iconElement}
        {textElement}
      </View>
    );
  };

  const getIconColor = (): string => {
    if (disabled || loading) return COLORS.gray400;

    if (variant === 'primary' || variant === 'gradient') return COLORS.white;
    if (variant === 'secondary') return COLORS.white;
    if (variant === 'outline') return COLORS.primary;
    if (variant === 'ghost') return COLORS.primary;

    return COLORS.white;
  };

  const getLoadingColor = (): string => {
    if (
      variant === 'primary' ||
      variant === 'secondary' ||
      variant === 'gradient'
    ) {
      return COLORS.white;
    }
    return COLORS.primary;
  };

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={
            disabled || loading
              ? [COLORS.gray300, COLORS.gray400]
              : [COLORS.primary, COLORS.primaryDark]
          }
          style={getButtonStyle()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

export default Button;
