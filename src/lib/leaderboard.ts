import { ScoreEntry } from '../types';

const LEADERBOARD_KEY = 'flag_game_leaderboard';

export const getLeaderboard = (): ScoreEntry[] => {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse leaderboard', e);
  }
  return [];
};

export const addScore = (entry: Omit<ScoreEntry, 'id' | 'date'>) => {
  const current = getLeaderboard();
  const newEntry: ScoreEntry = {
    ...entry,
    id: Math.random().toString(36).substring(2, 9),
    date: Date.now(),
  };
  
  const updated = [...current, newEntry].sort((a, b) => b.score - a.score).slice(0, 50); // Keep top 50
  
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save score', e);
  }
};
