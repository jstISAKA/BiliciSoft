export interface MediaContent {
  id: string;
  title: string;
  type: 'movie' | 'series';
  year: number;
  status: 'watching' | 'completed' | 'planned';
  platform?: 'netflix' | 'prime' | 'disney' | 'hbo' | 'apple' | 'mubi' | 'blutv' | 'exxen' | 'other';
  posterUrl?: string;
  rating?: number;
  personalRating?: {
    story?: number;
    acting?: number;
    visuals?: number;
    sound?: number;
  };
  tags?: string[];
  mood?: 'happy' | 'sad' | 'excited' | 'bored' | 'confused';
  watchDate?: string;
  releaseYear?: number;
} 