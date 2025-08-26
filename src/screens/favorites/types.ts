export interface FavoritesScreenProps {}

export interface FavoritesScreenState {
  refreshing: boolean;
}

export interface FavoriteItemProps {
  item: FavoriteEvent;
  onPress: (favorite: FavoriteEvent) => void;
  onRemove: (favorite: FavoriteEvent) => void;
}

export interface FavoriteEvent {
  eventId: string;
  eventData: {
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
        address?: {
          line1?: string;
        };
        city?: { name: string };
        state?: { name: string };
      }>;
    };
    priceRanges?: Array<{
      min: number;
      max: number;
      currency: string;
    }>;
  };
  addedAt: number;
}
