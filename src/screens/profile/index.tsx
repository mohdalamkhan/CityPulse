import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import Button from '../../components/Button';
import { COLORS } from '../../constants';
import { useAuth, useLanguage } from '../../hooks';
import { biometricAuthService } from '../../services/biometric';

import { styles } from './styles';
import { ProfileScreenProps, SettingItem, SettingSection } from './types';

const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { language, setLanguage, isRTL } = useLanguage();

  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(t('auth.logout'), 'Are you sure you want to logout?', [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('auth.logout'),
        style: 'destructive',
        onPress: async () => {
          const success = await logout();
          if (!success) {
            Alert.alert(t('common.error'), 'Failed to logout');
          }
        },
      },
    ]);
  };

  const handleLanguageToggle = () => {
    Alert.alert(t('profile.language'), t('language.select'), [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('language.english'),
        onPress: () => {
          setLanguage('en');
          Alert.alert(t('common.success'), t('language.changed'), [
            {
              text: t('common.done'),
              onPress: () => {},
            },
          ]);
        },
      },
      {
        text: t('language.arabic'),
        onPress: () => {
          setLanguage('ar');
          Alert.alert(t('common.success'), t('language.changed'), [
            {
              text: t('common.done'),
              onPress: () => {},
            },
          ]);
        },
      },
    ]);
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (value) {
      try {
        const availability = await biometricAuthService.isBiometricAvailable();

        if (!availability.available) {
          Alert.alert(
            t('common.error'),
            availability.error ||
              'Biometric authentication not available on this device',
            [{ text: t('common.done') }],
          );
          return;
        }

        const result = await biometricAuthService.authenticateWithBiometrics(
          t('auth.biometric.enablePrompt'),
        );

        if (result.success) {
          setBiometricEnabled(true);
          Alert.alert(t('common.success'), t('auth.biometric.enabled'), [
            { text: t('common.done') },
          ]);
        } else {
          Alert.alert(
            t('common.error'),
            result.error || t('auth.biometric.failed'),
            [{ text: t('common.done') }],
          );
        }
      } catch (error) {
        Alert.alert(
          t('common.error'),
          'Failed to enable biometric authentication',
          [{ text: t('common.done') }],
        );
      }
    } else {
      Alert.alert(t('profile.biometric'), t('auth.biometric.disableConfirm'), [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.confirm'),
          onPress: () => {
            setBiometricEnabled(false);
            Alert.alert(t('common.success'), t('auth.biometric.disabled'), [
              { text: t('common.done') },
            ]);
          },
        },
      ]);
    }
  };

  const settingSections: SettingSection[] = [
    {
      title: t('profile.preferences'),
      items: [
        {
          id: 'language',
          icon: 'language-outline',
          title: t('profile.language'),
          subtitle:
            language === 'en' ? t('language.english') : t('language.arabic'),
          type: 'navigation',
          onPress: handleLanguageToggle,
        },
        {
          id: 'biometric',
          icon: 'finger-print-outline',
          title: t('profile.biometric'),
          type: 'switch',
          value: biometricEnabled,
          onToggle: handleBiometricToggle,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingItem}
        onPress={item.onPress}
        disabled={item.type === 'switch'}
        activeOpacity={item.type === 'navigation' ? 0.7 : 1}
      >
        <View style={styles.settingItemLeft}>
          <Icon name={item.icon} size={24} color={COLORS.primary} />
          <View style={styles.settingItemText}>
            <Text style={styles.settingItemTitle}>{item.title}</Text>
            {item.subtitle && (
              <Text style={styles.settingItemSubtitle}>{item.subtitle}</Text>
            )}
          </View>
        </View>

        <View style={styles.settingItemRight}>
          {item.type === 'switch' ? (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          ) : (
            <Icon
              name={isRTL ? 'chevron-back-outline' : 'chevron-forward-outline'}
              size={20}
              color={COLORS.gray400}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = (section: SettingSection) => (
    <View key={section.title} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionContent}>
        {section.items.map(renderSettingItem)}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('profile.title')}</Text>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Icon name="person-circle" size={80} color={COLORS.white} />
          </View>
          <Text style={styles.userName}>
            {user?.displayName || 'User Name'}
          </Text>
          <Text style={styles.userEmail}>
            {user?.email || 'user@example.com'}
          </Text>
        </View>

        {settingSections.map(renderSection)}

        <View style={styles.logoutSection}>
          <Button
            title={t('auth.logout')}
            onPress={handleLogout}
            variant="primary"
            icon="log-out-outline"
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
