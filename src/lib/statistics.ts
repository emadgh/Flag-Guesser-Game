export interface CountryStats {
  correct: number;
  wrong: number;
}

export interface SetupStats {
  [countryCode: string]: CountryStats;
}

const STATS_KEY = 'flag_guesser_stats';

export const getStats = (): SetupStats => {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stats');
    return {};
  }
};

export const recordStat = (countryCode: string, isCorrect: boolean) => {
  try {
    const stats = getStats();
    if (!stats[countryCode]) {
      stats[countryCode] = { correct: 0, wrong: 0 };
    }
    if (isCorrect) {
      stats[countryCode].correct++;
    } else {
      stats[countryCode].wrong++;
    }
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats', e);
  }
};
