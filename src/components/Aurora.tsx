import { motion } from 'motion/react';
import React from 'react';

export const Aurora = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
      <motion.div
        animate={{
          x: ['-50%', '-30%', '-50%'],
          y: ['-50%', '-60%', '-50%'],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] origin-center rounded-full opacity-30 mix-blend-screen blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.8) 0%, rgba(99,102,241,0) 70%)',
        }}
      />
      <motion.div
        animate={{
          x: ['-50%', '-70%', '-50%'],
          y: ['-50%', '-40%', '-50%'],
          rotate: [0, -90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] origin-center rounded-full opacity-30 mix-blend-screen blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.8) 0%, rgba(225,29,72,0) 70%)',
        }}
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[30px]" />
    </div>
  );
};
