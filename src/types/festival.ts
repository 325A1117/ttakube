export interface StageAct {
  id: string;
  title: string;
  artist: string;
  category: 'Band' | 'Dance' | 'DJ / Vocal' | 'Special Ceremony';
  day: 1 | 2;
  startTime: string;
  endTime: string;
  stageName: string;
  description: string;
  highlight: string;
  image?: string;
  setlist?: string[];
}

export interface ExhibitItem {
  id: string;
  title: string;
  organizer: string;
  category: 'Digital Tech' | 'Art & Media' | 'Game & Attraction' | 'Experience';
  location: string;
  waitTimeMins: number;
  description: string;
  highlight: string;
  image?: string;
  tags: string[];
}

export interface FoodStall {
  id: string;
  name: string;
  organizer: string;
  price: number;
  locationArea: 'North Gate Plaza' | 'Central Courtyard' | 'East Gym Alley';
  description: string;
  isPopular?: boolean;
  status: 'In Stock' | 'Crowded' | 'Sold Out';
}

export interface LyricLine {
  timeSec: number;
  text: string;
  subtext?: string;
}
