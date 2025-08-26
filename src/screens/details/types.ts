export interface EventDetailsScreenProps {}

export interface EventDetailsState {
  showFullDescription: boolean;
  mapError: boolean;
}

export interface EventDetailsRouteProp {
  eventId: string;
  event?: TicketmasterEvent;
}

export interface TicketmasterEvent {
  id: string;
  name: string;
  url?: string;
  info?: string;
  pleaseNote?: string;
  additionalInfo?: string;
  dates?: {
    start?: {
      localDate?: string;
      localTime?: string;
    };
    status?: {
      code: string;
    };
  };
  images?: Array<{
    url: string;
    width?: number;
    height?: number;
  }>;
  _embedded?: {
    venues?: Array<{
      name: string;
      address?: {
        line1?: string;
      };
      city?: { name: string };
      state?: { name: string };
      location?: {
        latitude: string;
        longitude: string;
      };
    }>;
  };
  priceRanges?: Array<{
    min: number;
    max: number;
    currency: string;
  }>;
  classifications?: Array<{
    segment?: {
      name: string;
    };
    genre?: {
      name: string;
    };
  }>;
}

export interface RootStackParamList {
  EventDetails: EventDetailsRouteProp;
}
