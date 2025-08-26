import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants';
import {
  wp,
  hp,
  rf,
  getSafeMargins,
  getCardDimensions,
  getButtonDimensions,
  getImageDimensions,
  getHeaderDimensions,
} from '../../utils';

const margins = getSafeMargins();
const cardDimensions = getCardDimensions();
const buttonDimensions = getButtonDimensions();
const headerDimensions = getHeaderDimensions();

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  categoriesSection: {
    paddingHorizontal: margins.horizontal,
    paddingTop: wp(4),
    paddingBottom: wp(4),
  },

  header: {
    paddingHorizontal: margins.horizontal,
    paddingVertical: margins.vertical,
    backgroundColor: COLORS.primary,
    minHeight: headerDimensions.height,
  },
  headerTitle: {
    fontSize: rf(24),
    color: COLORS.white,
    fontWeight: '700',
    marginBottom: wp(2),
  },
  headerSubtitle: {
    fontSize: rf(16),
    color: 'rgba(255, 255, 255, 0.8)',
  },

  searchSection: {
    paddingHorizontal: margins.horizontal,
    paddingVertical: wp(6),
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    marginBottom: wp(2),
  },
  cityInput: {
    marginBottom: wp(4),
  },
  searchButton: {
    marginBottom: wp(2),
    height: buttonDimensions.height,
    borderRadius: buttonDimensions.borderRadius,
  },
  clearButton: {
    alignSelf: 'flex-start',
  },

  eventsList: {
    paddingHorizontal: margins.horizontal,
    paddingBottom: wp(8),
    paddingTop: wp(4),
  },
  separator: {
    height: wp(4),
  },

  eventCard: {
    backgroundColor: COLORS.white,
    borderRadius: cardDimensions.borderRadius,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
    position: 'relative',
    marginHorizontal: wp(1),
    width: cardDimensions.width,
    alignSelf: 'center',
  },
  cardTouchable: {
    width: '100%',
    flex: 1,
  },
  eventImage: {
    width: '100%',
    height: getImageDimensions(16 / 9).height,
    resizeMode: 'cover',
    backgroundColor: COLORS.gray100,
  },
  favoriteButton: {
    position: 'absolute',
    top: wp(4),
    right: wp(4),
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  eventInfo: {
    padding: wp(4),
    paddingTop: wp(3),
    paddingBottom: wp(4),
  },
  eventTitle: {
    fontSize: rf(18),
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: wp(2),
    lineHeight: rf(22),
  },
  eventDetails: {
    gap: wp(2),
    marginTop: wp(1),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp(1),
  },
  detailText: {
    fontSize: rf(14),
    color: COLORS.textSecondary,
    marginLeft: wp(2),
    flex: 1,
    lineHeight: rf(18),
  },

  emptyState: {
    alignItems: 'center',
    paddingHorizontal: margins.horizontal,
    paddingVertical: hp(10),
  },
  emptyTitle: {
    fontSize: rf(20),
    color: COLORS.textSecondary,
    marginTop: wp(4),
    marginBottom: wp(2),
    textAlign: 'center',
    fontWeight: '600',
  },
  emptySubtitle: {
    fontSize: rf(14),
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: rf(20),
  },
});
