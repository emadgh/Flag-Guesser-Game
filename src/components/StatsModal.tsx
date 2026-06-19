import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BarChart2 } from 'lucide-react';
import { getStats } from '../lib/statistics';
import { UNIQUE_COUNTRIES, getFlagUrl } from '../data/countries';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose }) => {
  const statsList = useMemo(() => {
    if (!isOpen) return [];
    const stats = getStats();
    return Object.entries(stats)
      .map(([code, stat]) => {
        const country = UNIQUE_COUNTRIES.find(c => c.code === code);
        return {
          code,
          name: country?.name || code,
          ...stat,
          total: stat.correct + stat.wrong,
          winRate: stat.correct / (stat.correct + stat.wrong)
        };
      })
      .sort((a, b) => b.total - a.total); // Most played first
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="flex justify-between items-center mb-6 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
                    <BarChart2 size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Statistics</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-zinc-500 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto pr-2 space-y-3 flex-1 scrollbar-thin scrollbar-thumb-zinc-800">
                {statsList.length === 0 ? (
                  <p className="text-zinc-500 text-center py-10">No statistics yet. Play to gather data!</p>
                ) : (
                  statsList.map(item => (
                    <div key={item.code} className="flex items-center justify-between p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                      <div className="flex items-center gap-3 w-1/2">
                        <img 
                          src={getFlagUrl(item.code)} 
                          alt="Flag" 
                          className="w-10 h-6 object-cover rounded-md shadow-sm border border-zinc-800 shrink-0" 
                        />
                        <span className="font-bold text-sm text-zinc-200 truncate pr-2">{item.name}</span>
                      </div>
                      <div className="flex gap-4 text-xs font-mono w-1/2 justify-end text-zinc-500">
                        <div className="flex flex-col items-end">
                          <span className="text-emerald-400 font-bold">{item.correct}</span>
                          <span className="text-[9px] uppercase tracking-wider">Rights</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-rose-400 font-bold">{item.wrong}</span>
                          <span className="text-[9px] uppercase tracking-wider">Wrongs</span>
                        </div>
                        <div className="flex flex-col items-end w-12">
                          <span className="text-indigo-300 font-bold">{Math.round(item.winRate * 100)}%</span>
                          <span className="text-[9px] uppercase tracking-wider">Win</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};
