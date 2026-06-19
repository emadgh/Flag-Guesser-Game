export type GameMode = 'SELECTIVE' | 'REVERSE' | 'WRITE';
export type Difficulty = 1 | 2 | 3 | 4;

export interface ScoreEntry {
  id: string;
  playerName: string;
  score: number;
  mode: GameMode;
  difficulty: Difficulty;
  date: number;
}

export type GameState = 'MENU' | 'PLAYING' | 'GAME_OVER' | 'LEADERBOARD' | 'SETTINGS';
