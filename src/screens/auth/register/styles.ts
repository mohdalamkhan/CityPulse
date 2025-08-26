import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },

  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.white,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body1,
    color: 'rgba(255, 255, 255, 0.8)',
  },

  formContainer: {
    flex: 1,
  },
  form: {
    flex: 1,
  },
  formContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  input: {
    marginBottom: SPACING.md,
  },
  passwordStrengthContainer: {
    marginTop: -SPACING.xs,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  passwordStrengthLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  passwordStrengthBar: {
    height: 4,
    backgroundColor: COLORS.gray200,
    borderRadius: 2,
    marginBottom: SPACING.xs,
    overflow: 'hidden',
  },
  passwordStrengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  passwordStrengthWeak: {
    width: '25%',
    backgroundColor: COLORS.error,
  },
  passwordStrengthFair: {
    width: '50%',
    backgroundColor: COLORS.warning,
  },
  passwordStrengthGood: {
    width: '75%',
    backgroundColor: '#3B82F6', // Blue
  },
  passwordStrengthStrong: {
    width: '100%',
    backgroundColor: COLORS.success,
  },
  passwordStrengthText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '500',
    textAlign: 'right',
  },
  passwordStrengthTextWeak: {
    color: COLORS.error,
  },
  passwordStrengthTextFair: {
    color: COLORS.warning,
  },
  passwordStrengthTextGood: {
    color: '#3B82F6',
  },
  passwordStrengthTextStrong: {
    color: COLORS.success,
  },

  registerButton: {
    marginBottom: SPACING.lg,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  loginText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
  },
  loginLink: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
});
