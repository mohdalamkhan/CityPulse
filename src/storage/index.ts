import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@constants';
import { User, FavoriteEvent, LanguageCode } from '@types';

// Generic Storage Operations
class StorageService {
  // Generic get method with type safety
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error);
      return null;
    }
  }

  // Generic set method with type safety
  async set<T>(key: string, value: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting ${key} to storage:`, error);
      return false;
    }
  }

  // Generic remove method
  async remove(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
      return false;
    }
  }

  // Clear all storage
  async clear(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  // Get all keys
  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  // Multiple operations
  async multiGet(keys: string[]): Promise<{ [key: string]: any }> {
    try {
      const values = await AsyncStorage.multiGet(keys);
      const result: { [key: string]: any } = {};

      values.forEach(([key, value]) => {
        result[key] = value ? JSON.parse(value) : null;
      });

      return result;
    } catch (error) {
      console.error('Error in multiGet:', error);
      return {};
    }
  }

  async multiSet(keyValuePairs: Array<[string, any]>): Promise<boolean> {
    try {
      const stringifiedPairs = keyValuePairs.map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]) as Array<[string, string]>;

      await AsyncStorage.multiSet(stringifiedPairs);
      return true;
    } catch (error) {
      console.error('Error in multiSet:', error);
      return false;
    }
  }
}

// User Data Operations
export class UserStorage extends StorageService {
  async getUser(): Promise<User | null> {
    return this.get<User>(STORAGE_KEYS.USER_DATA);
  }

  async setUser(user: User): Promise<boolean> {
    return this.set<User>(STORAGE_KEYS.USER_DATA, user);
  }

  async updateUser(updates: Partial<User>): Promise<boolean> {
    try {
      const existingUser = await this.getUser();
      if (!existingUser) {
        console.error('No existing user found to update');
        return false;
      }

      const updatedUser: User = {
        ...existingUser,
        ...updates,
      };

      return this.setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }

  async removeUser(): Promise<boolean> {
    return this.remove(STORAGE_KEYS.USER_DATA);
  }

  async isLoggedIn(): Promise<boolean> {
    const user = await this.getUser();
    return user !== null;
  }
}

// Favorites Operations
export class FavoritesStorage extends StorageService {
  async getFavorites(): Promise<FavoriteEvent[]> {
    const favorites = await this.get<FavoriteEvent[]>(STORAGE_KEYS.FAVORITES);
    return favorites || [];
  }

  async addFavorite(event: FavoriteEvent): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();

      // Check if already exists
      const existingIndex = favorites.findIndex(
        fav => fav.eventId === event.eventId,
      );
      if (existingIndex !== -1) {
        return true;
      }

      favorites.push(event);
      return this.set<FavoriteEvent[]>(STORAGE_KEYS.FAVORITES, favorites);
    } catch (error) {
      return false;
    }
  }

  async removeFavorite(eventId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      const filteredFavorites = favorites.filter(
        fav => fav.eventId !== eventId,
      );
      return this.set<FavoriteEvent[]>(
        STORAGE_KEYS.FAVORITES,
        filteredFavorites,
      );
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
  }

  async isFavorite(eventId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.some(fav => fav.eventId === eventId);
    } catch (error) {
      console.error('Error checking if favorite:', error);
      return false;
    }
  }

  async clearFavorites(): Promise<boolean> {
    try {
      await this.remove(STORAGE_KEYS.FAVORITES);
      const result = await this.set<FavoriteEvent[]>(
        STORAGE_KEYS.FAVORITES,
        [],
      );

      return result;
    } catch (error) {
      console.error('Error clearing favorites:', error);
      return false;
    }
  }

  async getFavoritesByUserId(userId: string): Promise<FavoriteEvent[]> {
    try {
      const favorites = await this.getFavorites();
      return favorites.filter(fav => fav.userId === userId);
    } catch (error) {
      console.error('Error getting favorites by user ID:', error);
      return [];
    }
  }
}

export class SettingsStorage extends StorageService {
  async getLanguage(): Promise<LanguageCode> {
    const language = await this.get<LanguageCode>(STORAGE_KEYS.LANGUAGE);
    return language || 'en';
  }

  async setLanguage(language: LanguageCode): Promise<boolean> {
    return this.set<LanguageCode>(STORAGE_KEYS.LANGUAGE, language);
  }

  async getBiometricEnabled(): Promise<boolean> {
    const enabled = await this.get<boolean>(STORAGE_KEYS.BIOMETRIC_ENABLED);
    return enabled || false;
  }

  async setBiometricEnabled(enabled: boolean): Promise<boolean> {
    return this.set<boolean>(STORAGE_KEYS.BIOMETRIC_ENABLED, enabled);
  }

  async getOnboardingComplete(): Promise<boolean> {
    const complete = await this.get<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETE);
    return complete || false;
  }

  async setOnboardingComplete(complete: boolean): Promise<boolean> {
    return this.set<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETE, complete);
  }
}

export class AppStorage extends StorageService {
  async getStorageSize(): Promise<number> {
    try {
      const keys = await this.getAllKeys();
      let totalSize = 0;

      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  }

  async exportData(): Promise<{ [key: string]: any }> {
    try {
      const keys = await this.getAllKeys();
      return this.multiGet(keys);
    } catch (error) {
      console.error('Error exporting data:', error);
      return {};
    }
  }

  async importData(data: { [key: string]: any }): Promise<boolean> {
    try {
      const keyValuePairs = Object.entries(data);
      return this.multiSet(keyValuePairs);
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  async clearAppData(): Promise<boolean> {
    try {
      const appKeys = [
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.FAVORITES,
        STORAGE_KEYS.LANGUAGE,
        STORAGE_KEYS.ONBOARDING_COMPLETE,
        STORAGE_KEYS.BIOMETRIC_ENABLED,
      ];

      await AsyncStorage.multiRemove(appKeys);
      return true;
    } catch (error) {
      console.error('Error clearing app data:', error);
      return false;
    }
  }
}

export const userStorage = new UserStorage();
export const favoritesStorage = new FavoritesStorage();
export const settingsStorage = new SettingsStorage();
export const appStorage = new AppStorage();

export default StorageService;
