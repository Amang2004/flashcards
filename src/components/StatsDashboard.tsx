import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card, ReviewStats } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StatsDashboardProps {
  cards: Card[];
}

export function StatsDashboard({ cards }: StatsDashboardProps) {
  const stats: ReviewStats = {
    totalCards: cards.length,
    dueToday: cards.filter(card => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const reviewDate = new Date(card.nextReviewDate);
      reviewDate.setHours(0, 0, 0, 0);
      return reviewDate <= today;
    }).length,
    masteredCards: cards.filter(card => card.repetitions >= 5).length,
    reviewsByDay: getReviewsByDay(cards),
  };

  const chartData = {
    labels: stats.reviewsByDay.map(item => item.date),
    datasets: [
      {
        label: 'Reviews',
        data: stats.reviewsByDay.map(item => item.count),
        borderColor: 'rgb(138, 92, 245)', // Primary color
        backgroundColor: 'rgba(138, 92, 245, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(209, 213, 219)', // text-gray-300
        }
      },
      title: {
        display: true,
        text: 'Reviews Over Time',
        color: 'rgb(209, 213, 219)', // text-gray-300
        font: {
          size: 16,
          weight: 'bold' as const,
        }
      },
      tooltip: {
        backgroundColor: 'rgb(17, 24, 39)', // bg-dark-800
        titleColor: 'rgb(255, 255, 255)',
        bodyColor: 'rgb(209, 213, 219)',
        borderColor: 'rgb(55, 65, 81)',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(55, 65, 81, 0.3)', // border-dark-700 with opacity
        },
        ticks: {
          color: 'rgb(156, 163, 175)', // text-gray-400
        }
      },
      y: {
        grid: {
          color: 'rgba(55, 65, 81, 0.3)', // border-dark-700 with opacity
        },
        ticks: {
          color: 'rgb(156, 163, 175)', // text-gray-400
        }
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-white flex items-center">
        Statistics Dashboard
        <div className="ml-2 h-0.5 w-12 bg-primary"></div>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-dark-800 rounded-lg shadow border border-dark-700 p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-300">Total Cards</h2>
          <p className="text-4xl font-bold text-primary">{stats.totalCards}</p>
          <p className="text-sm text-gray-400 mt-2">Cards in your collection</p>
        </div>
        <div className="bg-dark-800 rounded-lg shadow border border-dark-700 p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-300">Due Today</h2>
          <p className="text-4xl font-bold text-primary">{stats.dueToday}</p>
          <p className="text-sm text-gray-400 mt-2">Cards waiting for review</p>
        </div>
        <div className="bg-dark-800 rounded-lg shadow border border-dark-700 p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-300">Mastered Cards</h2>
          <p className="text-4xl font-bold text-primary">{stats.masteredCards}</p>
          <p className="text-sm text-gray-400 mt-2">Cards you've learned well</p>
        </div>
      </div>

      <div className="bg-dark-800 rounded-lg shadow border border-dark-700 p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-300">Learning Progress</h2>
        <div className="h-72">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
      
      <div className="mt-8 bg-dark-800 rounded-lg shadow border border-dark-700 p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-300">Spaced Repetition Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-dark-700 rounded-lg">
            <h3 className="text-primary font-semibold mb-2">Efficient Learning</h3>
            <p className="text-gray-400 text-sm">Study smarter, not harder, with optimized review schedules.</p>
          </div>
          <div className="p-4 bg-dark-700 rounded-lg">
            <h3 className="text-primary font-semibold mb-2">Better Retention</h3>
            <p className="text-gray-400 text-sm">Remember more of what you learn for longer periods.</p>
          </div>
          <div className="p-4 bg-dark-700 rounded-lg">
            <h3 className="text-primary font-semibold mb-2">Science-Based</h3>
            <p className="text-gray-400 text-sm">Founded on decades of cognitive science research.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getReviewsByDay(cards: Card[]): { date: string; count: number }[] {
  const reviewsByDay = new Map<string, number>();
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  // Initialize the last 7 days with 0 reviews
  for (let i = 0; i < 7; i++) {
    const date = new Date(lastWeek);
    date.setDate(lastWeek.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    reviewsByDay.set(dateStr, 0);
  }

  // Count reviews for each day
  cards.forEach(card => {
    const reviewDate = new Date(card.nextReviewDate);
    const dateStr = reviewDate.toISOString().split('T')[0];
    if (reviewsByDay.has(dateStr)) {
      reviewsByDay.set(dateStr, (reviewsByDay.get(dateStr) || 0) + 1);
    }
  });

  return Array.from(reviewsByDay.entries())
    .map(([date, count]) => ({
      date,
      count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
} 