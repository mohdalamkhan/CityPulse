import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import { COLORS } from '../../constants';
import { useEventSearch } from '../../hooks';
import { ticketmasterService } from '../../services/ticketmaster';
import { useFavoritesRedux } from '../../store/hooks';
import { TicketmasterEvent } from '../../types';

import Button from '../../components/Button';
import TextInput from '../../components/TextInput';

import { styles } from './styles';
import { HomeScreenProps } from './types';

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const {
    events,
    searchQuery,
    setSearchQuery,
    city = 'New York',
    setCity,
    isLoading,
    error,
    searchEvents,
    loadMore,
  } = useEventSearch();
  const { toggleFavorite, favorites } = useFavoritesRedux();

  const isFavorite = (eventId: string) => {
    return favorites.some(fav => fav.eventId === eventId);
  };

  const [popularEvents, setPopularEvents] = useState<TicketmasterEvent[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPopularEvents();
  }, []);

  const loadPopularEvents = async () => {
    try {
      const response = await ticketmasterService.getPopularEvents(city);
      if (response.success && response.data) {
        setPopularEvents(response.data.slice(0, 10));
      }
    } catch (error) {}
  };

  const handleSearch = () => {
    if (searchQuery.trim() || city.trim()) {
      searchEvents();
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (searchQuery || city) {
      await searchEvents();
    } else {
      await loadPopularEvents();
    }
    setRefreshing(false);
  };

  const navigateToEventDetails = (event: TicketmasterEvent) => {
    (navigation as any).navigate('EventDetails', {
      eventId: event.id,
      event,
    });
  };

  const handleFavoriteToggle = async (event: TicketmasterEvent) => {
    const result = await toggleFavorite(event);
  };

  const renderEventCard = ({ item }: { item: TicketmasterEvent }) => {
    const imageUrl = ticketmasterService.getEventImageUrl(item, 'medium');
    const venue = ticketmasterService.getEventVenue(item);
    const { date, time } = ticketmasterService.formatEventDateTime(item);
    const priceRange = ticketmasterService.getEventPriceRange(item);
    const isFav = isFavorite(item.id);

    return (
      <View style={styles.eventCard}>
        <TouchableOpacity
          style={styles.cardTouchable}
          onPress={() => navigateToEventDetails(item)}
          activeOpacity={0.9}
        >
          <Image source={{ uri: imageUrl }} style={styles.eventImage} />
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle} numberOfLines={2}>
              {item.name}
            </Text>
            <View style={styles.eventDetails}>
              <View style={styles.detailRow}>
                <Icon
                  name="calendar-outline"
                  size={16}
                  color={COLORS.primary}
                />
                <Text style={styles.detailText}>{date}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="time-outline" size={16} color={COLORS.primary} />
                <Text style={styles.detailText}>{time}</Text>
              </View>
              {venue && (
                <View style={styles.detailRow}>
                  <Icon
                    name="location-outline"
                    size={16}
                    color={COLORS.primary}
                  />
                  <Text style={styles.detailText} numberOfLines={1}>
                    {venue.name}
                  </Text>
                </View>
              )}
              <View style={styles.detailRow}>
                <Icon
                  name="pricetag-outline"
                  size={16}
                  color={COLORS.primary}
                />
                <Text style={styles.detailText}>
                  {priceRange?.formatted || 'Price TBA'}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => handleFavoriteToggle(item)}
          activeOpacity={0.7}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Icon
            name={isFav ? 'heart' : 'heart-outline'}
            size={20}
            color={isFav ? COLORS.error : COLORS.white}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const displayEvents = events.length > 0 ? events : popularEvents;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('home.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('home.subtitle')}</Text>
        </View>

        <View style={styles.searchSection}>
          <TextInput
            placeholder={t('home.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon="search-outline"
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            style={styles.searchInput}
          />
          <TextInput
            placeholder={t('home.cityPlaceholder')}
            value={city}
            onChangeText={setCity}
            leftIcon="location-outline"
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            style={styles.cityInput}
          />
          <Button
            title={t('common.search')}
            onPress={handleSearch}
            icon="search"
            loading={isLoading}
            style={styles.searchButton}
          />
        </View>

        <View style={styles.categoriesSection}>
          {displayEvents.length > 0 ? (
            <FlatList
              data={displayEvents}
              renderItem={renderEventCard}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              numColumns={1}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.eventsList}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              onEndReached={loadMore}
              onEndReachedThreshold={0.7}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }
            />
          ) : !isLoading && !error ? (
            <View style={styles.emptyState}>
              <Icon name="calendar-outline" size={64} color={COLORS.gray300} />
              <Text style={styles.emptyTitle}>{t('home.noEventsFound')}</Text>
              <Text style={styles.emptySubtitle}>{t('home.searchHint')}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
