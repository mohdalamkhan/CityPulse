import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants';
import { getButtonDimensions, hp, rf, wp } from '../../utils';

const buttonDimensions = getButtonDimensions();

export const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: buttonDimensions.borderRadius,
    minWidth: wp(20),
  },

  smallButton: {
    paddingHorizontal: wp(3),
    paddingVertical: wp(2),
    minHeight: hp(4.5),
  },
  mediumButton: {
    paddingHorizontal: wp(6),
    paddingVertical: wp(3),
    minHeight: buttonDimensions.height,
  },
  largeButton: {
    paddingHorizontal: wp(8),
    paddingVertical: wp(4),
    minHeight: hp(7),
  },

  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },

  disabledButton: {
    backgroundColor: COLORS.gray300,
    borderColor: COLORS.gray300,
  },

  text: {
    textAlign: 'center',
    fontWeight: '600',
  },
  smallText: {
    fontSize: rf(12),
    fontWeight: '600',
  },
  mediumText: {
    fontSize: rf(16),
    fontWeight: '600',
  },
  largeText: {
    fontSize: rf(18),
    fontWeight: '600',
  },

  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.white,
  },
  outlineText: {
    color: COLORS.primary,
  },
  ghostText: {
    color: COLORS.primary,
  },
  disabledText: {
    color: COLORS.gray500,
  },

  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  leftIcon: {
    marginRight: wp(2),
  },
  rightIcon: {
    marginLeft: wp(2),
  },

  loading: {
    marginRight: wp(2),
  },
});
