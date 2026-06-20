import { useState, useEffect, useCallback, useRef } from 'react';
import { GameMode, GameState, Difficulty } from '../types';
import { UNIQUE_COUNTRIES, Country, getFlagUrl } from '../data/countries';
import { audioManager } from '../lib/audio';
import { addScore } from '../lib/leaderboard';
import { recordStat, getMasteredCodes } from '../lib/statistics';

const STARTING_TIME = 15;

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [mode, setMode] = useState<GameMode>('SELECTIVE');
  const [difficulty, setDifficulty] = useState<Difficulty>(2);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(3);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(STARTING_TIME);
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [playerName, setPlayerNameState] = useState(() => {
    try {
      return localStorage.getItem('flag_guesser_player') || 'Player';
    } catch (e) {
      return 'Player';
    }
  });
  
  // feedback visual state
  const [feedback, setFeedback] = useState<'NONE' | 'CORRECT' | 'WRONG'>('NONE');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const setPlayerName = useCallback((name: string) => {
    setPlayerNameState(name);
    try {
      localStorage.setItem('flag_guesser_player', name);
    } catch (e) {}
  }, []);
  
  const recentCountries = useRef<string[]>([]);

  const generateQuestion = useCallback(async (forcedMode?: GameMode, forcedDifficulty?: Difficulty) => {
    const activeMode = forcedMode || mode;
    const activeDiff = forcedDifficulty || difficulty;
    const mastered = getMasteredCodes();

    let targetRank = 1;
    const r = Math.random();
    
    // Easy: 80% rank 1, 20% rank 2
    if (activeDiff === 1) {
      targetRank = r < 0.8 ? 1 : 2;
    } 
    // Medium: 40% rank 1, 60% rank 2
    else if (activeDiff === 2) {
      targetRank = r < 0.4 ? 1 : 2;
    }
    // Hard: 20% rank 1, 40% rank 2, 40% rank 3
    else if (activeDiff === 3) {
      if (r < 0.2) targetRank = 1;
      else if (r < 0.6) targetRank = 2;
      else targetRank = 3;
    }
    // Hardcore: 20% rank 2, 80% rank 3
    else {
      targetRank = r < 0.2 ? 2 : 3;
    }

    let basePool = UNIQUE_COUNTRIES.filter(c => c.difficulty === targetRank && !mastered.has(c.code));
    if (basePool.length < 4) basePool = UNIQUE_COUNTRIES.filter(c => !mastered.has(c.code));
    if (basePool.length < 4) basePool = UNIQUE_COUNTRIES; // safety fallback

    // Filter out recently asked countries to prevent repetition
    const availablePool = basePool.filter(c => !recentCountries.current.includes(c.code));
    const poolToUse = availablePool.length >= 4 ? availablePool : basePool;

    // Pick 1 correct
    const shuffledPool = [...poolToUse].sort(() => 0.5 - Math.random());
    const correct = shuffledPool[0];

    // Pick 3 wrong
    const otherOptions = basePool.filter(c => c.code !== correct.code).sort(() => 0.5 - Math.random());
    const selected = [correct, ...otherOptions.slice(0, 3)];
    
    // Sort options randomly
    const finalOptions = [...selected].sort(() => 0.5 - Math.random());
    
    // Update history (keep last 10)
    recentCountries.current = [correct.code, ...recentCountries.current].slice(0, 10);
    
    // Preload images
    await Promise.all(finalOptions.map(opt => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = getFlagUrl(opt.code);
      });
    }));
    
    setCurrentCountry(correct);
    setOptions(finalOptions);
    setTimeLeft(STARTING_TIME);
    setFeedback('NONE');
    setSelectedAnswer(null);
  }, [mode, difficulty]);

  const startGame = useCallback((selectedMode: GameMode, selectedDifficulty: Difficulty) => {
    setMode(selectedMode);
    setDifficulty(selectedDifficulty);
    setScore(0);
    setHealth(3);
    setStreak(0);
    setGameState('PLAYING');
    recentCountries.current = [];
    generateQuestion(selectedMode, selectedDifficulty);
  }, [generateQuestion]);

  const handleGameOver = useCallback(() => {
    setGameState('GAME_OVER');
    if (score > 0) {
      addScore({
        playerName,
        mode,
        difficulty,
        score
      });
    }
  }, [score, playerName, mode, difficulty]);

  // Timer logic
  useEffect(() => {
    if (gameState !== 'PLAYING' || feedback !== 'NONE') return;

    if (timeLeft <= 0) {
      if (currentCountry) {
        recordStat(currentCountry.code, false);
      }
      setStreak(0);
      audioManager.playIncorrect();
      setFeedback('WRONG');
      if (health > 1) {
        setHealth(h => h - 1);
        setTimeout(() => generateQuestion(), 1500);
      } else {
        setHealth(0);
        setTimeout(() => handleGameOver(), 1500);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    if (timeLeft <= 5 && timeLeft > 0) {
       audioManager.playTick();
    }

    return () => clearInterval(timer);
  }, [gameState, feedback, timeLeft, health, currentCountry, generateQuestion, handleGameOver]);

  const submitAnswer = useCallback((answer: string) => {
    if (feedback !== 'NONE' || gameState !== 'PLAYING') return;

    setSelectedAnswer(answer);
    
    const isCorrect = currentCountry?.name.toLowerCase() === answer.toLowerCase();
    
    if (currentCountry) {
      recordStat(currentCountry.code, isCorrect);
    }
    
    if (isCorrect) {
      setStreak(s => s + 1);
      audioManager.playCorrect();
      setFeedback('CORRECT');
      setScore(s => s + 10 + timeLeft); // bonus points for speed
      
      setTimeout(() => {
        generateQuestion();
      }, 1000); // 1s delay before next
    } else {
      setStreak(0);
      audioManager.playIncorrect();
      setFeedback('WRONG');
      if (health > 1) {
        setHealth(h => h - 1);
        setTimeout(() => {
          generateQuestion();
        }, 1500);
      } else {
        setHealth(0);
        setTimeout(() => {
          handleGameOver();
        }, 1500);
      }
    }
  }, [feedback, gameState, currentCountry, timeLeft, health, generateQuestion, handleGameOver]);


  return {
    gameState,
    setGameState,
    mode,
    difficulty,
    score,
    health,
    streak,
    timeLeft,
    currentCountry,
    options,
    playerName,
    setPlayerName,
    feedback,
    selectedAnswer,
    startGame,
    submitAnswer
  };
};
