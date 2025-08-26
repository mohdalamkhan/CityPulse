import { useCallback, useEffect } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { useToast } from '@context/ToastContext';
import { FavoriteEvent, TicketmasterEvent } from '@types';
import type { AppDispatch, RootState } from './index';
import {
  selectFavoritesCount,
  selectFavoritesError,
  selectFavoritesIsHydrated,
  selectFavoritesLoading,
  selectFavoritesOrderedByDate,
  selectHasFavorites,
  selectIsFavorite,
} from './selectors/favoritesSelectors';
import {
  addFavoriteOptimistic,
  clearAllFavoritesFromStorage,
  clearFavoritesOptimistic,
  loadFavoritesFromStorage,
  removeFavoriteFromStorage,
  removeFavoriteOptimistic,
  saveFavoriteToStorage,
  syncWithFirebase,
} from './slices/favoritesSlice';

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hook for favorites operations
export const useFavoritesRedux = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  // Selectors
  const favorites = useAppSelector(selectFavoritesOrderedByDate);
  const isLoading = useAppSelector(selectFavoritesLoading);
  const error = useAppSelector(selectFavoritesError);
  const favoritesCount = useAppSelector(selectFavoritesCount);
  const hasFavorites = useAppSelector(selectHasFavorites);
  const isHydrated = useAppSelector(selectFavoritesIsHydrated);

  // Initialize favorites from storage on first load
  useEffect(() => {
    if (!isHydrated) {
      dispatch(loadFavoritesFromStorage());
    }
  }, [dispatch, isHydrated]);

  // Check if event is favorite (returns a function that can be called with eventId)
  const isFavorite = useCallback(
    (eventId: string) => {
      return favorites.some(item => item.eventId === eventId);
    },
    [favorites],
  );

  // Add favorite with optimistic updates
  const addFavorite = useCallback(
    async (event: TicketmasterEvent) => {
      const favoriteEvent: FavoriteEvent = {
        eventId: event.id,
        eventData: event,
        addedAt: new Date().toISOString(),
      };

      try {
        dispatch(addFavoriteOptimistic(favoriteEvent));

        await dispatch(saveFavoriteToStorage(favoriteEvent));

        showToast('Event added to Favourite successfully', 'success');
        return true;
      } catch (error) {
        showToast('Failed to add event to favourites', 'error');
        return false;
      }
    },
    [dispatch, showToast],
  );

  const removeFavorite = useCallback(
    async (eventId: string) => {
      try {
        dispatch(removeFavoriteOptimistic(eventId));

        // Async remove from storage
        await dispatch(removeFavoriteFromStorage(eventId));
        showToast('Event removed from Favourite successfully', 'error'); // 🔴 RED TOAST
        return true;
      } catch (error) {
        showToast('Failed to remove event from favourites', 'error');
        return false;
      }
    },
    [dispatch, showToast],
  );

  // Toggle favorite
  const toggleFavorite = useCallback(
    async (event: TicketmasterEvent) => {
      const isCurrentlyFavorite = favorites.some(
        fav => fav.eventId === event.id,
      );

      if (isCurrentlyFavorite) {
        return await removeFavorite(event.id);
      } else {
        return await addFavorite(event);
      }
    },
    [favorites, addFavorite, removeFavorite],
  );

  const clearFavorites = useCallback(async () => {
    try {
      dispatch(clearFavoritesOptimistic());

      await dispatch(clearAllFavoritesFromStorage());
      return true;
    } catch (error) {
      console.error('❌ Failed to clear favorites:', error);
      return false;
    }
  }, [dispatch]);

  // Force reload from storage
  const loadFavorites = useCallback(async () => {
    dispatch(loadFavoritesFromStorage());
  }, [dispatch]);

  // Sync with Firebase (when user logs in)
  const syncToFirebase = useCallback(
    async (userId: string) => {
      try {
        await dispatch(syncWithFirebase(userId));
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch],
  );

  // Debug function to completely reset
  const resetFavoritesCompletely = useCallback(async () => {
    try {
      await clearFavorites();
      await loadFavorites();
      return true;
    } catch (error) {
      console.error('Failed to reset favorites:', error);
      return false;
    }
  }, [clearFavorites, loadFavorites]);

  return {
    // Data
    favorites,
    favoritesCount,
    hasFavorites,

    // State
    isLoading,
    error,
    isHydrated,

    // Actions
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
    loadFavorites,
    syncToFirebase,

    // Debug
    resetFavoritesCompletely,
  };
};

// Hook to check if a specific event is favorite (for use in components)
export const useIsFavorite = (eventId: string) => {
  return useAppSelector(state => selectIsFavorite(state, eventId));
};
