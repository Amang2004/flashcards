# Flashcard App with Spaced Repetition

A modern flashcard application built with React, TypeScript, and Tailwind CSS that implements the SM-2 spaced repetition algorithm.

## Features

- Create, edit, and delete flashcard decks
- Add and edit cards within decks
- Interactive card flipping animation
- Spaced repetition system (SM-2 algorithm)
- Statistics dashboard with review history
- Local storage persistence
- Responsive design

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Chart.js
- React Router
- UUID

## Project Structure

- `src/components/` - React components
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions (spaced repetition logic)
- `src/App.tsx` - Main application component
- `src/index.css` - Global styles

## Spaced Repetition Algorithm

The app uses a simplified version of the SM-2 algorithm for spaced repetition:

- New cards are shown immediately
- Correct answers increase the interval and ease factor
- Incorrect answers reset the card to initial state
- Intervals grow exponentially based on the ease factor

## License

MIT 