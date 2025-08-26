import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Basic selectors
export const selectFavoritesState = (state: RootState) => state.favorites;
export const selectFavorites = (state: RootState) => state.favorites.items;
export const selectFavoritesLoading = (state: RootState) =>
  state.favorites.isLoading;
export const selectFavoritesError = (state: RootState) => state.favorites.error;
export const selectFavoritesLastUpdated = (state: RootState) =>
  state.favorites.lastUpdated;
export const selectFavoritesIsHydrated = (state: RootState) =>
  state.favorites.isHydrated;

// Derived selectors
export const selectFavoritesCount = createSelector(
  [selectFavorites],
  favorites => favorites.length,
);

export const selectIsFavorite = createSelector(
  [selectFavorites, (_, eventId: string) => eventId],
  (favorites, eventId) => favorites.some(item => item.eventId === eventId),
);

export const selectFavoriteByEventId = createSelector(
  [selectFavorites, (_, eventId: string) => eventId],
  (favorites, eventId) => favorites.find(item => item.eventId === eventId),
);

export const selectHasFavorites = createSelector(
  [selectFavorites],
  favorites => favorites.length > 0,
);

export const selectFavoritesOrderedByDate = createSelector(
  [selectFavorites],
  favorites => {
    return [...favorites].sort(
      (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
    );
  },
);
