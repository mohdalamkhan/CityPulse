import { TicketmasterEvent } from './api.types';

export interface EventServiceConfig {
  baseURL: string;
  apiKey: string;
  timeout: number;
  retries: number;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ServiceError;
  timestamp: number;
}

export interface ServiceError {
  code: string;
  message: string;
  details?: unknown;
  statusCode?: number;
}

export interface SearchFilters {
  category?: string;
  dateRange?: DateRange;
  priceRange?: PriceRange;
  location?: LocationFilter;
  sortBy?: SortOption;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface PriceRange {
  minPrice: number;
  maxPrice: number;
  currency: string;
}

export interface LocationFilter {
  city?: string;
  state?: string;
  country?: string;
  radius?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export type SortOption = 'date_asc' | 'date_desc' | 'price_asc' | 'price_desc' | 'relevance' | 'name_asc' | 'name_desc';

export interface EventSearchOptions {
  query?: string;
  filters?: SearchFilters;
  pagination?: PaginationOptions;
}

export interface PaginationOptions {
  page: number;
  size: number;
  offset?: number;
}

export interface CacheConfig {
  ttl: number;
  maxSize: number;
  enabled: boolean;
}

export interface ServiceMetrics {
  requestCount: number;
  errorCount: number;
  averageResponseTime: number;
  lastRequestTime?: Date;
}

export interface EventEnrichment {
  event: TicketmasterEvent;
  similarity?: number;
  recommendations?: TicketmasterEvent[];
  analytics?: EventAnalytics;
}

export interface EventAnalytics {
  views: number;
  favorites: number;
  shares: number;
  clickThroughRate: number;
  popularityScore: number;
}

export interface TicketmasterServiceMethods {
  searchEvents: (params: any) => Promise<any>;
  getEventDetails: (eventId: string) => Promise<any>;
  getPopularEvents: (city?: string, page?: number) => Promise<any>;
  searchEventsByCategory: (category: string, city?: string, page?: number) => Promise<any>;
  searchEventsByKeyword: (keyword: string, city?: string, page?: number) => Promise<any>;
  searchUpcomingEvents: (city: string, daysFromNow?: number, page?: number) => Promise<any>;
}
