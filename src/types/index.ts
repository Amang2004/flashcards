export interface Card {
  id: string;
  front: string;
  back: string;
  repetitions: number;
  interval: number;
  ease: number;
  nextReviewDate: string;
  deckId: string;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  totalCards: number;
  dueToday: number;
  masteredCards: number;
  reviewsByDay: { date: string; count: number }[];
} 