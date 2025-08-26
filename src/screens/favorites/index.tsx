import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
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
import { useToast } from '../../context/ToastContext';
import { ticketmasterService } from '../../services/ticketmaster';
import { useFavoritesRedux } from '../../store/hooks';
import { FavoriteEvent } from '../../types';

import { styles } from './styles';
import { FavoritesScreenProps } from './types';

const FavoritesScreen: React.FC<FavoritesScreenProps> = () => {
  const navigation = useNavigation();
  const { showToast } = useToast();

  const {
    favorites,
    isLoading,
    error,
    removeFavorite,
    clearFavorites,
    loadFavorites,
  } = useFavoritesRedux();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const handleRemoveAllFavorites = () => {
    Alert.alert(
      'Remove All Favorites',
      'Are you sure you want to remove all favorite events?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove All',
          style: 'destructive',
          onPress: async () => {
            const success = await clearFavorites();
            if (success) {
              showToast('Events removed from Favourite successfully', 'error');
            } else {
              showToast('Failed to clear favorites', 'error');
            }
          },
        },
      ],
    );
  };

  const handleRemoveFavorite = (favoriteEvent: FavoriteEvent) => {
    Alert.alert(
      'Remove Favorite',
      `Remove "${favoriteEvent.eventData.name}" from favorites?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const success = await removeFavorite(favoriteEvent.eventId);
            if (success) {
            }
          },
        },
      ],
    );
  };

  const navigateToEventDetails = (favoriteEvent: FavoriteEvent) => {
    navigation.navigate('EventDetails', {
      eventId: favoriteEvent.eventId,
      event: favoriteEvent.eventData,
    });
  };

  const renderFavoriteItem = ({ item }: { item: FavoriteEvent }) => {
    const imageUrl = ticketmasterService.getEventImageUrl(
      item.eventData,
      'medium',
    );
    const venue = ticketmasterService.getEventVenue(item.eventData);
    const { date, time } = ticketmasterService.formatEventDateTime(
      item.eventData,
    );
    const priceRange = ticketmasterService.getEventPriceRange(item.eventData);

    return (
      <TouchableOpacity
        style={styles.favoriteCard}
        onPress={() => navigateToEventDetails(item)}
        activeOpacity={0.9}
      >
        <Image source={{ uri: imageUrl }} style={styles.eventImage} />
        <View style={styles.eventInfo}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle} numberOfLines={2}>
              {item.eventData.name || 'Event Name'}
            </Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveFavorite(item)}
            >
              <Icon name="heart" size={24} color={COLORS.error} />
            </TouchableOpacity>
          </View>

          <View style={styles.eventDetails}>
            <View style={styles.detailRow}>
              <Icon
                name="calendar-outline"
                size={16}
                color={COLORS.textSecondary}
              />
              <Text style={styles.detailText}>{date || 'TBA'}</Text>
            </View>

            <View style={styles.detailRow}>
              <Icon
                name="time-outline"
                size={16}
                color={COLORS.textSecondary}
              />
              <Text style={styles.detailText}>{time || 'TBA'}</Text>
            </View>

            {venue && (
              <View style={styles.detailRow}>
                <Icon
                  name="location-outline"
                  size={16}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.detailText}>
                  {venue.name || 'Venue TBA'}
                </Text>
              </View>
            )}

            {priceRange && (
              <View style={styles.detailRow}>
                <Icon
                  name="pricetag-outline"
                  size={16}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.detailText}>
                  {priceRange.min && priceRange.max
                    ? `$${priceRange.min} - $${priceRange.max}`
                    : 'Price TBA'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Favorites</Text>
        {favorites.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleRemoveAllFavorites}
          >
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {favorites.length === 0 && !isLoading ? (
        <View style={styles.emptyState}>
          <Icon name="heart-outline" size={80} color={COLORS.gray300} />
          <Text style={styles.emptyTitle}>No favorite events yet</Text>
          <Text style={styles.emptySubtitle}>
            Events you favorite will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={item => item.eventId}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default FavoritesScreen;
