import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth, useForm } from '../../../hooks';
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from '../../../utils';

import Button from '../../../components/Button';
import TextInput from '../../../components/TextInput';

import { styles } from './styles';
import { RegisterFormData, RegisterScreenProps } from './types';

const RegisterScreen: React.FC<RegisterScreenProps> = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { register, isLoading } = useAuth();
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [confirmPasswordIsVisible, setConfirmPasswordIsVisible] =
    useState(false);
  const [passwordStrengthLevel, setPasswordStrengthLevel] = useState<
    'weak' | 'fair' | 'good' | 'strong'
  >('weak');

  const checkIfFormIsValid = (formData: RegisterFormData) => {
    const formErrors: Partial<Record<keyof RegisterFormData, string>> = {};

    if (!formData.displayName) {
      formErrors.displayName = t('auth.displayNameRequired');
    } else if (!validateUsername(formData.displayName)) {
      formErrors.displayName = 'Display name must be 2-30 characters';
    }

    if (!formData.email) {
      formErrors.email = t('auth.emailRequired');
    } else if (!validateEmail(formData.email)) {
      formErrors.email = t('auth.invalidEmail');
    }

    if (!formData.password) {
      formErrors.password = t('auth.passwordRequired');
    } else {
      const passwordCheck = validatePassword(formData.password, t);
      if (!passwordCheck.isValid) {
        formErrors.password = passwordCheck.errors[0];
      }
      setPasswordStrengthLevel(passwordCheck.strength);
    }

    if (!formData.confirmPassword) {
      formErrors.confirmPassword = t('auth.passwordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = t('auth.passwordMismatch');
    }

    return formErrors;
  };

  const {
    values: formData,
    errors: formErrors,
    setValue: updateField,
    validate: checkForm,
    isValid: formIsReady,
  } = useForm<RegisterFormData>(
    { displayName: '', email: '', password: '', confirmPassword: '' },
    checkIfFormIsValid,
  );

  const updateFieldWithPasswordCheck = (
    field: keyof RegisterFormData,
    value: string,
  ) => {
    updateField(field, value);

    if (field === 'password' && value) {
      const passwordCheck = validatePassword(value, t);
      setPasswordStrengthLevel(passwordCheck.strength);
    }
  };

  const tryToCreateAccount = async () => {
    if (!checkForm()) return;

    try {
      const signupResult = await register(
        formData.email,
        formData.password,
        formData.displayName,
      );

      if (signupResult.success) {
        Alert.alert(
          t('common.success'),
          'Account created successfully! Please check your email to verify your account before signing in.',
          [
            {
              text: t('common.done'),
              onPress: () => {},
            },
          ],
        );
      } else {
        Alert.alert(
          t('common.error'),
          signupResult.error || 'Registration failed',
        );
      }
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || 'Registration failed');
    }
  };

  const goBackToLogin = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('common.appName')}</Text>
        <Text style={styles.headerSubtitle}>{t('auth.register')}</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.formContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.form}
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          <TextInput
            placeholder={t('auth.displayName')}
            value={formData.displayName}
            onChangeText={(text: string) =>
              updateFieldWithPasswordCheck('displayName', text)
            }
            error={formErrors.displayName}
            leftIcon="person"
            autoCapitalize="words"
            style={styles.input}
          />

          <TextInput
            placeholder={t('auth.email')}
            value={formData.email}
            onChangeText={(text: string) =>
              updateFieldWithPasswordCheck('email', text)
            }
            error={formErrors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon="mail"
            style={styles.input}
          />

          <TextInput
            placeholder={t('auth.password')}
            value={formData.password}
            onChangeText={(text: string) =>
              updateFieldWithPasswordCheck('password', text)
            }
            error={formErrors.password}
            secureTextEntry={!passwordIsVisible}
            leftIcon="lock-closed"
            rightIcon={passwordIsVisible ? 'eye-off' : 'eye'}
            onRightIconPress={() => setPasswordIsVisible(!passwordIsVisible)}
            style={styles.input}
          />

          {formData.password && (
            <View style={styles.passwordStrengthContainer}>
              <Text style={styles.passwordStrengthLabel}>
                {t('auth.passwordStrength.label', 'Password strength:')}
              </Text>
              <View style={styles.passwordStrengthBar}>
                <View
                  style={[
                    styles.passwordStrengthFill,
                    passwordStrengthLevel === 'weak' &&
                      styles.passwordStrengthWeak,
                    passwordStrengthLevel === 'fair' &&
                      styles.passwordStrengthFair,
                    passwordStrengthLevel === 'good' &&
                      styles.passwordStrengthGood,
                    passwordStrengthLevel === 'strong' &&
                      styles.passwordStrengthStrong,
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.passwordStrengthText,
                  passwordStrengthLevel === 'weak' &&
                    styles.passwordStrengthTextWeak,
                  passwordStrengthLevel === 'fair' &&
                    styles.passwordStrengthTextFair,
                  passwordStrengthLevel === 'good' &&
                    styles.passwordStrengthTextGood,
                  passwordStrengthLevel === 'strong' &&
                    styles.passwordStrengthTextStrong,
                ]}
              >
                {t(`auth.passwordStrength.${passwordStrengthLevel}`)}
              </Text>
            </View>
          )}

          <TextInput
            placeholder={t('auth.confirmPassword')}
            value={formData.confirmPassword}
            onChangeText={(text: string) =>
              updateFieldWithPasswordCheck('confirmPassword', text)
            }
            error={formErrors.confirmPassword}
            secureTextEntry={!confirmPasswordIsVisible}
            leftIcon="lock-closed"
            rightIcon={confirmPasswordIsVisible ? 'eye-off' : 'eye'}
            onRightIconPress={() =>
              setConfirmPasswordIsVisible(!confirmPasswordIsVisible)
            }
            style={styles.input}
          />

          <Button
            title={t('auth.register')}
            onPress={tryToCreateAccount}
            loading={isLoading}
            disabled={!formIsReady}
            variant="gradient"
            style={styles.registerButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>{t('auth.alreadyHaveAccount')}</Text>
            <TouchableOpacity onPress={goBackToLogin}>
              <Text style={styles.loginLink}>{t('auth.login')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
