import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { Volume2, VolumeX, X, Globe, Maximize2 } from 'lucide-react';
import { audioManager } from '../lib/audio';
import { useI18n } from '../i18n';
import { Language } from '../i18n/translations';

const SCALE_KEY = 'flag_guesser_scale';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  setPlayerName: (name: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose,
  playerName,
  setPlayerName
}) => {
  const [soundEnabled, setSoundEnabled] = useState(audioManager.isSoundEnabled());
  const { language, setLanguage, t } = useI18n();
  const [scale, setScale] = useState(() => {
    try {
      const saved = localStorage.getItem(SCALE_KEY);
      return saved ? parseFloat(saved) : 1;
    } catch (e) {
      return 1;
    }
  });

  const toggleSound = () => {
    const newVal = !soundEnabled;
    audioManager.setSoundEnabled(newVal);
    setSoundEnabled(newVal);
  };

  const handleScaleChange = (newScale: number) => {
    setScale(newScale);
    try {
      localStorage.setItem(SCALE_KEY, newScale.toString());
    } catch (e) {}
    document.documentElement.style.setProperty('--ui-scale', newScale.toString());
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 z-50 shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 end-4 text-zinc-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">{t.settings}</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">{t.playerName}</label>
                <input 
                  type="text" 
                  dir="auto"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 transition-colors"
                  placeholder={t.enterName}
                  maxLength={15}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">{t.soundEffects}</h3>
                  <p className="text-sm text-zinc-400">{t.soundDesc}</p>
                </div>
                <button 
                  onClick={toggleSound}
                  className={`p-3 rounded-xl transition-colors ${
                    soundEnabled ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <Maximize2 size={16} className="text-zinc-400" />
                      {t.uiScale}
                    </h3>
                    <p className="text-sm text-zinc-400">{t.uiScaleDesc}</p>
                  </div>
                  <span className="text-sm font-mono text-zinc-400">{Math.round(scale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.5"
                  step="0.05"
                  value={scale}
                  onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
                  <span>80%</span>
                  <span>150%</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Globe size={16} className="text-zinc-400" />
                  <h3 className="text-white font-medium">{t.language}</h3>
                </div>
                <div className="flex bg-zinc-800 rounded-xl p-1">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                      language === 'en' ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange('fa')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                      language === 'fa' ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    فارسی
                  </button>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-full mt-8 bg-white text-black font-semibold py-3 rounded-xl hover:bg-zinc-200 transition-colors"
            >
              {t.done}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
