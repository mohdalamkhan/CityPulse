import { useState, useEffect, useCallback } from 'react';
import { TicketmasterEvent } from '@types';
import { ticketmasterService } from '@services/ticketmaster';

export const useEventDetails = (eventId: string) => {
  const [event, setEvent] = useState<TicketmasterEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEventDetails = useCallback(async () => {
    if (!eventId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await ticketmasterService.getEventDetails(eventId);
      if (response.success && response.data) {
        setEvent(response.data);
      } else {
        setError(response.error?.message || 'Failed to load event details');
      }
    } catch (err) {
      setError('Failed to load event details');
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadEventDetails();
  }, [loadEventDetails]);

  return {
    event,
    isLoading,
    error,
    reload: loadEventDetails,
  };
};
