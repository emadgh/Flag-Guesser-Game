import { motion } from 'motion/react';
import React, { useState } from 'react';
import { GameMode, Difficulty } from '../types';
import { BlurText } from './BlurText';
import { Settings, Trophy, BarChart2 } from 'lucide-react';
import { SpotlightButton } from './SpotlightButton';
import { useI18n } from '../i18n';

interface MainMenuProps {
  startGame: (mode: GameMode, difficulty: Difficulty) => void;
  openLeaderboard: () => void;
  openSettings: () => void;
  openStats: () => void;
  initialDifficulty: Difficulty;
}

export const MainMenu: React.FC<MainMenuProps> = ({ 
  startGame, 
  openLeaderboard,
  openSettings,
  openStats,
  initialDifficulty
}) => {
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const { t, dir } = useI18n();
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[400px]">
      <div className="w-full flex justify-end gap-3 mb-6 relative z-20">
        <SpotlightButton 
          onClick={openStats}
          className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-colors"
          title="Statistics"
        >
          <BarChart2 size={20} />
        </SpotlightButton>
        <SpotlightButton 
          onClick={openLeaderboard}
          className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-colors"
          title="Leaderboard"
        >
          <Trophy size={20} />
        </SpotlightButton>
        <SpotlightButton 
          onClick={openSettings}
          className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-colors"
          title="Settings"
        >
          <Settings size={20} />
        </SpotlightButton>
      </div>

      <div className="mb-10 text-center relative z-20">
        <BlurText 
          text="Flag Guesser" 
          delay={50} 
          animateBy="letters" 
          direction="top" 
          className="text-4xl sm:text-5xl font-black text-white tracking-tight justify-center border-white/5"
        />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-zinc-400 mt-3 font-medium text-sm sm:text-base"
        >
          {t.subtitle}
        </motion.p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full space-y-3 relative z-20"
      >
        <div className="flex flex-col gap-2 mb-6">
          <label className="text-zinc-400 text-sm font-medium uppercase tracking-wider text-center">{t.selectDifficulty}</label>
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 relative shadow-inner overflow-hidden">
            <motion.div 
              className="absolute top-1 bottom-1 left-0 rounded-lg"
              initial={false}
              animate={{
                width: '25%',
                x: dir === 'rtl'
                  ? `${(4 - difficulty) * 100}%`
                  : `${(difficulty - 1) * 100}%`,
                backgroundColor: difficulty === 1 ? '#10b981' : difficulty === 2 ? '#f59e0b' : difficulty === 3 ? '#f43f5e' : '#a855f7'
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button 
              onClick={() => setDifficulty(1)} 
              className={`flex-1 py-1 sm:py-2 text-[11px] sm:text-xs font-bold z-10 transition-colors ${difficulty === 1 ? 'text-black' : 'text-zinc-500'}`}
            >
              {t.easy}
            </button>
            <button 
              onClick={() => setDifficulty(2)} 
              className={`flex-1 py-1 sm:py-2 text-[11px] sm:text-xs font-bold z-10 transition-colors ${difficulty === 2 ? 'text-black' : 'text-zinc-500'}`}
            >
              {t.med}
            </button>
            <button 
              onClick={() => setDifficulty(3)} 
              className={`flex-1 py-1 sm:py-2 text-[11px] sm:text-xs font-bold z-10 transition-colors ${difficulty === 3 ? 'text-white' : 'text-zinc-500'}`}
            >
              {t.hard}
            </button>
            <button 
              onClick={() => setDifficulty(4)} 
              className={`flex-1 py-1 sm:py-2 text-[11px] sm:text-xs font-bold z-10 transition-colors ${difficulty === 4 ? 'text-white' : 'text-zinc-500'}`}
            >
              {t.hardcore}
            </button>
          </div>
        </div>

        <SpotlightButton 
          variants={item}
          onClick={() => startGame('SELECTIVE', difficulty)}
          className="w-full p-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-start shadow-lg"
          spotlightColor="rgba(99, 102, 241, 0.25)"
        >
          <div className="flex flex-col items-start w-full pointer-events-auto">
            <h3 className="text-xl font-bold text-white mb-1">{t.selectiveMode}</h3>
            <p className="text-zinc-500 text-sm font-medium">{t.selectiveDesc}</p>
          </div>
        </SpotlightButton>

        <SpotlightButton 
          variants={item}
          onClick={() => startGame('REVERSE', difficulty)}
          className="w-full p-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-start shadow-lg"
          spotlightColor="rgba(244, 63, 94, 0.25)"
        >
          <div className="flex flex-col items-start w-full pointer-events-auto">
            <h3 className="text-xl font-bold text-white mb-1">{t.reverseMode}</h3>
            <p className="text-zinc-500 text-sm font-medium">{t.reverseDesc}</p>
          </div>
        </SpotlightButton>

        <SpotlightButton 
          variants={item}
          onClick={() => startGame('WRITE', difficulty)}
          className="w-full p-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-start shadow-lg"
          spotlightColor="rgba(16, 185, 129, 0.25)"
        >
          <div className="flex flex-col items-start w-full pointer-events-auto">
            <h3 className="text-xl font-bold text-white mb-1">{t.writeMode}</h3>
            <p className="text-zinc-500 text-sm font-medium">{t.writeDesc}</p>
          </div>
        </SpotlightButton>
      </motion.div>
    </div>
  );
};
