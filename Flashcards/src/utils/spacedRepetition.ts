import { Card } from '../types';

export function updateCardReview(card: Card, isCorrect: boolean): Card {
  const updatedCard = { ...card };
  
  if (!isCorrect) {
    updatedCard.repetitions = 0;
    updatedCard.interval = 1;
    updatedCard.ease = 2.5;
  } else {
    updatedCard.repetitions += 1;
    updatedCard.ease = Math.max(1.3, updatedCard.ease + 0.1);
    updatedCard.interval = Math.round(updatedCard.interval * updatedCard.ease);
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + updatedCard.interval);
  updatedCard.nextReviewDate = nextReview.toISOString();
  
  return updatedCard;
}

export function getDueCards(cards: Card[]): Card[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return cards.filter(card => {
    const reviewDate = new Date(card.nextReviewDate);
    reviewDate.setHours(0, 0, 0, 0);
    return reviewDate <= today;
  });
}

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
} 