import { useState, useCallback, useRef } from 'react';
import { TicketmasterEvent, SearchParams } from '@types';
import { ticketmasterService } from '@services/ticketmaster';
import { debounce } from '@utils';
import { APP_CONFIG } from '@constants';

export const useEventSearch = () => {
  const [events, setEvents] = useState<TicketmasterEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const lastSearchParams = useRef<SearchParams>({});

  const debouncedSearch = useCallback(
    debounce(async (params: SearchParams) => {
      if (!params.keyword && !params.city) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await ticketmasterService.searchEvents({
          ...params,
          page: 0,
        });

        if (response.success && response.data) {
          setEvents(response.data);
          setCurrentPage(0);
          setHasMore(response.data.length >= APP_CONFIG.DEBOUNCE_DELAY);
          lastSearchParams.current = params;
        } else {
          setError(response.error?.message || 'Search failed');
          setEvents([]);
        }
      } catch (err) {
        setError('Failed to search events');
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    }, APP_CONFIG.DEBOUNCE_DELAY),
    [],
  );

  const searchEvents = useCallback(
    (keyword?: string, cityParam?: string) => {
      const params: SearchParams = {
        keyword: keyword || searchQuery,
        city: cityParam || city,
      };
      debouncedSearch(params);
    },
    [searchQuery, city, debouncedSearch],
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);

    try {
      const response = await ticketmasterService.searchEvents({
        ...lastSearchParams.current,
        page: currentPage + 1,
      });

      if (response.success && response.data) {
        setEvents(prev => [...prev, ...response.data!]);
        setCurrentPage(prev => prev + 1);
        setHasMore(response.data.length >= APP_CONFIG.DEBOUNCE_DELAY);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError('Failed to load more events');
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, currentPage]);

  const clearSearch = useCallback(() => {
    setEvents([]);
    setSearchQuery('');
    setCity('');
    setError(null);
    setCurrentPage(0);
    setHasMore(true);
  }, []);

  return {
    events,
    searchQuery,
    setSearchQuery,
    city,
    setCity,
    isLoading,
    error,
    hasMore,
    searchEvents,
    loadMore,
    clearSearch,
  };
};
