export const API_CONFIG = {
  TICKETMASTER_API_KEY: '',
  TICKETMASTER_BASE_URL: '',
  TIMEOUT: 10000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  RATE_LIMIT_REQUESTS: 5000,
  RATE_LIMIT_WINDOW: 24 * 60 * 60 * 1000,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const API_ENDPOINTS = {
  EVENTS: '/events.json',
  EVENT_DETAILS: (id: string) => `/events/${id}.json`,
  VENUES: '/venues.json',
  ATTRACTIONS: '/attractions.json',
  CLASSIFICATIONS: '/classifications.json',
} as const;

export const API_HEADERS = {
  CONTENT_TYPE: 'application/json',
  ACCEPT: 'application/json',
  USER_AGENT: 'CityPulse/1.0.0',
} as const;
