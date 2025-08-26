import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
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

import { useAuth, useForm } from '@hooks';
import { biometricAuthService } from '@services/biometric';
import { validateEmail } from '@utils';

import Button from '@components/Button';
import TextInput from '@components/TextInput';

import { styles } from './styles';
import { LoginFormData, LoginScreenProps } from './types';

const LoginScreen: React.FC<LoginScreenProps> = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { login, isLoading, sendPasswordResetEmail } = useAuth();
  const [canUseBiometrics, setCanUseBiometrics] = useState(false);
  const [biometricMethod, setBiometricMethod] = useState<string | null>(null);

  const [passwordIsVisible, setPasswordIsVisible] = useState(false);

  const checkIfFormIsValid = (formData: LoginFormData) => {
    const formErrors: Partial<Record<keyof LoginFormData, string>> = {};

    if (!formData.email) {
      formErrors.email = t('auth.emailRequired');
    } else if (!validateEmail(formData.email)) {
      formErrors.email = t('auth.invalidEmail');
    }

    if (!formData.password) {
      formErrors.password = t('auth.passwordRequired');
    }

    return formErrors;
  };

  const {
    values: formData,
    errors: formErrors,
    setValue: updateField,
    validate: checkForm,
    isValid: formIsReady,
  } = useForm<LoginFormData>({ email: '', password: '' }, checkIfFormIsValid);

  const signIn = async () => {
    if (!checkForm()) return;

    try {
      const loginResult = await login(formData.email, formData.password);
      if (loginResult.success) {
      } else {
        Alert.alert(
          t('common.error'),
          loginResult.error || t('auth.invalidCredentials'),
        );
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('auth.invalidCredentials'));
    }
  };

  const sendResetPasswordEmail = async () => {
    if (!formData.email) {
      Alert.alert(t('common.error'), 'Please enter your email address first');
      return;
    }

    const emailResult = await sendPasswordResetEmail(formData.email);

    if (emailResult.success) {
      Alert.alert(
        t('common.success'),
        'Password reset email sent. Please check your inbox.',
        [{ text: t('common.ok') }],
      );
    } else {
      Alert.alert(
        t('common.error'),
        emailResult.error || 'Failed to send password reset email',
      );
    }
  };

  const goToSignUpPage = () => {
    navigation.navigate('Register' as never);
  };

  useEffect(() => {
    const checkIfBiometricsWork = async () => {
      try {
        const biometricInfo = await biometricAuthService.isBiometricAvailable();
        setCanUseBiometrics(biometricInfo.available);
        setBiometricMethod(biometricInfo.biometryType);

        // Log for debugging (remove in production)
        if (__DEV__) {
          console.log('Biometric availability:', biometricInfo);
        }
      } catch (error) {
        console.warn('Error checking biometric availability:', error);
        setCanUseBiometrics(false);
        setBiometricMethod(null);
      }
    };

    checkIfBiometricsWork();
  }, []);

  const biometricSignIn = async () => {
    try {
      // Double-check availability before attempting authentication
      const availability = await biometricAuthService.isBiometricAvailable();
      
      if (!availability.available) {
        Alert.alert(
          t('common.error'),
          availability.error || t('auth.biometric.notAvailable'),
          [{ text: t('common.done') }],
        );
        return;
      }

      const biometricResult =
        await biometricAuthService.authenticateWithBiometrics(
          t('auth.biometric.loginPrompt'),
        );

      if (biometricResult.success) {
        // In a real app, you would validate the biometric authentication
        // and then proceed with actual login
        Alert.alert(
          t('common.success'),
          `${biometricResult.biometryType} authentication successful! (Demo mode - would login user)`,
          [{ text: t('common.done') }],
        );
        
        // TODO: Implement actual biometric login here
        // For real implementation, save user credentials after first login
        // and use biometric authentication to retrieve them
        
      } else {
        // Handle different error cases
        const errorMessage = biometricResult.error?.includes('cancelled') 
          ? t('auth.biometric.cancelled', 'Authentication was cancelled')
          : biometricResult.error || t('auth.biometric.failed');
          
        Alert.alert(
          t('common.error'),
          errorMessage,
          [{ text: t('common.done') }],
        );
      }
    } catch (error: any) {
      console.warn('Biometric authentication error:', error);
      Alert.alert(
        t('common.error'), 
        `Biometric authentication failed: ${error.message || 'Unknown error'}`,
        [{ text: t('common.done') }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('common.appName')}</Text>
        <Text style={styles.headerSubtitle}>{t('auth.login')}</Text>
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
            placeholder={t('auth.email')}
            value={formData.email}
            onChangeText={(text: string) => updateField('email', text)}
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
            onChangeText={(text: string) => updateField('password', text)}
            error={formErrors.password}
            secureTextEntry={!passwordIsVisible}
            leftIcon="lock-closed"
            rightIcon={passwordIsVisible ? 'eye-off' : 'eye'}
            onRightIconPress={() => setPasswordIsVisible(!passwordIsVisible)}
            style={styles.input}
          />

          <Button
            title={t('auth.login')}
            onPress={signIn}
            loading={isLoading}
            disabled={!formIsReady}
            style={styles.loginButton}
          />

          {canUseBiometrics && (
            <TouchableOpacity
              style={styles.biometricButton}
              onPress={biometricSignIn}
            >
              <Text style={styles.biometricIcon}>
                {biometricMethod === 'Face ID' ? '👤' : '👆'}
              </Text>
              <Text style={styles.biometricText}>
                {t('auth.biometric.title')}{' '}
                {biometricMethod ? `(${biometricMethod})` : ''}
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>{t('auth.dontHaveAccount')}</Text>
            <TouchableOpacity onPress={goToSignUpPage}>
              <Text style={styles.registerLink}>{t('auth.register')}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={sendResetPasswordEmail}
          >
            <Text style={styles.forgotPasswordText}>
              {t('auth.forgotPassword')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
