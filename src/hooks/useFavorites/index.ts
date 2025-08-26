import { useState, useEffect, useCallback } from 'react';
import { TicketmasterEvent, FavoriteEvent, User } from '@types';
import { favoritesStorage } from '@storage';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [lastOperationTime, setLastOperationTime] = useState<number>(0);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { FirebaseAuthService } = await import('../../services/firebase');
        const firebaseUser = FirebaseAuthService.getCurrentUser();
        if (firebaseUser) {
          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || undefined,
            createdAt: firebaseUser.metadata.creationTime || '',
            lastLoginAt: firebaseUser.metadata.lastSignInTime || '',
            preferences: {
              language: 'en',
              favoriteGenres: [],
              notifications: true,
              biometricEnabled: false,
            },
          };
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        setCurrentUser(null);
        loadLocalFavorites();
      }
    };

    getCurrentUser();
  }, []);

  const loadLocalFavorites = useCallback(async () => {
    const loadTime = Date.now();
    setIsLoading(true);
    try {
      const storedFavorites = await favoritesStorage.getFavorites();

      if (loadTime >= lastOperationTime) {
        setFavorites(storedFavorites);
      }
    } catch (err) {
      setError('Failed to load favorites');
    } finally {
      setIsLoading(false);
    }
  }, [lastOperationTime]);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const setupRealTimeListener = async () => {
      if (currentUser?.id) {
        try {
          setIsLoading(true);
          const { FirebaseFavoritesService } = await import(
            '../../services/firebase'
          );

          unsubscribe = FirebaseFavoritesService.subscribeToFavorites(
            currentUser.id,
            updatedFavorites => {
              setFavorites(updatedFavorites);
              setIsLoading(false);
              setError(null);
            },
            error => {
              setError(null);
              setIsLoading(false);

              loadLocalFavorites();
            },
          );
        } catch (err) {
          setError(null);
          setIsLoading(false);

          loadLocalFavorites();
        }
      } else {
        loadLocalFavorites();
      }
    };

    setupRealTimeListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser?.id, loadLocalFavorites]);

  const loadFavorites = useCallback(async () => {
    if (currentUser?.id) {
      setIsLoading(true);
    } else {
      // Local storage fallback
      await loadLocalFavorites();
    }
  }, [currentUser?.id, loadLocalFavorites]);

  const addFavorite = useCallback(
    async (event: TicketmasterEvent) => {
      try {
        const favoriteEvent: FavoriteEvent = {
          eventId: event.id,
          eventData: event,
          addedAt: new Date().toISOString(),
          userId: currentUser?.id,
        };

        if (currentUser?.id) {
          try {
            const { FirebaseFavoritesService } = await import(
              '../../services/firebase'
            );
            const result = await FirebaseFavoritesService.addFavorite(
              currentUser.id,
              favoriteEvent,
            );
            if (result.success) {
              await favoritesStorage.addFavorite(favoriteEvent);
              return true;
            }

            throw new Error('Firebase add failed');
          } catch (fbError) {
            const success = await favoritesStorage.addFavorite(favoriteEvent);
            if (success) {
              setFavorites(prev => {
                const exists = prev.some(
                  fav => fav.eventId === favoriteEvent.eventId,
                );
                if (exists) {
                  return prev;
                }
                const updated = [...prev, favoriteEvent];
                return updated;
              });
              setLastOperationTime(Date.now());
              return true;
            }
            return false;
          }
        } else {
          const success = await favoritesStorage.addFavorite(favoriteEvent);
          if (success) {
            setFavorites(prev => {
              const exists = prev.some(
                fav => fav.eventId === favoriteEvent.eventId,
              );
              if (exists) {
                return prev;
              }
              const updated = [...prev, favoriteEvent];
              return updated;
            });
            setLastOperationTime(Date.now());
            return true;
          }
          return false;
        }
      } catch (err) {
        return false;
      }
    },
    [currentUser?.id],
  );

  const removeFavorite = useCallback(
    async (eventId: string) => {
      try {
        if (currentUser?.id) {
          try {
            const { FirebaseFavoritesService } = await import(
              '../../services/firebase'
            );
            const result = await FirebaseFavoritesService.removeFavorite(
              currentUser.id,
              eventId,
            );
            if (result.success) {
              await favoritesStorage.removeFavorite(eventId);
              return true;
            }

            throw new Error('Firebase remove failed');
          } catch (fbError) {
            const success = await favoritesStorage.removeFavorite(eventId);
            if (success) {
              setFavorites(prev => {
                const updated = prev.filter(fav => fav.eventId !== eventId);
                return updated;
              });
              setLastOperationTime(Date.now());
              return true;
            }
            return false;
          }
        } else {
          const success = await favoritesStorage.removeFavorite(eventId);
          if (success) {
            setFavorites(prev => {
              const updated = prev.filter(fav => fav.eventId !== eventId);
              return updated;
            });
            setLastOperationTime(Date.now());
            return true;
          }
          return false;
        }
      } catch (err) {
        return false;
      }
    },
    [currentUser?.id],
  );

  const isFavorite = useCallback(
    (eventId: string) => {
      return favorites.some(fav => fav.eventId === eventId);
    },
    [favorites],
  );

  const toggleFavorite = useCallback(
    async (event: TicketmasterEvent) => {
      if (isFavorite(event.id)) {
        return removeFavorite(event.id);
      } else {
        return addFavorite(event);
      }
    },
    [isFavorite, removeFavorite, addFavorite],
  );

  const clearFavorites = useCallback(async () => {
    try {
      if (currentUser?.id) {
        try {
          const { FirebaseFavoritesService } = await import(
            '../../services/firebase'
          );
          const result = await FirebaseFavoritesService.clearFavorites(
            currentUser.id,
          );
          if (result.success) {
            await favoritesStorage.clearFavorites();
            return true;
          }

          throw new Error('Firebase clear failed');
        } catch (fbError) {
          const success = await favoritesStorage.clearFavorites();
          if (success) {
            setFavorites([]);
            setLastOperationTime(Date.now());
            return true;
          }
          return false;
        }
      } else {
        const success = await favoritesStorage.clearFavorites();
        if (success) {
          setFavorites([]);
          setLastOperationTime(Date.now());
          return true;
        }
        return false;
      }
    } catch (err) {
      return false;
    }
  }, [currentUser?.id]);

  const syncLocalToFirebase = useCallback(async () => {
    if (currentUser?.id) {
      try {
        const localFavorites = await favoritesStorage.getFavorites();
        if (localFavorites.length > 0) {
          const { FirebaseFavoritesService } = await import(
            '../../services/firebase'
          );
          await FirebaseFavoritesService.syncLocalFavoritesToFirebase(
            currentUser.id,
            localFavorites,
          );
        }
      } catch (err) {}
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (currentUser?.id) {
      syncLocalToFirebase();
    }
  }, [currentUser?.id, syncLocalToFirebase]);

  const resetFavoritesCompletely = useCallback(async () => {
    try {
      await favoritesStorage.clearFavorites();

      setFavorites([]);
      setLastOperationTime(Date.now());

      const verification = await favoritesStorage.getFavorites();

      return true;
    } catch (err) {
      console.error('Failed to reset favorites:', err);
      return false;
    }
  }, []);

  return {
    favorites,
    isLoading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    loadFavorites,
    syncLocalToFirebase,
    resetFavoritesCompletely,
  };
};
