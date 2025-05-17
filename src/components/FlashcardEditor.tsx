import React, { useState } from 'react';
import { Card } from '../types';

interface FlashcardEditorProps {
  deckId: string;
  card?: Card;
  onSave: (card: Omit<Card, 'id' | 'nextReviewDate' | 'repetitions' | 'interval' | 'ease'>) => void;
  onCancel: () => void;
}

export function FlashcardEditor({ deckId, card, onSave, onCancel }: FlashcardEditorProps) {
  const [front, setFront] = useState(card?.front || '');
  const [back, setBack] = useState(card?.back || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      front,
      back,
      deckId,
    });

    // Clear form after submission
    setFront('');
    setBack('');
  };

  return (
    <div className="bg-dark-800 rounded-lg shadow border border-dark-700 p-6 mb-8">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        {card ? 'Edit Card' : 'Create New Card'}
        <div className="ml-2 h-0.5 w-8 bg-primary"></div>
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Front (Question)</label>
          <textarea
            value={front}
            onChange={(e) => setFront(e.target.value)}
            className="w-full p-3 bg-dark-900 border border-dark-700 rounded text-white focus:ring-1 focus:ring-primary focus:border-primary"
            rows={4}
            required
            placeholder="Enter the question or term"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-1">Back (Answer)</label>
          <textarea
            value={back}
            onChange={(e) => setBack(e.target.value)}
            className="w-full p-3 bg-dark-900 border border-dark-700 rounded text-white focus:ring-1 focus:ring-primary focus:border-primary"
            rows={4}
            required
            placeholder="Enter the answer or definition"
          />
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded transition-colors"
          >
            {card ? 'Update' : 'Create'} Card
          </button>
        </div>
      </form>
    </div>
  );
} 