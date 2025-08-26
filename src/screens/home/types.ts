export interface HomeScreenProps {}

export interface HomeScreenState {
  popularEvents: TicketmasterEvent[];
  selectedCategory: string;
  refreshing: boolean;
}

export interface EventCardProps {
  item: TicketmasterEvent;
  onPress: (event: TicketmasterEvent) => void;
  onFavoriteToggle: (event: TicketmasterEvent) => void;
  isFavorite: boolean;
}

export interface TicketmasterEvent {
  id: string;
  name: string;
  images?: Array<{
    url: string;
    width?: number;
    height?: number;
  }>;
  dates?: {
    start?: {
      localDate?: string;
      localTime?: string;
    };
  };
  _embedded?: {
    venues?: Array<{
      name: string;
      city?: { name: string };
      state?: { name: string };
    }>;
  };
  priceRanges?: Array<{
    min: number;
    max: number;
    currency: string;
  }>;
}
