import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { MainMenu } from './components/MainMenu';
import { GameView } from './components/GameView';
import { LeaderboardView } from './components/LeaderboardView';
import { GameOverView } from './components/GameOverView';
import { Aurora } from './components/Aurora';
import { SpotlightCard } from './components/SpotlightCard';
import { SettingsModal } from './components/SettingsModal';
import { FlagOrbitSystem } from './components/FlagOrbitSystem';

import { StatsModal } from './components/StatsModal';

export default function App() {
  const {
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
  } = useGameState();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-black text-white selection:bg-indigo-500/30 overflow-hidden font-sans">
      <Aurora />

      <AnimatePresence>
        {gameState === 'MENU' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <FlagOrbitSystem />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-xl">
        <SpotlightCard className="w-full rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-indigo-900/20 backdrop-blur-2xl border-white/10">
          <AnimatePresence mode="wait">
            {gameState === 'MENU' && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <MainMenu 
                  startGame={startGame} 
                  openLeaderboard={() => setGameState('LEADERBOARD')}
                  openSettings={() => setIsSettingsOpen(true)}
                  openStats={() => setIsStatsOpen(true)}
                  initialDifficulty={difficulty}
                />
              </motion.div>
            )}

            {gameState === 'PLAYING' && (
              <motion.div
                key="playing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <GameView 
                  mode={mode}
                  score={score}
                  health={health}
                  streak={streak}
                  timeLeft={timeLeft}
                  currentCountry={currentCountry}
                  options={options}
                  feedback={feedback}
                  selectedAnswer={selectedAnswer}
                  submitAnswer={submitAnswer}
                  onQuit={() => setGameState('MENU')}
                  openSettings={() => setIsSettingsOpen(true)}
                />
              </motion.div>
            )}

            {gameState === 'GAME_OVER' && (
              <motion.div
                key="gameover"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <GameOverView 
                  score={score}
                  onRetry={() => startGame(mode, difficulty)}
                  onMenu={() => setGameState('MENU')}
                />
              </motion.div>
            )}

            {gameState === 'LEADERBOARD' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <LeaderboardView onBack={() => setGameState('MENU')} />
              </motion.div>
            )}
          </AnimatePresence>
        </SpotlightCard>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        playerName={playerName}
        setPlayerName={setPlayerName}
      />

      <StatsModal 
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
      />
    </div>
  );
}
