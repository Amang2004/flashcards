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
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Reviews Over Time',
      },
    },
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Statistics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Total Cards</h2>
          <p className="text-3xl font-bold text-blue-500">{stats.totalCards}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Due Today</h2>
          <p className="text-3xl font-bold text-orange-500">{stats.dueToday}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Mastered Cards</h2>
          <p className="text-3xl font-bold text-green-500">{stats.masteredCards}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <Line data={chartData} options={chartOptions} />
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

  return Array.from(reviewsByDay.entries()).map(([date, count]) => ({
    date,
    count,
  }));
} 