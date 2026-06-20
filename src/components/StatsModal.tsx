import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BarChart2, Check } from 'lucide-react';
import { getStats, toggleMastered } from '../lib/statistics';
import { UNIQUE_COUNTRIES, getFlagUrl, getCountryName } from '../data/countries';
import { useI18n } from '../i18n';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useI18n();
  const [refreshKey, setRefreshKey] = useState(0);

  const statsList = useMemo(() => {
    if (!isOpen) return [];
    const stats = getStats();
    return Object.entries(stats)
      .map(([code, stat]) => {
        const country = UNIQUE_COUNTRIES.find(c => c.code === code);
        return {
          code,
          name: country ? getCountryName(country, language) : code,
          ...stat,
          total: stat.correct + stat.wrong,
          winRate: stat.correct / (stat.correct + stat.wrong)
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [isOpen, refreshKey]);

  const handleToggleMastered = (code: string) => {
    toggleMastered(code);
    setRefreshKey(k => k + 1);
  };

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
                  <h2 className="text-2xl font-bold text-white">{t.statistics}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-zinc-500 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto ps-2 space-y-3 flex-1 scrollbar-thin scrollbar-thumb-zinc-800">
                {statsList.length === 0 ? (
                  <p className="text-zinc-500 text-center py-10">{t.noStats}</p>
                ) : (
                  statsList.map(item => (
                    <div key={item.code} className={`flex items-center justify-between p-3 bg-zinc-900 rounded-xl border transition-colors ${item.mastered ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-zinc-800'}`}>
                      <div className="flex items-center gap-3 w-1/2">
                        <img 
                          src={getFlagUrl(item.code)} 
                          alt="Flag" 
                          className="w-10 h-6 object-cover rounded-md shadow-sm border border-zinc-800 shrink-0" 
                        />
                        <span className={`font-bold text-sm truncate ps-2 ${item.mastered ? 'text-emerald-400' : 'text-zinc-200'}`}>{item.name}</span>
                      </div>
                      <div className="flex gap-3 items-center">
                        <div className="flex gap-4 text-xs font-mono justify-end text-zinc-500">
                          <div className="flex flex-col items-end">
                            <span className="text-emerald-400 font-bold">{item.correct}</span>
                            <span className="text-[9px] uppercase tracking-wider">{t.rights}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-rose-400 font-bold">{item.wrong}</span>
                            <span className="text-[9px] uppercase tracking-wider">{t.wrongs}</span>
                          </div>
                          <div className="flex flex-col items-end w-12">
                            <span className="text-indigo-300 font-bold">{Math.round(item.winRate * 100)}%</span>
                            <span className="text-[9px] uppercase tracking-wider">{t.win}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggleMastered(item.code)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                            item.mastered 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-zinc-800 text-zinc-600 hover:bg-zinc-700 hover:text-zinc-400'
                          }`}
                          title={item.mastered ? t.mastered : t.mastered}
                        >
                          {item.mastered && <Check size={14} strokeWidth={3} />}
                        </button>
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
