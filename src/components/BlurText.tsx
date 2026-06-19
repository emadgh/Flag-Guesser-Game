import { motion } from 'motion/react';
import React, { useRef, useEffect, useState } from 'react';

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 50,
  className = '',
  animateBy = 'words',
  direction = 'top'
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: delay / 1000 },
    },
  };

  const item = {
    hidden: { 
      opacity: 0, 
      filter: 'blur(8px)',
      y: direction === 'top' ? -20 : 20 
    },
    visible: { 
      opacity: 1, 
      filter: 'blur(0px)',
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={`flex flex-wrap ${className}`}
    >
      {elements.map((element, index) => (
        <motion.span
          key={index}
          variants={item}
          className="inline-block mr-[0.25em]"
        >
          {element === ' ' ? '\u00A0' : element}
        </motion.span>
      ))}
    </motion.div>
  );
};
