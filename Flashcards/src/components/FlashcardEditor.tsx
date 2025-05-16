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
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Front</label>
        <textarea
          value={front}
          onChange={(e) => setFront(e.target.value)}
          className="w-full p-2 border rounded"
          rows={4}
          required
          placeholder="Enter the question or term"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Back</label>
        <textarea
          value={back}
          onChange={(e) => setBack(e.target.value)}
          className="w-full p-2 border rounded"
          rows={4}
          required
          placeholder="Enter the answer or definition"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {card ? 'Update' : 'Create'} Card
        </button>
      </div>
    </form>
  );
} 