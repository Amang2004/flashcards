import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Card, Deck } from './types';
import { CardViewer } from './components/CardViewer';
import { DeckManager } from './components/DeckManager';
import { FlashcardEditor } from './components/FlashcardEditor';
import { StatsDashboard } from './components/StatsDashboard';
import { getDueCards, shuffleArray } from './utils/spacedRepetition';

function App() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [currentDeckId, setCurrentDeckId] = useState<string | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedDecks = localStorage.getItem('decks');
    const savedCards = localStorage.getItem('cards');
    
    if (savedDecks) setDecks(JSON.parse(savedDecks));
    if (savedCards) setCards(JSON.parse(savedCards));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('decks', JSON.stringify(decks));
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [decks, cards]);

  const handleDeckCreate = (deckData: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDeck: Deck = {
      ...deckData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDecks([...decks, newDeck]);
  };

  const handleDeckUpdate = (updatedDeck: Deck) => {
    setDecks(decks.map(deck => 
      deck.id === updatedDeck.id 
        ? { ...updatedDeck, updatedAt: new Date().toISOString() }
        : deck
    ));
  };

  const handleDeckDelete = (deckId: string) => {
    setDecks(decks.filter(deck => deck.id !== deckId));
    setCards(cards.filter(card => card.deckId !== deckId));
  };

  const handleCardCreate = (cardData: Omit<Card, 'id' | 'nextReviewDate' | 'repetitions' | 'interval' | 'ease'>) => {
    const newCard: Card = {
      ...cardData,
      id: uuidv4(),
      nextReviewDate: new Date().toISOString(),
      repetitions: 0,
      interval: 1,
      ease: 2.5,
    };
    setCards([...cards, newCard]);
  };

  const handleCardUpdate = (updatedCard: Card) => {
    setCards(cards.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    ));
  };

  const handleCardReview = (updatedCard: Card) => {
    handleCardUpdate(updatedCard);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex items-center px-4 text-gray-900 hover:text-gray-600">
                  Flashcards
                </Link>
                <Link to="/stats" className="flex items-center px-4 text-gray-900 hover:text-gray-600">
                  Statistics
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={
              <DeckManager
                decks={decks}
                cards={cards}
                onDeckCreate={handleDeckCreate}
                onDeckUpdate={handleDeckUpdate}
                onDeckDelete={handleDeckDelete}
              />
            } />
            <Route path="/deck/:deckId" element={
              <div>
                {currentDeckId && (
                  <>
                    <div className="mb-4">
                      <FlashcardEditor
                        deckId={currentDeckId}
                        onSave={handleCardCreate}
                        onCancel={() => setCurrentDeckId(null)}
                      />
                    </div>
                    <div>
                      {(() => {
                        const dueCards = getDueCards(cards.filter(card => card.deckId === currentDeckId));
                        const shuffledCards = shuffleArray(dueCards);
                        return shuffledCards.length > 0 ? (
                          <CardViewer
                            card={shuffledCards[0]}
                            onReview={handleCardReview}
                          />
                        ) : (
                          <p className="text-center text-gray-600">No cards due for review!</p>
                        );
                      })()}
                    </div>
                  </>
                )}
              </div>
            } />
            <Route path="/stats" element={<StatsDashboard cards={cards} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 