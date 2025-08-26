import { useState, useEffect, useCallback } from 'react';
import { User } from '@types';
import { userStorage } from '@storage';
import { FirebaseAuthService } from '@services/firebase';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const getUserWithPreferences = useCallback(
    async (authUser: User): Promise<User> => {
      try {
        const savedUserData = await userStorage.getUser();

        if (savedUserData && savedUserData.id === authUser.id) {
          return {
            ...authUser,
            preferences: savedUserData.preferences,
          };
        }

        await userStorage.setUser(authUser);
        return authUser;
      } catch (error) {
        console.warn('Could not load user preferences:', error);
        return authUser;
      }
    },
    [],
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      setIsCheckingAuth(true);
      setAuthError(null);

      try {
        const loginResult = await FirebaseAuthService.signIn(email, password);

        if (loginResult.success && loginResult.user) {
          const userWithSettings = await getUserWithPreferences(
            loginResult.user,
          );
          setCurrentUser(userWithSettings);
          return { success: true };
        }

        return { success: false, error: loginResult.error };
      } catch (error: any) {
        const message = error.message || 'Could not sign in. Please try again.';
        setAuthError(message);
        return { success: false, error: message };
      } finally {
        setIsCheckingAuth(false);
      }
    },
    [getUserWithPreferences],
  );

  const createAccount = useCallback(
    async (email: string, password: string, displayName: string) => {
      setIsCheckingAuth(true);
      setAuthError(null);

      try {
        const signupResult = await FirebaseAuthService.createAccount(
          email,
          password,
          displayName,
        );

        if (signupResult.success && signupResult.user) {
          const userWithSettings = await getUserWithPreferences(
            signupResult.user,
          );
          setCurrentUser(userWithSettings);
          return { success: true };
        }

        return { success: false, error: signupResult.error };
      } catch (error: any) {
        const message =
          error.message || 'Could not create account. Please try again.';
        setAuthError(message);
        return { success: false, error: message };
      } finally {
        setIsCheckingAuth(false);
      }
    },
    [getUserWithPreferences],
  );

  const signOut = useCallback(async () => {
    try {
      const logoutResult = await FirebaseAuthService.signOut();

      if (logoutResult.success) {
        await userStorage.removeUser();
        setCurrentUser(null);
        return true;
      }

      setAuthError(logoutResult.error || 'Could not sign out properly');
      return false;
    } catch (error: any) {
      const message = error.message || 'Could not sign out';
      setAuthError(message);
      return false;
    }
  }, []);

  const updateUserInfo = useCallback(
    async (newInfo: Partial<User>) => {
      if (!currentUser) {
        setAuthError('No user is signed in');
        return false;
      }

      try {
        const updateSuccessful = await userStorage.updateUser(newInfo);
        if (updateSuccessful) {
          setCurrentUser((previousUser: User | null) =>
            previousUser ? { ...previousUser, ...newInfo } : previousUser,
          );
          return true;
        }
        return false;
      } catch (error) {
        setAuthError('Could not update your information');
        return false;
      }
    },
    [currentUser],
  );

  const sendPasswordReset = useCallback(async (email: string) => {
    try {
      return await FirebaseAuthService.sendPasswordResetEmail(email);
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Could not send password reset email',
      };
    }
  }, []);

  const isUserSignedIn = currentUser !== null;

  useEffect(() => {
    let stopWatching: (() => void) | undefined;

    const startWatchingAuth = async () => {
      try {
        stopWatching = FirebaseAuthService.onAuthStateChanged(
          async authUser => {
            if (authUser) {
              const userWithSettings = await getUserWithPreferences(authUser);
              setCurrentUser(userWithSettings);
            } else {
              await userStorage.removeUser();
              setCurrentUser(null);
            }
            setIsCheckingAuth(false);
          },
        );
      } catch (error) {
        console.error('Could not start authentication system:', error);
        setAuthError('Authentication system failed to start');
        setIsCheckingAuth(false);
      }
    };

    startWatchingAuth();

    return () => {
      stopWatching?.();
    };
  }, [getUserWithPreferences]);

  return {
    user: currentUser,
    isAuthenticated: isUserSignedIn,
    isLoading: isCheckingAuth,
    error: authError,
    login: signIn,
    register: createAccount,
    logout: signOut,
    updateProfile: updateUserInfo,
    sendPasswordResetEmail: sendPasswordReset,
  };
};
