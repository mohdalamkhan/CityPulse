import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import Toast from 'react-native-toast-message';
import { COLORS } from '../../constants';
import { useEventDetails } from '../../hooks';
import { ticketmasterService } from '../../services/ticketmaster';
import { useFavoritesRedux } from '../../store/hooks';
import { RootStackParamList } from '../../types';
import { addProtocol, removeHtmlTags } from '../../utils';
import Button from '../../components/Button';

import { styles } from './styles';
import { EventDetailsScreenProps } from './types';

type EventDetailsRouteProp = RouteProp<RootStackParamList, 'EventDetails'>;

const EventDetailsScreen: React.FC<EventDetailsScreenProps> = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<EventDetailsRouteProp>();
  const { eventId, event: initialEvent } = route.params;

  const { event, isLoading, error, reload } = useEventDetails(eventId);
  const { isFavorite, toggleFavorite } = useFavoritesRedux();

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [mapError, setMapError] = useState(false);

  const currentEvent = event || initialEvent;

  useEffect(() => {
    if (!initialEvent && !event && !isLoading && !error) {
      reload();
    }
  }, [initialEvent, event, isLoading, error, reload]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleFavoriteToggle = async () => {
    if (currentEvent) {
      const success = await toggleFavorite(currentEvent);
    }
  };

  const handleGetTickets = async () => {
    if (!currentEvent?.url) {
      Alert.alert(t('common.error'), t('common.notAvailable'));
      return;
    }

    try {
      await Linking.openURL(addProtocol(currentEvent.url));
    } catch (error) {
      Alert.alert(t('common.error'), 'Unable to open ticket link');
    }
  };

  const handleGetDirections = () => {
    const venue = ticketmasterService.getEventVenue(currentEvent!);
    if (!venue?.location) {
      Alert.alert(t('common.error'), t('events.map.mapNotAvailable'));
      return;
    }

    const { latitude, longitude } = venue.location;
    const url = `https://maps.apple.com/?daddr=${latitude},${longitude}`;

    Linking.openURL(url).catch(() => {
      Alert.alert(t('common.error'), 'Unable to open maps');
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !currentEvent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Event not found'}</Text>
          <Button title="Retry" onPress={reload} />
        </View>
      </SafeAreaView>
    );
  }

  const imageUrl = ticketmasterService.getEventImageUrl(currentEvent, 'large');
  const venue = ticketmasterService.getEventVenue(currentEvent);
  const { date, time } = ticketmasterService.formatEventDateTime(currentEvent);
  const priceRange = ticketmasterService.getEventPriceRange(currentEvent);
  const status = currentEvent.dates?.status?.code || 'onsale';
  const isFav = isFavorite(currentEvent.id);

  let description = '';
  if (currentEvent.info) {
    description = currentEvent.info;
  } else if (currentEvent.pleaseNote) {
    description = currentEvent.pleaseNote;
  } else {
    description = 'No additional information available for this event.';
  }

  const cleanDescription = removeHtmlTags(description);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.headerImage} />
          <View style={styles.imageOverlay} />

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoriteToggle}
            activeOpacity={0.7}
          >
            <Icon
              name={isFav ? 'heart' : 'heart-outline'}
              size={24}
              color={isFav ? COLORS.error : COLORS.white}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{currentEvent.name}</Text>
            <View style={styles.statusContainer}>
              <Text style={styles.status}>{status}</Text>
            </View>
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Icon name="calendar-outline" size={20} color={COLORS.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>{t('events.date')}</Text>
                <Text style={styles.detailValue}>{date}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Icon name="time-outline" size={20} color={COLORS.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>{t('events.time')}</Text>
                <Text style={styles.detailValue}>{time}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Icon name="pricetag-outline" size={20} color={COLORS.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>{t('events.price')}</Text>
                <Text style={styles.detailValue}>
                  ${priceRange.min} - ${priceRange.max}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Icon name="grid-outline" size={20} color={COLORS.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>{t('events.category')}</Text>
                <Text style={styles.detailValue}>
                  {ticketmasterService.getEventClassification(currentEvent)
                    ?.segment?.name || 'General'}
                </Text>
              </View>
            </View>
          </View>

          {cleanDescription && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>{t('events.description')}</Text>
              <Text
                style={styles.description}
                numberOfLines={showFullDescription ? undefined : 3}
              >
                {cleanDescription}
              </Text>
              {cleanDescription.length > 150 && (
                <TouchableOpacity
                  onPress={() => setShowFullDescription(!showFullDescription)}
                >
                  <Text style={styles.readMoreText}>
                    {showFullDescription
                      ? t('common.readLess')
                      : t('common.readMore')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {venue && venue.location && (
            <View style={styles.mapSection}>
              <Text style={styles.sectionTitle}>{t('events.venue.title')}</Text>
              <View style={styles.mapContainer}>
                <View style={styles.mapPlaceholder}>
                  <Icon
                    name="location-outline"
                    size={32}
                    color={COLORS.primary}
                  />
                  <Text style={styles.venueName}>{venue.name}</Text>
                  <Text style={styles.venueAddress}>
                    {venue.address?.line1}
                    {venue.city?.name &&
                      `, ${venue.city.name}, ${venue.state?.name}`}
                  </Text>
                  {venue.location && (
                    <TouchableOpacity
                      style={styles.directionsButton}
                      onPress={handleGetDirections}
                    >
                      <Icon
                        name="navigate-outline"
                        size={16}
                        color={COLORS.white}
                      />
                      <Text style={styles.directionsText}>
                        {t('events.map.getDirections')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          )}

          <View style={styles.actionSection}>
            <Button
              title={t('events.tickets')}
              onPress={handleGetTickets}
              icon="ticket-outline"
              variant="gradient"
              size="large"
              style={styles.ticketButton}
            />
          </View>
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

export default EventDetailsScreen;
