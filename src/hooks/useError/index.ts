import { useState, useCallback } from 'react';

export const useError = () => {
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);
  const showError = useCallback((message: string) => setError(message), []);

  return { error, setError, clearError, showError };
};
