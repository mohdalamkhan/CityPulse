import React, { forwardRef } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  TouchableOpacity,
  I18nManager,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import { COLORS } from '@constants';
import Icon from 'react-native-vector-icons/Ionicons';

import { TextInputProps } from './types';
import { styles } from './styles';

const TextInput = forwardRef<RNTextInput, TextInputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      onRightIconPress,
      variant = 'default',
      size = 'medium',
      style,
      ...props
    },
    ref,
  ) => {
    const getContainerStyle = () => {
      const baseStyle: StyleProp<ViewStyle> = [styles.container];

      if (variant === 'filled') {
        baseStyle.push(styles.filledContainer);
      } else if (variant === 'outlined') {
        baseStyle.push(styles.outlinedContainer);
      } else {
        baseStyle.push(styles.defaultContainer);
      }

      if (size === 'small') {
        baseStyle.push(styles.smallContainer);
      } else if (size === 'large') {
        baseStyle.push(styles.largeContainer);
      }

      if (error) {
        baseStyle.push(styles.errorContainer);
      }

      return baseStyle;
    };

    const getInputStyle = () => {
      const baseStyle: StyleProp<TextStyle> = [styles.input];

      if (I18nManager.isRTL) {
        baseStyle.push(styles.inputRTL);
      }

      if (size === 'small') {
        baseStyle.push(styles.smallInput);
      } else if (size === 'large') {
        baseStyle.push(styles.largeInput);
      }

      return baseStyle;
    };

    const renderIcon = (iconName: string, color: string) => {
      return <Icon name={iconName} size={20} color={color} />;
    };

    return (
      <View style={[styles.wrapper, style]}>
        {label && (
          <Text style={[styles.label, I18nManager.isRTL && styles.labelRTL]}>
            {label}
          </Text>
        )}

        <View style={getContainerStyle()}>
          {leftIcon && (
            <View style={styles.leftIconContainer}>
              {renderIcon(leftIcon, error ? COLORS.error : COLORS.gray400)}
            </View>
          )}

          <RNTextInput
            ref={ref}
            style={getInputStyle()}
            placeholderTextColor={COLORS.gray400}
            textAlign={I18nManager.isRTL ? 'right' : 'left'}
            {...props}
          />

          {rightIcon && (
            <TouchableOpacity
              style={styles.rightIconContainer}
              onPress={onRightIconPress}
            >
              {renderIcon(rightIcon, error ? COLORS.error : COLORS.gray400)}
            </TouchableOpacity>
          )}
        </View>

        {error && (
          <Text
            style={[styles.errorText, I18nManager.isRTL && styles.errorTextRTL]}
          >
            {error}
          </Text>
        )}
      </View>
    );
  },
);

TextInput.displayName = 'TextInput';

export default TextInput;
