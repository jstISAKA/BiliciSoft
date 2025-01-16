export interface MediaContent {
  id: string;
  title: string;
  type: 'movie' | 'series';
  status: 'watching' | 'completed' | 'planned';
  year: number;
  rating?: number;
  personalRating?: {
    acting: number;
    story: number;
    visual: number;
    sound: number;
  };
  review?: string;
  mood?: 'happy' | 'sad' | 'excited' | 'bored' | 'confused';
  watchDate?: Date;
  director?: string;
  cast?: string[];
  tags?: string[];
  posterUrl?: string;
  bannerUrl?: string;
  description?: string;
  personalNotes?: string;
  favorite?: boolean;
  recommendTo?: string[];
  platform?: string;
  seasonCount?: number;
  episodeCount?: number;
  currentEpisode?: number;
  language?: string;
  duration?: number; // dakika cinsinden
} 