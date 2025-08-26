export const DEFAULT_SEARCH_PARAMS = {
  size: 20,
  page: 0,
  sort: 'relevance,desc',
  locale: '*',
  countryCode: 'US',
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  API_ERROR: 'Something went wrong. Please try again later.',
  NO_EVENTS_FOUND: 'No events found matching your criteria.',
  EVENT_NOT_FOUND: 'Event not found or no longer available.',
  INVALID_SEARCH_PARAMS: 'Invalid search parameters provided.',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please wait before trying again.',
  UNAUTHORIZED: 'Invalid API credentials or access denied.',
  SERVER_ERROR: 'Server temporarily unavailable. Please try again later.',
} as const;

export const PRICE_ESTIMATION_RANGES = {
  SPORTS: {
    basketball: { min: 25, max: 250 },
    football: { min: 30, max: 400 },
    baseball: { min: 15, max: 150 },
    hockey: { min: 20, max: 200 },
    soccer: { min: 20, max: 180 },
    default: { min: 20, max: 200 },
  },
  MUSIC: {
    rock: { min: 30, max: 300 },
    pop: { min: 40, max: 350 },
    classical: { min: 25, max: 150 },
    jazz: { min: 20, max: 120 },
    country: { min: 25, max: 200 },
    electronic: { min: 30, max: 250 },
    default: { min: 25, max: 200 },
  },
  ARTS_THEATRE: { min: 35, max: 200 },
  COMEDY: { min: 20, max: 100 },
  FAMILY: { min: 15, max: 80 },
  DEFAULT: { min: 20, max: 150 },
} as const;

export const IMAGE_PREFERENCES = {
  small: ['16_9', '4_3', '3_2'],
  medium: ['16_9', '4_3', '3_2'],
  large: ['16_9', '4_3', '3_2'],
  xlarge: ['16_9', '4_3', '3_2'],
} as const;

export const EVENT_CATEGORIES = {
  SPORTS: 'sports',
  MUSIC: 'music',
  ARTS_THEATRE: 'arts & theatre',
  COMEDY: 'comedy',
  FAMILY: 'family',
  MISCELLANEOUS: 'miscellaneous',
} as const;

export const SORT_OPTIONS = {
  RELEVANCE_DESC: 'relevance,desc',
  RELEVANCE_ASC: 'relevance,asc',
  DATE_ASC: 'date,asc',
  DATE_DESC: 'date,desc',
  NAME_ASC: 'name,asc',
  NAME_DESC: 'name,desc',
  DISTANCE_ASC: 'distance,asc',
  RANDOM: 'random',
} as const;

export const SEARCH_LIMITS = {
  MIN_PAGE_SIZE: 1,
  MAX_PAGE_SIZE: 200,
  DEFAULT_PAGE_SIZE: 20,
  MAX_SEARCH_RESULTS: 1000,
  MIN_KEYWORD_LENGTH: 2,
  MAX_KEYWORD_LENGTH: 100,
} as const;

export const DATE_FORMATS = {
  API_DATE: 'YYYY-MM-DD',
  API_DATETIME: 'YYYY-MM-DDTHH:mm:ssZ',
  DISPLAY_DATE: 'MMM DD, YYYY',
  DISPLAY_TIME: 'h:mm A',
  DISPLAY_DATETIME: 'MMM DD, YYYY • h:mm A',
} as const;

export const LOCALE_OPTIONS = {
  ALL: '*',
  ENGLISH_US: 'en-us',
  SPANISH_US: 'es-us',
  FRENCH_CA: 'fr-ca',
  ENGLISH_CA: 'en-ca',
  ENGLISH_AU: 'en-au',
  ENGLISH_GB: 'en-gb',
  SPANISH_MX: 'es-mx',
} as const;
