import { StyleSheet, I18nManager } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';
import { getButtonDimensions, rf, wp } from '../../utils';

const buttonDimensions = getButtonDimensions();

export const styles = StyleSheet.create({
  wrapper: {
    marginBottom: wp(2),
  },
  label: {
    fontSize: rf(14),
    color: COLORS.textPrimary,
    marginBottom: wp(1),
    fontWeight: '500',
    textAlign: 'left',
  },
  labelRTL: {
    textAlign: 'right',
  },
  container: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    borderRadius: buttonDimensions.borderRadius,
    paddingHorizontal: wp(4),
    minHeight: buttonDimensions.height,
  },
  defaultContainer: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: wp(3),
  },
  filledContainer: {
    backgroundColor: COLORS.gray100,
    paddingVertical: SPACING.md,
  },
  outlinedContainer: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
  },
  errorContainer: {
    borderColor: COLORS.error,
  },
  smallContainer: {
    paddingVertical: SPACING.sm,
    minHeight: 40,
  },
  largeContainer: {
    paddingVertical: SPACING.lg,
    minHeight: 60,
  },
  input: {
    flex: 1,
    fontSize: rf(16),
    color: COLORS.textPrimary,
    padding: 0,
    fontWeight: '500',
    textAlign: 'left',
  },
  inputRTL: {
    textAlign: 'right',
  },
  smallInput: {
    ...TYPOGRAPHY.body2,
  },
  largeInput: {
    ...TYPOGRAPHY.h4,
  },
  leftIconContainer: {
    marginRight: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconContainer: {
    marginLeft: wp(2),
    padding: wp(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
    textAlign: 'left',
  },
  errorTextRTL: {
    textAlign: 'right',
    marginRight: SPACING.xs,
    marginLeft: 0,
  },
  iconText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
