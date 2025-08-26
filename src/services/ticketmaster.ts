import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  TicketmasterApiResponse,
  TicketmasterEvent,
  SearchParams,
  ApiResponse,
  ApiError,
  ImageSize,
  EventPriceRange,
  EventDateTime,
} from '@types';
import { API_CONFIG } from '@constants/api.constants';
import {
  DEFAULT_SEARCH_PARAMS,
  ERROR_MESSAGES,
  PRICE_ESTIMATION_RANGES,
  IMAGE_PREFERENCES,
} from '@constants/service.constants';

class TicketmasterService {
  private apiClient: AxiosInstance;
  private apiKey: string;

  constructor() {
    this.apiKey = API_CONFIG.TICKETMASTER_API_KEY;

    this.apiClient = axios.create({
      baseURL: API_CONFIG.TICKETMASTER_BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.apiClient.interceptors.request.use(
      config => {
        config.params = {
          ...config.params,
          apikey: this.apiKey,
        };
        return config;
      },
      error => Promise.reject(error),
    );

    this.apiClient.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        const apiError = this.handleApiError(error);
        return Promise.reject(apiError);
      },
    );
  }

  private handleApiError(error: AxiosError): ApiError {
    if (error.response) {
      const { status, data } = error.response;
      return {
        code: `HTTP_${status}`,
        message: this.getErrorMessage(status),
        details: data,
      };
    } else if (error.request) {
      return {
        code: 'NETWORK_ERROR',
        message: ERROR_MESSAGES.NETWORK_ERROR,
        details: error.message,
      };
    } else {
      return {
        code: 'UNKNOWN_ERROR',
        message: ERROR_MESSAGES.API_ERROR,
        details: error.message,
      };
    }
  }

  private getErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Invalid request parameters.';
      case 401:
        return 'Invalid API key or unauthorized access.';
      case 403:
        return 'Access forbidden. Check your API permissions.';
      case 404:
        return 'No events found with the given criteria.';
      case 429:
        return 'Rate limit exceeded. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return ERROR_MESSAGES.API_ERROR;
    }
  }

  async searchEvents(
    searchParams: SearchParams = {},
  ): Promise<ApiResponse<TicketmasterEvent[]>> {
    try {
      const params = {
        ...DEFAULT_SEARCH_PARAMS,
        ...searchParams,
      };

      const queryParams: { [key: string]: any } = {
        size: params.size,
        page: params.page,
        sort: params.sort,
        locale: params.locale,
        countryCode: params.countryCode,
      };

      if (params.keyword) {
        queryParams.keyword = params.keyword;
      }

      if (params.city) {
        queryParams.city = params.city;
      }

      const response = await this.apiClient.get<TicketmasterApiResponse>(
        '/events.json',
        {
          params: queryParams,
        },
      );

      const events = response.data._embedded?.events || [];

      return {
        success: true,
        data: events,
        pagination: {
          page: response.data.page?.number || 0,
          size: response.data.page?.size || 20,
          totalElements: response.data.page?.totalElements || events.length,
          totalPages: response.data.page?.totalPages || 1,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error as ApiError,
      };
    }
  }

  async getEventDetails(
    eventId: string,
  ): Promise<ApiResponse<TicketmasterEvent>> {
    try {
      const response = await this.apiClient.get<TicketmasterEvent>(
        `/events/${eventId}.json`,
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error as ApiError,
      };
    }
  }

  async searchEventsByCategory(
    category: string,
    city?: string,
    page: number = 0,
  ): Promise<ApiResponse<TicketmasterEvent[]>> {
    return this.searchEvents({
      classificationName: category,
      city,
      page,
      size: DEFAULT_SEARCH_PARAMS.size,
    });
  }

  async searchUpcomingEvents(
    city: string,
    daysFromNow: number = 30,
    page: number = 0,
  ): Promise<ApiResponse<TicketmasterEvent[]>> {
    const startDateTime = new Date().toISOString();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + daysFromNow);
    const endDateTime = endDate.toISOString();

    return this.searchEvents({
      city,
      startDateTime,
      endDateTime,
      page,
      sort: 'date,asc',
    });
  }

  async searchEventsByKeyword(
    keyword: string,
    city?: string,
    page: number = 0,
  ): Promise<ApiResponse<TicketmasterEvent[]>> {
    return this.searchEvents({
      keyword,
      city,
      page,
      size: DEFAULT_SEARCH_PARAMS.size,
    });
  }

  async getPopularEvents(
    city?: string,
    page: number = 0,
  ): Promise<ApiResponse<TicketmasterEvent[]>> {
    return this.searchEvents({
      city,
      page,
      sort: 'relevance,desc',
      size: DEFAULT_SEARCH_PARAMS.size,
    });
  }

  getEventImageUrl(
    event: TicketmasterEvent,
    size: ImageSize = 'medium',
  ): string {
    const images = event.images || [];

    const preferredRatios = IMAGE_PREFERENCES;

    for (const ratio of preferredRatios[size]) {
      const image = images.find(img => img.ratio === ratio);
      if (image && !image.fallback) {
        return image.url;
      }
    }

    const firstImage = images.find(img => !img.fallback);
    if (firstImage) {
      return firstImage.url;
    }

    return images.length > 0 ? images[0].url : '';
  }

  getEventVenue(event: TicketmasterEvent) {
    const venues = event._embedded?.venues || [];
    return venues.length > 0 ? venues[0] : null;
  }

  getEventClassification(event: TicketmasterEvent) {
    const classifications = event.classifications || [];
    const primaryClassification = classifications.find(c => c.primary);
    return (
      primaryClassification ||
      (classifications.length > 0 ? classifications[0] : null)
    );
  }

  formatEventDateTime(event: TicketmasterEvent): EventDateTime {
    const startDate = event.dates?.start;

    if (!startDate) {
      return { date: 'TBA', time: 'TBA', dateTime: null };
    }

    let dateTime: Date | null = null;

    if (startDate.dateTime) {
      dateTime = new Date(startDate.dateTime);
    } else if (startDate.localDate && startDate.localTime) {
      dateTime = new Date(`${startDate.localDate}T${startDate.localTime}`);
    } else if (startDate.localDate) {
      dateTime = new Date(startDate.localDate);
    }

    if (!dateTime || isNaN(dateTime.getTime())) {
      return { date: 'TBA', time: 'TBA', dateTime: null };
    }

    const date = dateTime.toLocaleDateString();
    const time = startDate.localTime
      ? dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'Time TBA';

    return { date, time, dateTime };
  }

  getEventPriceRange(event: TicketmasterEvent): EventPriceRange {
    const priceRanges = event.priceRanges || [];

    if (priceRanges.length > 0) {
      const priceRange = priceRanges[0];
      const { min, max, currency = 'USD' } = priceRange;

      let formatted = 'Price TBA';
      if (min !== undefined && max !== undefined) {
        if (min === max) {
          formatted = `$${min}`;
        } else {
          formatted = `$${min} - $${max}`;
        }
      } else if (min !== undefined) {
        formatted = `From $${min}`;
      } else if (max !== undefined) {
        formatted = `Up to $${max}`;
      }

      return { min, max, currency, formatted };
    }

    const classification = this.getEventClassification(event);
    const segment = classification?.segment?.name?.toLowerCase();
    const genre = classification?.genre?.name?.toLowerCase();

    let estimatedPrice = '';

    if (segment === 'sports') {
      const sportsCategory =
        genre?.includes('basketball') || genre?.includes('football')
          ? 'basketball'
          : genre?.includes('baseball') || genre?.includes('hockey')
          ? 'baseball'
          : 'default';
      const range = PRICE_ESTIMATION_RANGES.SPORTS[sportsCategory];
      estimatedPrice = `$${range.min} - $${range.max}`;
    } else if (segment === 'music') {
      const musicCategory =
        genre?.includes('rock') || genre?.includes('pop')
          ? 'rock'
          : genre?.includes('classical')
          ? 'classical'
          : 'default';
      const range = PRICE_ESTIMATION_RANGES.MUSIC[musicCategory];
      estimatedPrice = `$${range.min} - $${range.max}`;
    } else if (segment === 'arts & theatre') {
      const range = PRICE_ESTIMATION_RANGES.ARTS_THEATRE;
      estimatedPrice = `$${range.min} - $${range.max}`;
    } else if (segment === 'comedy') {
      const range = PRICE_ESTIMATION_RANGES.COMEDY;
      estimatedPrice = `$${range.min} - $${range.max}`;
    } else if (segment === 'family') {
      const range = PRICE_ESTIMATION_RANGES.FAMILY;
      estimatedPrice = `$${range.min} - $${range.max}`;
    } else {
      const range = PRICE_ESTIMATION_RANGES.DEFAULT;
      estimatedPrice = `$${range.min} - $${range.max}`;
    }

    return {
      min: null,
      max: null,
      currency: 'USD',
      formatted: estimatedPrice,
    };
  }
}

export const ticketmasterService = new TicketmasterService();
export default TicketmasterService;
