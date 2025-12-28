export interface Movie {
  id: string;
  title: string;
  description: string;
  poster: string;
  banner?: string;
  videoUrl?: string;
  trailerUrl?: string;
  rating: number;
  year: number;
  duration: string;
  category: string;
  genres?: string[];
  featured?: boolean;
  maturityRating?: string;
  matchPercentage?: number;
}

export type Category = 'action' | 'drama' | 'comedy' | 'thriller' | 'horror' | 'sci-fi' | 'romance';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  subscriptionStatus: 'active' | 'inactive' | 'expired';
  subscriptionPlan?: SubscriptionPlan;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
}
