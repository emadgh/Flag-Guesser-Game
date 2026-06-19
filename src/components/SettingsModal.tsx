import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, X } from 'lucide-react';
import { audioManager } from '../lib/audio';

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

  const toggleSound = () => {
    const newVal = !soundEnabled;
    audioManager.setSoundEnabled(newVal);
    setSoundEnabled(newVal);
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
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Player Name</label>
                <input 
                  type="text" 
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Enter name..."
                  maxLength={15}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Sound Effects</h3>
                  <p className="text-sm text-zinc-400">Game audio and feedback</p>
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
            </div>
            
            <button
              onClick={onClose}
              className="w-full mt-8 bg-white text-black font-semibold py-3 rounded-xl hover:bg-zinc-200 transition-colors"
            >
              Done
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
