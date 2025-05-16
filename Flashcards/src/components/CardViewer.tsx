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

  const handleReview = (isCorrect: boolean) => {
    const updatedCard = updateCardReview(card, isCorrect);
    onReview(updatedCard);
    setIsFlipped(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <motion.div
        className="relative w-full aspect-[4/3] cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute w-full h-full backface-hidden bg-white rounded-xl shadow-lg p-8 flex items-center justify-center text-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <h2 className="text-2xl font-semibold">{card.front}</h2>
        </div>
        <div
          className="absolute w-full h-full backface-hidden bg-white rounded-xl shadow-lg p-8 flex items-center justify-center text-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <h2 className="text-2xl font-semibold">{card.back}</h2>
        </div>
      </motion.div>

      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={() => handleReview(false)}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Don't Know
        </button>
        <button
          onClick={() => handleReview(true)}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Know
        </button>
      </div>
    </div>
  );
} 