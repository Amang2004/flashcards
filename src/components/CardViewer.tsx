import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../types';
import { updateCardReview } from '../utils/spacedRepetition';

interface CardViewerProps {
  card: Card;
  onReview: (updatedCard: Card) => void;
}

export function CardViewer({ card, onReview }: CardViewerProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<'ready' | 'reviewing' | 'completed'>('ready');

  const handleReview = (isCorrect: boolean) => {
    setReviewStatus('reviewing');
    
    // Short delay for animation
    setTimeout(() => {
      const updatedCard = updateCardReview(card, isCorrect);
      onReview(updatedCard);
      setIsFlipped(false);
      setReviewStatus('completed');
      
      // Reset after another short delay
      setTimeout(() => {
        setReviewStatus('ready');
      }, 500);
    }, 300);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Flashcard Review</h2>
        <p className="text-gray-400">Click the card to flip it and reveal the answer</p>
      </div>
      
      <div className="bg-dark-800 rounded-xl p-6 shadow-lg border border-dark-700">
        <motion.div
          className="relative w-full aspect-[4/3] cursor-pointer"
          onClick={() => reviewStatus === 'ready' && setIsFlipped(!isFlipped)}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 30 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front of Card */}
          <div
            className="absolute w-full h-full backface-hidden bg-dark-900 rounded-xl shadow-lg p-8 flex items-center justify-center text-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <h2 className="text-2xl font-semibold text-white">{card.front}</h2>
          </div>
          
          {/* Back of Card */}
          <div
            className="absolute w-full h-full backface-hidden bg-dark-900 rounded-xl shadow-lg p-8 flex items-center justify-center text-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <h2 className="text-2xl font-semibold text-white">{card.back}</h2>
          </div>
        </motion.div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => reviewStatus === 'ready' && handleReview(false)}
            disabled={reviewStatus !== 'ready' || !isFlipped}
            className={`
              px-6 py-3 rounded-lg font-medium transition-colors
              ${isFlipped && reviewStatus === 'ready' 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-dark-700 text-gray-400 cursor-not-allowed'}
            `}
          >
            Don't Know
          </button>
          <button
            onClick={() => reviewStatus === 'ready' && handleReview(true)}
            disabled={reviewStatus !== 'ready' || !isFlipped}
            className={`
              px-6 py-3 rounded-lg font-medium transition-colors
              ${isFlipped && reviewStatus === 'ready' 
                ? 'bg-primary hover:bg-primary-dark text-white' 
                : 'bg-dark-700 text-gray-400 cursor-not-allowed'}
            `}
          >
            Know
          </button>
        </div>
      </div>
      
      <div className="mt-6 text-center text-gray-400 text-sm">
        <p>Repetition: {card.repetitions} · Ease: {card.ease.toFixed(1)} · Interval: {card.interval} days</p>
        <p className="mt-1">Next review: {new Date(card.nextReviewDate).toLocaleDateString()}</p>
      </div>
    </div>
  );
} 