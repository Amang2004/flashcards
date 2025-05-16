import React, { useState } from 'react';
import { Deck, Card } from '../types';
import { getDueCards } from '../utils/spacedRepetition';

interface DeckManagerProps {
  decks: Deck[];
  cards: Card[];
  onDeckCreate: (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeckUpdate: (deck: Deck) => void;
  onDeckDelete: (deckId: string) => void;
}

export function DeckManager({ decks, cards, onDeckCreate, onDeckUpdate, onDeckDelete }: DeckManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');

  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    onDeckCreate({
      name: newDeckName,
      description: newDeckDescription,
    });
    setNewDeckName('');
    setNewDeckDescription('');
    setIsCreating(false);
  };

  const getDeckStats = (deckId: string) => {
    const deckCards = cards.filter(card => card.deckId === deckId);
    const dueCards = getDueCards(deckCards);
    const masteredCards = deckCards.filter(card => card.repetitions >= 5).length;

    return {
      totalCards: deckCards.length,
      dueToday: dueCards.length,
      masteredCards,
    };
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Decks</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Create New Deck
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateDeck} className="mb-6 p-4 bg-white rounded-lg shadow">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Deck Name</label>
            <input
              type="text"
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={newDeckDescription}
              onChange={(e) => setNewDeckDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.map(deck => {
          const stats = getDeckStats(deck.id);
          return (
            <div key={deck.id} className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-2">{deck.name}</h2>
              <p className="text-gray-600 mb-4">{deck.description}</p>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <div className="font-medium">Total</div>
                  <div>{stats.totalCards}</div>
                </div>
                <div>
                  <div className="font-medium">Due Today</div>
                  <div>{stats.dueToday}</div>
                </div>
                <div>
                  <div className="font-medium">Mastered</div>
                  <div>{stats.masteredCards}</div>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => onDeckUpdate(deck)}
                  className="px-3 py-1 text-blue-500 hover:text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeckDelete(deck.id)}
                  className="px-3 py-1 text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 