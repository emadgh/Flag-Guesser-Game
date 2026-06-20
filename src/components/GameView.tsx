import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useRef } from 'react';
import { GameMode } from '../types';
import { getFlagUrl, Country, getCountryName } from '../data/countries';
import { BlurText } from './BlurText';
import { Settings, X, Heart } from 'lucide-react';
import { SpotlightButton } from './SpotlightButton';
import { useI18n } from '../i18n';

interface GameViewProps {
  mode: GameMode;
  score: number;
  health: number;
  streak: number;
  timeLeft: number;
  currentCountry: Country | null;
  options: Country[];
  feedback: 'NONE' | 'CORRECT' | 'WRONG';
  selectedAnswer: string | null;
  submitAnswer: (answer: string) => void;
  onQuit: () => void;
  openSettings: () => void;
}

export const GameView: React.FC<GameViewProps> = ({
  mode, score, health, streak, timeLeft, currentCountry, options, feedback, selectedAnswer, submitAnswer, onQuit, openSettings
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { t, language } = useI18n();

  useEffect(() => {
    setInputValue('');
    if (mode === 'WRITE' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentCountry, mode]);

  useEffect(() => {
    if (feedback !== 'NONE' || mode === 'WRITE') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode === 'SELECTIVE') {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 4 && options[num - 1]) {
          submitAnswer(options[num - 1].name);
        }
      } else if (mode === 'REVERSE') {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 4 && options[num - 1]) {
          submitAnswer(options[num - 1].name);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [feedback, mode, options, submitAnswer]);

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      submitAnswer(inputValue.trim());
    }
  };

  const getOptionStatus = (optName: string) => {
    if (feedback === 'NONE') return 'default';
    if (optName === currentCountry?.name) return 'correct';
    if (optName === selectedAnswer) return 'wrong';
    return 'disabled';
  };

  if (!currentCountry) return null;

  return (
    <div className="flex flex-col w-full h-full min-h-[450px]">
      {/* Top Bar inside the box */}
      <div className="flex items-center justify-between mb-8 w-full border-b border-zinc-800/50 pb-4">
        <div className="flex gap-4 items-center">
          <SpotlightButton 
            onClick={onQuit} 
            className="p-2 border border-zinc-800/80 rounded-xl bg-zinc-900/80 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </SpotlightButton>
        </div>

        <div className="flex gap-4 sm:gap-6 items-center flex-1 justify-center">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest hidden sm:block">{t.score}</span>
            <span className="text-xl font-mono text-indigo-300 font-bold leading-none">{score}</span>
          </div>
          <div className="w-px h-6 bg-zinc-800 hidden sm:block" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest hidden sm:block">{t.streak}</span>
            <span className="text-xl font-mono text-amber-300 font-bold leading-none">{streak}</span>
          </div>
          <div className="w-px h-6 bg-zinc-800 hidden sm:block" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest hidden sm:block">{t.lives}</span>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart 
                  key={i} 
                  size={16} 
                  className={`mt-0.5 transition-colors ${i < health ? 'text-rose-500 fill-rose-500' : 'text-zinc-800 fill-zinc-800'}`} 
                />
              ))}
            </div>
          </div>
          <div className="w-px h-6 bg-zinc-800" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest hidden sm:block">{t.time}</span>
            <motion.span 
              animate={{
                scale: timeLeft <= 5 && timeLeft > 0 ? [1, 1.1, 1] : 1,
                color: timeLeft <= 5 ? '#ef4444' : '#e2e8f0'
              }}
              transition={{ repeat: timeLeft <= 5 ? Infinity : 0, duration: 1 }}
              className={`text-xl font-mono font-bold leading-none`}
            >
              0:{timeLeft.toString().padStart(2, '0')}
            </motion.span>
          </div>
        </div>

        <div className="flex gap-4 items-center justify-end">
          <SpotlightButton 
            onClick={openSettings}
            className="p-2 border border-zinc-800/80 rounded-xl bg-zinc-900/80 text-zinc-400 hover:text-white transition-colors"
          >
            <Settings size={20} />
          </SpotlightButton>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCountry.code}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full flex flex-col items-center relative z-20"
          >
            {/* Display Component */}
            {mode === 'REVERSE' ? (
              <div className="mb-10 text-center flex flex-col items-center justify-center min-h-[140px]">
                <BlurText 
                  text={getCountryName(currentCountry, language)} 
                  className="text-4xl sm:text-5xl font-black text-white px-2 text-center" 
                  animateBy="words" 
                />
              </div>
            ) : (
              <div className="relative w-full max-w-[280px] aspect-[3/2] mb-10 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-900">
                <img 
                  src={getFlagUrl(currentCountry.code)} 
                  alt="Flag"
                  className="w-full h-full object-cover"
                />
                
                {/* Feedback Overlay */}
                <AnimatePresence>
                  {feedback !== 'NONE' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm ${
                        feedback === 'CORRECT' ? 'bg-emerald-500/30' : 'bg-rose-500/30'
                      }`}
                    >
                      {feedback === 'WRONG' && (mode === 'WRITE' || mode === 'SELECTIVE') && (
                        <motion.span 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-white font-bold text-xl px-5 py-3 bg-black/80 rounded-xl backdrop-blur-md shadow-2xl text-center"
                        >
                          {getCountryName(currentCountry, language)}
                        </motion.span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Controls Component */}
            <div className="w-full">
              {mode === 'WRITE' ? (
                <form onSubmit={handleInputSubmit} className="w-full flex gap-3">
                  <input
                    ref={inputRef}
                    type="text"
                    dir="auto"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    disabled={feedback !== 'NONE'}
                    placeholder={t.typeCountryName}
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-5 py-4 rounded-2xl outline-none focus:border-indigo-500 transition-colors disabled:opacity-50 text-lg shadow-inner"
                  />
                  <SpotlightButton 
                    type="submit"
                    disabled={feedback !== 'NONE' || !inputValue.trim()}
                    className="bg-indigo-600 border border-indigo-500/50 text-white px-8 font-bold rounded-2xl hover:bg-indigo-500 transition-colors disabled:opacity-50"
                  >
                    {t.guess}
                  </SpotlightButton>
                </form>
              ) : mode === 'REVERSE' ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
                   {options.map((opt, i) => {
                    const status = getOptionStatus(opt.name);
                    let btnClass = "w-full aspect-[3/2] rounded-2xl overflow-hidden transition-all border-2 outline-none p-0 ";
                    
                    if (status === 'default') {
                      btnClass += "border-zinc-800/80 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/20";
                    } else if (status === 'correct') {
                      btnClass += "border-emerald-500 scale-105 z-10 shadow-[0_0_20px_rgba(16,185,129,0.4)]";
                    } else if (status === 'wrong') {
                      btnClass += "border-rose-500 opacity-60 scale-95 grayscale";
                    } else {
                      btnClass += "border-zinc-800 opacity-30 grayscale";
                    }

                    return (
                      <SpotlightButton
                        key={`${currentCountry.code}-opt-${opt.code}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        disabled={feedback !== 'NONE'}
                        onClick={() => submitAnswer(opt.name)}
                        className={btnClass}
                        spotlightColor={status === 'correct' ? "rgba(16,185,129,0.4)" : "rgba(167,139,250,0.3)"}
                      >
                        <img 
                          src={getFlagUrl(opt.code)} 
                          alt={`Flag Option`} 
                          loading="lazy"
                          className="w-full h-full object-cover rounded-xl pointer-events-auto"
                        />
                      </SpotlightButton>
                    )
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  {options.map((opt, i) => {
                    const status = getOptionStatus(opt.name);
                    let btnClass = "w-full p-4 rounded-xl font-bold transition-all border outline-none text-start relative ";
                    let spotlightColor = "rgba(167, 139, 250, 0.2)";

                    if (status === 'default') {
                      btnClass += "bg-zinc-900 border-zinc-800 text-zinc-100 shadow-md";
                    } else if (status === 'correct') {
                      btnClass += "bg-emerald-500/20 border-emerald-500 text-emerald-300 scale-105 z-10 shadow-[0_0_20px_rgba(16,185,129,0.3)]";
                      spotlightColor = "rgba(16, 185, 129, 0.5)";
                    } else if (status === 'wrong') {
                      btnClass += "bg-rose-500/20 border-rose-500 text-rose-300 opacity-80 scale-95";
                      spotlightColor = "rgba(244, 63, 94, 0.5)";
                    } else {
                      btnClass += "bg-zinc-900 border-zinc-800 text-zinc-600 opacity-50";
                    }

                    return (
                      <SpotlightButton
                        key={`${currentCountry.code}-opt-${opt.code}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        disabled={feedback !== 'NONE'}
                        onClick={() => submitAnswer(opt.name)}
                        className={btnClass}
                        spotlightColor={spotlightColor}
                      >
                        <div className="flex items-center gap-3 w-full pointer-events-auto">
                          <span className="text-[10px] font-mono text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded">{i + 1}</span>
                          <div className="w-full text-start">{getCountryName(opt, language)}</div>
                        </div>
                      </SpotlightButton>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Screen Effects / Tint on correct/wrong */}
      <AnimatePresence>
        {feedback === 'CORRECT' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none bg-emerald-500/10 mix-blend-color-dodge z-0"
          />
        )}
        {feedback === 'WRONG' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none bg-rose-500/10 mix-blend-color-dodge z-0"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
