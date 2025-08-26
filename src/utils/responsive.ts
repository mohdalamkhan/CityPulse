import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Device types
export const DEVICE_TYPES = {
  SMALL_PHONE: 'small_phone',
  MEDIUM_PHONE: 'medium_phone',
  LARGE_PHONE: 'large_phone',
  TABLET: 'tablet',
};

export const getDeviceType = (): string => {
  if (SCREEN_WIDTH < 375) return DEVICE_TYPES.SMALL_PHONE;
  if (SCREEN_WIDTH < 414) return DEVICE_TYPES.MEDIUM_PHONE;
  if (SCREEN_WIDTH < 480) return DEVICE_TYPES.LARGE_PHONE;
  return DEVICE_TYPES.TABLET;
};

// Screen dimensions
export const SCREEN_DIMENSIONS = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLargeDevice: SCREEN_WIDTH >= 414,
  isTablet: SCREEN_WIDTH > 480,
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
};

export const wp = (percentage: number): number => {
  const value = (percentage * SCREEN_WIDTH) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

export const hp = (percentage: number): number => {
  const value = (percentage * SCREEN_HEIGHT) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

export const rf = (size: number): number => {
  const baseWidth = 375;
  const scale = SCREEN_WIDTH / baseWidth;
  const newSize = size * scale;

  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

// Responsive spacing
export const RESPONSIVE_SPACING = {
  xs: wp(1),
  sm: wp(2),
  md: wp(4),
  lg: wp(6),
  xl: wp(8),
  xxl: wp(10),
};

// Device-specific spacing
export const getSpacing = (baseSpacing: number): number => {
  const deviceType = getDeviceType();

  switch (deviceType) {
    case DEVICE_TYPES.SMALL_PHONE:
      return baseSpacing * 0.8;
    case DEVICE_TYPES.MEDIUM_PHONE:
      return baseSpacing;
    case DEVICE_TYPES.LARGE_PHONE:
      return baseSpacing * 1.1;
    case DEVICE_TYPES.TABLET:
      return baseSpacing * 1.3;
    default:
      return baseSpacing;
  }
};

// Responsive image dimensions
export const getImageDimensions = (aspectRatio: number = 16 / 9) => {
  const imageWidth = wp(90);
  const imageHeight = imageWidth / aspectRatio;

  return {
    width: imageWidth,
    height: Math.min(imageHeight, hp(30)),
  };
};

export const getSafeMargins = () => {
  const deviceType = getDeviceType();
  const baseMargin = wp(4);

  switch (deviceType) {
    case DEVICE_TYPES.SMALL_PHONE:
      return {
        horizontal: baseMargin * 0.8,
        vertical: hp(1),
      };
    case DEVICE_TYPES.MEDIUM_PHONE:
      return {
        horizontal: baseMargin,
        vertical: hp(1.5),
      };
    case DEVICE_TYPES.LARGE_PHONE:
      return {
        horizontal: baseMargin * 1.2,
        vertical: hp(2),
      };
    case DEVICE_TYPES.TABLET:
      return {
        horizontal: baseMargin * 2,
        vertical: hp(3),
      };
    default:
      return {
        horizontal: baseMargin,
        vertical: hp(1.5),
      };
  }
};

// Button dimensions
export const getButtonDimensions = () => {
  return {
    height: hp(6),
    minHeight: 44,
    borderRadius: wp(3),
    paddingHorizontal: wp(6),
  };
};

// Card dimensions
export const getCardDimensions = () => {
  const deviceType = getDeviceType();
  const margins = getSafeMargins();

  return {
    width: SCREEN_WIDTH - margins.horizontal * 2,
    borderRadius: wp(5),
    padding: wp(4),
    marginBottom: wp(3),
  };
};

// Header dimensions
export const getHeaderDimensions = () => {
  return {
    height: hp(12),
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  };
};

export default {
  wp,
  hp,
  rf,
  SCREEN_DIMENSIONS,
  RESPONSIVE_SPACING,
  getDeviceType,
  getSpacing,
  getImageDimensions,
  getSafeMargins,
  getButtonDimensions,
  getCardDimensions,
  getHeaderDimensions,
};
