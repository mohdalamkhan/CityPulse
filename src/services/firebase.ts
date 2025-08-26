import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { User, FavoriteEvent } from '@types';

export class FirebaseAuthService {
  static getCurrentUser(): FirebaseAuthTypes.User | null {
    return auth().currentUser;
  }

  static convertFirebaseUser(firebaseUser: FirebaseAuthTypes.User): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName:
        firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
      preferences: {
        language: 'en',
        favoriteGenres: [],
        notifications: true,
        biometricEnabled: false,
      },
    };
  }

  static async signIn(
    email: string,
    password: string,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      if (userCredential.user) {
        const user = this.convertFirebaseUser(userCredential.user);
        return { success: true, user };
      }
      return { success: false, error: 'Authentication failed' };
    } catch (error: any) {
      let errorMessage = 'Login failed';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Invalid password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          break;
        default:
          errorMessage = error.message || 'Login failed';
      }

      return { success: false, error: errorMessage };
    }
  }

  static async createAccount(
    email: string,
    password: string,
    displayName: string,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      if (userCredential.user) {
        await userCredential.user.updateProfile({
          displayName: displayName,
        });

        await userCredential.user.sendEmailVerification();

        const user = this.convertFirebaseUser(userCredential.user);
        return { success: true, user };
      }

      return { success: false, error: 'Account creation failed' };
    } catch (error: any) {
      let errorMessage = 'Registration failed';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Use at least 6 characters';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          break;
        default:
          errorMessage = error.message || 'Registration failed';
      }

      return { success: false, error: errorMessage };
    }
  }

  static async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      await auth().signOut();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Sign out failed' };
    }
  }

  static async sendPasswordResetEmail(
    email: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await auth().sendPasswordResetEmail(email);
      return { success: true };
    } catch (error: any) {
      let errorMessage = 'Failed to send password reset email';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        default:
          errorMessage = error.message || 'Failed to send password reset email';
      }

      return { success: false, error: errorMessage };
    }
  }

  static async checkEmailVerification(): Promise<boolean> {
    const user = auth().currentUser;
    if (user) {
      await user.reload();
      return user.emailVerified;
    }
    return false;
  }

  static async sendEmailVerification(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const user = auth().currentUser;
      if (user && !user.emailVerified) {
        await user.sendEmailVerification();
        return { success: true };
      }
      return { success: false, error: 'User not found or already verified' };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to send verification email',
      };
    }
  }

  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        const user = this.convertFirebaseUser(firebaseUser);
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}

export class FirebaseFavoritesService {
  private favoritesCollection = 'favorites';

  private getUserFavoritesRef(userId: string) {
    return firestore()
      .collection('users')
      .doc(userId)
      .collection(this.favoritesCollection);
  }

  static async addFavorite(
    userId: string,
    favoriteEvent: FavoriteEvent,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const favoritesRef = new FirebaseFavoritesService().getUserFavoritesRef(
        userId,
      );

      const existingDoc = await favoritesRef.doc(favoriteEvent.eventId).get();
      if (existingDoc.exists()) {
        return { success: true };
      }

      await favoritesRef.doc(favoriteEvent.eventId).set({
        ...favoriteEvent,
        userId,
        addedAt: firestore.FieldValue.serverTimestamp(),
      });

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: 'Firebase unavailable',
      };
    }
  }

  static async removeFavorite(
    userId: string,
    eventId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const favoritesRef = new FirebaseFavoritesService().getUserFavoritesRef(
        userId,
      );
      await favoritesRef.doc(eventId).delete();
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: 'Firebase unavailable',
      };
    }
  }

  static subscribeToFavorites(
    userId: string,
    callback: (favorites: FavoriteEvent[]) => void,
    onError?: (error: any) => void,
  ): () => void {
    const favoritesRef = new FirebaseFavoritesService().getUserFavoritesRef(
      userId,
    );

    const unsubscribe = favoritesRef.orderBy('addedAt', 'desc').onSnapshot(
      (snapshot: any) => {
        const favorites: FavoriteEvent[] = [];
        snapshot.forEach((doc: any) => {
          const data = doc.data();
          favorites.push({
            eventId: doc.id,
            eventData: data.eventData,
            addedAt: data.addedAt?.toDate?.()?.toISOString() || data.addedAt,
            userId: data.userId,
          });
        });
        callback(favorites);
      },
      (error: any) => {
        if (onError) {
          onError(error);
        }
      },
    );

    return unsubscribe;
  }

  static async isFavorite(userId: string, eventId: string): Promise<boolean> {
    try {
      const favoritesRef = new FirebaseFavoritesService().getUserFavoritesRef(
        userId,
      );
      const doc = await favoritesRef.doc(eventId).get();
      return doc.exists();
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }

  static async clearFavorites(
    userId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const favoritesRef = new FirebaseFavoritesService().getUserFavoritesRef(
        userId,
      );
      const snapshot = await favoritesRef.get();

      const batch = firestore().batch();
      snapshot.forEach((doc: any) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      return { success: true };
    } catch (error: any) {
      console.error('Error clearing favorites:', error);
      return {
        success: false,
        error: error.message || 'Failed to clear favorites',
      };
    }
  }

  static async syncLocalFavoritesToFirebase(
    userId: string,
    localFavorites: FavoriteEvent[],
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const batch = firestore().batch();
      const favoritesRef = new FirebaseFavoritesService().getUserFavoritesRef(
        userId,
      );

      localFavorites.forEach(favorite => {
        const docRef = favoritesRef.doc(favorite.eventId);
        batch.set(docRef, {
          ...favorite,
          userId,
          addedAt: firestore.FieldValue.serverTimestamp(),
        });
      });

      await batch.commit();
      return { success: true };
    } catch (error: any) {
      console.error('Error syncing local favorites to Firebase:', error);
      return {
        success: false,
        error: error.message || 'Failed to sync favorites',
      };
    }
  }
}
