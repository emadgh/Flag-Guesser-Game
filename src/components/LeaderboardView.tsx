import { motion } from 'motion/react';
import React from 'react';
import { getLeaderboard } from '../lib/leaderboard';
import { Trophy, ArrowLeft } from 'lucide-react';
import { SpotlightButton } from './SpotlightButton';

interface LeaderboardViewProps {
  onBack: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ onBack }) => {
  const scores = getLeaderboard();

  return (
    <div className="flex flex-col w-full h-full min-h-[400px] relative z-20">
      <div className="flex items-center mb-6 pb-4 border-b border-zinc-800/50">
        <SpotlightButton 
          onClick={onBack}
          className="p-2 -ml-2 text-zinc-400 border border-transparent rounded-xl hover:bg-zinc-900 hover:text-white hover:border-zinc-800 transition-all"
        >
          <span className="pointer-events-auto block"><ArrowLeft size={22} /></span>
        </SpotlightButton>
        <h2 className="text-2xl font-bold text-white ml-2 flex items-center gap-3 tracking-tight">
          <Trophy className="text-yellow-500" size={24} /> 
          Leaderboard
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {scores.length === 0 ? (
          <div className="flex h-full min-h-[200px] items-center justify-center text-zinc-500 font-medium text-center border-2 border-dashed border-zinc-800/50 rounded-2xl">
            No scores yet.<br/>Play a game to be the first!
          </div>
        ) : (
          <div className="space-y-3">
            {scores.map((score, index) => (
              <motion.div
                key={score.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className={`font-black w-8 text-center text-lg ${
                    index === 0 ? 'text-yellow-500 drop-shadow-md' :
                    index === 1 ? 'text-zinc-300' :
                    index === 2 ? 'text-amber-600' :
                    'text-zinc-600'
                  }`}>
                    #{index + 1}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-zinc-100">{score.playerName}</div>
                    <div className="text-[10px] text-zinc-500 font-mono font-bold tracking-widest">{score.mode} • DIFF {score.difficulty || '-'}</div>
                  </div>
                </div>
                <div className="font-mono font-black text-xl text-indigo-400">
                  {score.score}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
