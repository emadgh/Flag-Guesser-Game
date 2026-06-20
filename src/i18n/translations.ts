export type Language = 'en' | 'fa';

export interface Translations {
  // Main Menu
  title: string;
  subtitle: string;
  selectDifficulty: string;
  easy: string;
  med: string;
  hard: string;
  hardcore: string;

  // Game Modes
  selectiveMode: string;
  selectiveDesc: string;
  reverseMode: string;
  reverseDesc: string;
  writeMode: string;
  writeDesc: string;

  // Game View
  score: string;
  streak: string;
  lives: string;
  time: string;
  guess: string;
  typeCountryName: string;

  // Game Over
  gameOver: string;
  finalScore: string;
  menu: string;
  playAgain: string;

  // Settings
  settings: string;
  playerName: string;
  enterName: string;
  soundEffects: string;
  soundDesc: string;
  uiScale: string;
  uiScaleDesc: string;
  language: string;
  done: string;

  // Statistics
  statistics: string;
  noStats: string;
  rights: string;
  wrongs: string;
  win: string;
  mastered: string;

  // Leaderboard
  leaderboard: string;
  noScores: string;

  // Misc
  settingsTitle: string;
}

const en: Translations = {
  title: 'Flag Guesser',
  subtitle: 'Test your geography knowledge',
  selectDifficulty: 'Select Difficulty',
  easy: 'EASY',
  med: 'MED',
  hard: 'HARD',
  hardcore: 'HARDCORE',

  selectiveMode: 'Selective Mode',
  selectiveDesc: 'See the flag, pick from 4 choices.',
  reverseMode: 'Reverse Mode',
  reverseDesc: 'See the name, pick the flag.',
  writeMode: 'Write Mode',
  writeDesc: 'See the flag, type the exact name.',

  score: 'Score',
  streak: 'Streak',
  lives: 'Lives',
  time: 'Time',
  guess: 'Guess',
  typeCountryName: 'Type country name...',

  gameOver: 'GAME OVER',
  finalScore: 'Final Score',
  menu: 'Menu',
  playAgain: 'Play Again',

  settings: 'Settings',
  playerName: 'Player Name',
  enterName: 'Enter name...',
  soundEffects: 'Sound Effects',
  soundDesc: 'Game audio and feedback',
  uiScale: 'UI Scale',
  uiScaleDesc: 'Adjust game screen size',
  language: 'Language',
  done: 'Done',

  statistics: 'Statistics',
  noStats: 'No statistics yet. Play to gather data!',
  rights: 'Rights',
  wrongs: 'Wrongs',
  win: 'Win',
  mastered: 'Mastered',

  leaderboard: 'Leaderboard',
  noScores: 'No scores yet. Play a game to be the first!',

  settingsTitle: 'Settings',
};

const fa: Translations = {
  title: 'پرچم شناس',
  subtitle: 'دانش جغرافیای خود را بسنجید',
  selectDifficulty: 'انتخاب سختی',
  easy: 'آسان',
  med: 'متوسط',
  hard: 'سخت',
  hardcore: 'حرفه\u200cای',

  selectiveMode: 'حالت انتخابی',
  selectiveDesc: 'پرچم را ببینید، از 4 گزینه انتخاب کنید.',
  reverseMode: 'حالت معکوس',
  reverseDesc: 'نام را ببینید، پرچم را انتخاب کنید.',
  writeMode: 'حالت نوشتن',
  writeDesc: 'پرچم را ببینید، نام دقیق را تایپ کنید.',

  score: 'امتیاز',
  streak: 'پیاپی',
  lives: 'جان\u200cها',
  time: 'زمان',
  guess: 'حدس',
  typeCountryName: 'نام کشور را تایپ کنید...',

  gameOver: 'پایان بازی',
  finalScore: 'امتیاز نهایی',
  menu: 'منو',
  playAgain: 'بازی مجدد',

  settings: 'تنظیمات',
  playerName: 'نام بازیکن',
  enterName: 'نام را وارد کنید...',
  soundEffects: 'افکت\u200cهای صوتی',
  soundDesc: 'صدا و بازخورد بازی',
  uiScale: 'اندازه رابط کاربری',
  uiScaleDesc: 'تنظیم اندازه صفحه بازی',
  language: 'زبان',
  done: 'تأیید',

  statistics: 'آمار',
  noStats: 'هنوز آماری موجود نیست. بازی کنید تا داده جمع شود!',
  rights: 'درست',
  wrongs: 'غلط',
  win: 'برد',
  mastered: 'تسلط',

  leaderboard: 'تالار افتخار',
  noScores: 'هنوز امتیازی ثبت نشده. بازی کنید تا اولین نفر باشید!',

  settingsTitle: 'تنظیمات',
};

export const translations: Record<Language, Translations> = { en, fa };
