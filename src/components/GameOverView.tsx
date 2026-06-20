import { motion } from 'motion/react';
import React from 'react';
import { SplitText } from './SplitText';
import { SpotlightButton } from './SpotlightButton';
import { useI18n } from '../i18n';

interface GameOverViewProps {
  score: number;
  onRetry: () => void;
  onMenu: () => void;
}

export const GameOverView: React.FC<GameOverViewProps> = ({ score, onRetry, onMenu }) => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[380px] text-center relative z-20">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="mb-8"
      >
        <div className="flex justify-center text-5xl mb-4 pointer-events-none">💀</div>
        <SplitText text={t.gameOver} className="text-4xl sm:text-5xl font-black text-rose-500 justify-center tracking-tight" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-10"
      >
        <div className="text-zinc-500 text-xs sm:text-sm uppercase tracking-widest font-black mb-2">{t.finalScore}</div>
        <div className="text-7xl font-mono font-black text-white drop-shadow-lg">{score}</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex gap-4 w-full"
      >
        <SpotlightButton
          onClick={onMenu}
          className="flex-1 py-4 font-bold text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg hover:text-white"
        >
          <span className="pointer-events-auto">{t.menu}</span>
        </SpotlightButton>
        <SpotlightButton
          onClick={onRetry}
          spotlightColor="rgba(244, 63, 94, 0.4)"
          className="flex-1 py-4 font-bold text-white bg-indigo-600 border border-indigo-500/50 rounded-2xl shadow-lg shadow-indigo-500/20"
        >
          <span className="pointer-events-auto">{t.playAgain}</span>
        </SpotlightButton>
      </motion.div>
    </div>
  );
};
