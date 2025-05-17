import React, { useState } from 'react';
import { Deck, Card } from '../types';
import { getDueCards } from '../utils/spacedRepetition';
import { Link } from 'react-router-dom';

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
    
    // Calculate progress percentage
    const progress = deckCards.length > 0 
      ? Math.round((masteredCards / deckCards.length) * 100) 
      : 0;

    return {
      totalCards: deckCards.length,
      dueToday: dueCards.length,
      masteredCards,
      progress
    };
  };

  return (
    <div>
      <div className="fixed inset-0 -z-10">
        <Spline scene="https://prod.spline.design/s4dGA3aanAbp2MmU/scene.splinecode" />
      </div>
      {/* Create New Deck Button */}
      {!isCreating && (
        <div className="mb-6">
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded transition-colors"
          >
            Create New Deck
          </button>
        </div>
      )}

      {/* Create Deck Form */}
      {isCreating && (
        <form onSubmit={handleCreateDeck} className="mb-6 p-4 bg-dark-800 rounded-lg shadow border border-dark-700">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Deck Name</label>
            <input
              type="text"
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              className="w-full p-2 bg-dark-900 border border-dark-700 rounded text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={newDeckDescription}
              onChange={(e) => setNewDeckDescription(e.target.value)}
              className="w-full p-2 bg-dark-900 border border-dark-700 rounded text-white"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {/* Deck Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map(deck => {
          const stats = getDeckStats(deck.id);
          return (
            <div key={deck.id} className="bg-dark-800 rounded-lg shadow border border-dark-700 overflow-hidden">
              {/* Deck Header */}
              <Link to={`/deck/${deck.id}`} className="block hover:bg-dark-700 transition-colors">
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-1 text-white">{deck.name}</h2>
                  <p className="text-gray-400 mb-4">{deck.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="relative pt-1 mb-4">
                    <div className="text-xs text-gray-400 mb-1">Progress</div>
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-dark-700">
                      <div 
                        style={{ width: `${stats.progress}%` }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                      ></div>
                    </div>
                    <div className="text-xs text-right text-gray-400 mt-1">{stats.progress}%</div>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="bg-dark-700 p-2 rounded text-center">
                      <div className="font-medium text-gray-300">Total</div>
                      <div className="text-white font-semibold">{stats.totalCards}</div>
                    </div>
                    <div className="bg-dark-700 p-2 rounded text-center">
                      <div className="font-medium text-gray-300">Due</div>
                      <div className="text-primary font-semibold">{stats.dueToday}</div>
                    </div>
                    <div className="bg-dark-700 p-2 rounded text-center">
                      <div className="font-medium text-gray-300">Reviewed</div>
                      <div className="text-white font-semibold">{stats.masteredCards}</div>
                    </div>
                  </div>
                </div>
              </Link>
              
              {/* Deck Actions */}
              <div className="bg-dark-700 px-4 py-2 flex justify-end gap-2">
                <button
                  onClick={() => onDeckUpdate(deck)}
                  className="px-3 py-1 text-gray-300 hover:text-primary transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeckDelete(deck.id)}
                  className="px-3 py-1 text-gray-300 hover:text-red-500 transition-colors"
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