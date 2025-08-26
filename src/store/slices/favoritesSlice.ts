import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FavoriteEvent, TicketmasterEvent } from '@types';
import { favoritesStorage } from '@storage';

// Async thunks for Firebase operations
export const syncWithFirebase = createAsyncThunk(
  'favorites/syncWithFirebase',
  async (userId: string, { rejectWithValue }) => {
    try {
      const { FirebaseFavoritesService } = await import(
        '../../services/firebase'
      );
      // This would be used when user logs in to sync local to Firebase
      const localFavorites = await favoritesStorage.getFavorites();
      if (localFavorites.length > 0) {
        await FirebaseFavoritesService.syncLocalFavoritesToFirebase(
          userId,
          localFavorites,
        );
      }
      return localFavorites;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const loadFavoritesFromStorage = createAsyncThunk(
  'favorites/loadFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      const storedFavorites = await favoritesStorage.getFavorites();

      return storedFavorites;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const saveFavoriteToStorage = createAsyncThunk(
  'favorites/saveToStorage',
  async (favoriteEvent: FavoriteEvent, { rejectWithValue }) => {
    try {
      const success = await favoritesStorage.addFavorite(favoriteEvent);
      if (!success) {
        throw new Error('Failed to save to storage');
      }

      return favoriteEvent;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const removeFavoriteFromStorage = createAsyncThunk(
  'favorites/removeFromStorage',
  async (eventId: string, { rejectWithValue }) => {
    try {
      const success = await favoritesStorage.removeFavorite(eventId);
      if (!success) {
        throw new Error('Failed to remove from storage');
      }

      return eventId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const clearAllFavoritesFromStorage = createAsyncThunk(
  'favorites/clearAllFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      const success = await favoritesStorage.clearFavorites();
      if (!success) {
        throw new Error('Failed to clear favorites from storage');
      }

      return true;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

interface FavoritesState {
  items: FavoriteEvent[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number;
  isHydrated: boolean; // Track if we've loaded from storage initially
}

const initialState: FavoritesState = {
  items: [],
  isLoading: false,
  error: null,
  lastUpdated: 0,
  isHydrated: false,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Synchronous actions for immediate UI updates
    addFavoriteOptimistic: (state, action: PayloadAction<FavoriteEvent>) => {
      const exists = state.items.some(
        item => item.eventId === action.payload.eventId,
      );
      if (!exists) {
        state.items.push(action.payload);
        state.lastUpdated = Date.now();
      }
    },
    removeFavoriteOptimistic: (state, action: PayloadAction<string>) => {
      const initialLength = state.items.length;
      state.items = state.items.filter(item => item.eventId !== action.payload);
      state.lastUpdated = Date.now();
      if (state.items.length < initialLength) {
      }
    },
    clearFavoritesOptimistic: state => {
      state.items = [];
      state.lastUpdated = Date.now();
    },
    clearError: state => {
      state.error = null;
    },
    setHydrated: state => {
      state.isHydrated = true;
    },
  },
  extraReducers: builder => {
    // Load favorites from storage
    builder
      .addCase(loadFavoritesFromStorage.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadFavoritesFromStorage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.lastUpdated = Date.now();
        state.isHydrated = true;
        state.error = null;
      })
      .addCase(loadFavoritesFromStorage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isHydrated = true;
      });

    // Save favorite to storage
    builder
      .addCase(saveFavoriteToStorage.pending, state => {
        state.error = null;
      })
      .addCase(saveFavoriteToStorage.fulfilled, (state, action) => {
        // Storage save successful - item already added optimistically, just update metadata
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(saveFavoriteToStorage.rejected, (state, action) => {
        // Revert optimistic update on failure
        const eventId = action.meta.arg.eventId;
        state.items = state.items.filter(item => item.eventId !== eventId);
        state.error = action.payload as string;
      });

    // Remove favorite from storage
    builder
      .addCase(removeFavoriteFromStorage.pending, state => {
        state.error = null;
      })
      .addCase(removeFavoriteFromStorage.fulfilled, (state, action) => {
        // Storage removal successful, ensure it's removed from state
        state.items = state.items.filter(
          item => item.eventId !== action.payload,
        );
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(removeFavoriteFromStorage.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Clear all favorites from storage
    builder
      .addCase(clearAllFavoritesFromStorage.pending, state => {
        state.error = null;
      })
      .addCase(clearAllFavoritesFromStorage.fulfilled, state => {
        state.items = [];
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(clearAllFavoritesFromStorage.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Firebase sync
    builder
      .addCase(syncWithFirebase.pending, state => {
        state.error = null;
      })
      .addCase(syncWithFirebase.fulfilled, state => {
        state.error = null;
      })
      .addCase(syncWithFirebase.rejected, (state, action) => {
        state.error = null;
      });
  },
});

export const {
  addFavoriteOptimistic,
  removeFavoriteOptimistic,
  clearFavoritesOptimistic,
  clearError,
  setHydrated,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
