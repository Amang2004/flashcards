import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Card, Deck } from './types';
import { CardViewer } from './components/CardViewer';
import { DeckManager } from './components/DeckManager';
import { FlashcardEditor } from './components/FlashcardEditor';
import { StatsDashboard } from './components/StatsDashboard';
import { getDueCards, shuffleArray } from './utils/spacedRepetition';
import { motion } from 'framer-motion';
import Background from './components/Background';

// Moon icon for dark mode toggle
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

function App() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [currentDeckId, setCurrentDeckId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'due' | 'created'>('name');
  const [showHero, setShowHero] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedDecks = localStorage.getItem('decks');
    const savedCards = localStorage.getItem('cards');
    
    if (savedDecks) setDecks(JSON.parse(savedDecks));
    if (savedCards) setCards(JSON.parse(savedCards));
    
    // If no decks exist, create some sample decks
    if (!savedDecks || JSON.parse(savedDecks).length === 0) {
      createSampleDecks();
    }

    // Auto-hide hero after 3 seconds on first visit
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      localStorage.setItem('hasVisited', 'true');
      setTimeout(() => {
        setShowHero(false);
      }, 3000);
    } else {
      // For returning visitors, show briefly and hide
      setTimeout(() => {
        setShowHero(false);
      }, 1500);
    }
  }, []);

  // Function to create sample decks for demo purposes
  const createSampleDecks = () => {
    const sampleDecks = [
      {
        id: uuidv4(),
        name: "Spanish Basics",
        description: "Essential Spanish vocabulary for beginners",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: "JavaScript Fundamentals",
        description: "Core JavaScript concepts and syntax",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: "React Hooks",
        description: "Modern React hooks and their usage",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    setDecks(sampleDecks);
    localStorage.setItem('decks', JSON.stringify(sampleDecks));
    
    // Create 5 sample cards for each deck
    const sampleCards: Card[] = [];
    sampleDecks.forEach(deck => {
      const deckCards = [
        createSampleCard("Sample Front 1", "Sample Back 1", deck.id),
        createSampleCard("Sample Front 2", "Sample Back 2", deck.id),
        createSampleCard("Sample Front 3", "Sample Back 3", deck.id),
        createSampleCard("Sample Front 4", "Sample Back 4", deck.id),
        createSampleCard("Sample Front 5", "Sample Back 5", deck.id),
      ];
      sampleCards.push(...deckCards);
    });
    
    setCards(sampleCards);
    localStorage.setItem('cards', JSON.stringify(sampleCards));
  };
  
  const createSampleCard = (front: string, back: string, deckId: string): Card => {
    return {
      id: uuidv4(),
      front,
      back,
      deckId,
      repetitions: 0,
      interval: 1,
      ease: 2.5,
      nextReviewDate: new Date().toISOString(),
    };
  };

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
      <Background />
      {/* Full-screen hero section with graffiti styling */}
      {showHero && (
        <motion.div 
          className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full h-full absolute">
            <div className="absolute left-0 top-0 w-1/3 h-1/3 rounded-full bg-gray-800 blur-[120px] opacity-40"></div>
            <div className="absolute right-0 top-0 w-1/2 h-1/2 rounded-full bg-gray-700 blur-[120px] opacity-30"></div>
            <div className="absolute left-1/4 bottom-1/4 w-1/3 h-1/3 rounded-full bg-gray-700 blur-[100px] opacity-30"></div>
          </div>
          
          <motion.div 
            className="relative z-10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-8xl font-bold text-white mb-2 font-['Arial'] tracking-tighter transform -skew-x-6 italic">
              <span className="text-primary">SRIDDA</span>
            </h1>
          </motion.div>
          
          <motion.button
            className="mt-8 px-6 py-3 bg-primary rounded-full text-white text-lg font-medium hover:bg-primary-dark transition-colors duration-300 relative z-10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            onClick={() => setShowHero(false)}
          >
            Generate
          </motion.button>
        </motion.div>
      )}

      <div className="min-h-screen bg-dark-900 text-white">
        {/* Regular Header */}
        <header className="py-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Spaced Repetition Flashcards</h1>
          <p className="text-gray-400">Learn efficiently with science-based memory techniques</p>
        </header>

        {/* Navigation Bar */}
        <nav className="border-b border-dark-700 mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex items-center px-4 text-gray-300 hover:text-primary transition-colors">
                  Decks
                </Link>
                <Link to="/stats" className="flex items-center px-4 text-gray-300 hover:text-primary transition-colors">
                  Statistics
                </Link>
              </div>
              <div className="flex items-center">
                <button className="p-2 rounded-full text-gray-300 hover:text-primary">
                  <MoonIcon />
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold flex items-center">
                    Select a Deck to Study
                    <div className="ml-2 h-0.5 w-12 bg-primary"></div>
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Sort:</span>
                    <select 
                      className="bg-dark-800 border border-dark-700 rounded text-white px-3 py-1"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                    >
                      <option value="name">Default</option>
                      <option value="due">Due Cards</option>
                      <option value="created">Recently Added</option>
                    </select>
                  </div>
                </div>
                <DeckManager
                  decks={decks}
                  cards={cards}
                  onDeckCreate={handleDeckCreate}
                  onDeckUpdate={handleDeckUpdate}
                  onDeckDelete={handleDeckDelete}
                />
              </div>
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
                          <p className="text-center text-gray-400">No cards due for review!</p>
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
        
        {/* Footer */}
        <footer className="mt-12 py-6 text-center text-gray-500 text-sm">
          <p>Powered by spaced repetition - the scientifically proven method for efficient learning</p>
        </footer>
      </div>
    </Router>
  );
}

export default App; 