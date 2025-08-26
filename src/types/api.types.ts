export interface TicketmasterEvent {
  id: string;
  name: string;
  type: string;
  url?: string;
  locale?: string;
  images: TicketmasterImage[];
  sales?: {
    public?: {
      startDateTime?: string;
      endDateTime?: string;
    };
  };
  dates: {
    start?: {
      localDate?: string;
      localTime?: string;
      dateTime?: string;
    };
    timezone?: string;
    status?: {
      code: string;
    };
  };
  classifications?: TicketmasterClassification[];
  promoter?: {
    id?: string;
    name?: string;
  };
  promoters?: Array<{
    id?: string;
    name?: string;
  }>;
  _embedded?: {
    venues?: TicketmasterVenue[];
  };
  priceRanges?: Array<{
    type: string;
    currency: string;
    min: number;
    max: number;
  }>;
  info?: string;
  pleaseNote?: string;
}

export interface TicketmasterImage {
  ratio: string;
  url: string;
  width: number;
  height: number;
  fallback: boolean;
}

export interface TicketmasterClassification {
  primary: boolean;
  segment: {
    id: string;
    name: string;
  };
  genre?: {
    id: string;
    name: string;
  };
  subGenre?: {
    id: string;
    name: string;
  };
}

export interface TicketmasterVenue {
  id: string;
  name: string;
  type: string;
  url?: string;
  locale?: string;
  images?: TicketmasterImage[];
  postalCode?: string;
  timezone?: string;
  city?: {
    name: string;
  };
  state?: {
    name: string;
    stateCode: string;
  };
  country?: {
    name: string;
    countryCode: string;
  };
  address?: {
    line1?: string;
    line2?: string;
  };
  location?: {
    longitude: string;
    latitude: string;
  };
}

export interface TicketmasterApiResponse {
  _embedded?: {
    events?: TicketmasterEvent[];
  };
  _links?: {
    self?: {
      href: string;
    };
    next?: {
      href: string;
    };
  };
  page?: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export interface SearchParams {
  keyword?: string;
  city?: string;
  size?: number;
  page?: number;
  sort?: string;
  startDateTime?: string;
  endDateTime?: string;
  classificationName?: string;
  locale?: string;
  countryCode?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  pagination?: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface PaginationInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type ImageSize = 'small' | 'medium' | 'large';

export interface EventPriceRange {
  min: number | null;
  max: number | null;
  currency: string;
  formatted: string;
}

export interface EventDateTime {
  date: string;
  time: string;
  dateTime: Date | null;
}
