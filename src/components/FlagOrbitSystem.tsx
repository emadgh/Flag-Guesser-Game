import { motion } from 'motion/react';
import React, { useMemo } from 'react';
import { UNIQUE_COUNTRIES } from '../data/countries';

const ORBITS = [
  { radius: 140, count: 3, duration: 35, direction: 1, size: 44 },
  { radius: 240, count: 5, duration: 50, direction: -1, size: 52 },
  { radius: 360, count: 7, duration: 70, direction: 1, size: 60 },
  { radius: 520, count: 9, duration: 90, direction: -1, size: 70 },
  { radius: 700, count: 12, duration: 120, direction: 1, size: 80 },
];

export const FlagOrbitSystem = () => {
  const flags = useMemo(() => {
    const total = ORBITS.reduce((sum, o) => sum + o.count, 0);
    const shuffled = [...UNIQUE_COUNTRIES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, total);
  }, []);

  let flagIndex = 0;

  return (
    <div className="absolute top-1/2 left-1/2 w-0 h-0 pointer-events-none z-0">
      {ORBITS.map((orbit, orbitIdx) => {
        const currentFlags = flags.slice(flagIndex, flagIndex + orbit.count);
        flagIndex += orbit.count;

        return (
          <motion.div
            key={orbitIdx}
            animate={{ rotate: orbit.direction * 360 }}
            transition={{ duration: orbit.duration, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.03]"
            style={{ width: orbit.radius * 2, height: orbit.radius * 2 }}
          >
            {currentFlags.map((country, i) => {
              const angle = (360 / orbit.count) * i;
              
              return (
                <div
                  key={country.code}
                  className="absolute top-1/2 left-1/2 w-0 h-0 origin-center"
                  style={{
                    transform: `rotate(${angle}deg) translateX(${orbit.radius}px) rotate(-${angle}deg)`
                  }}
                >
                  <motion.div
                    animate={{ rotate: -orbit.direction * 360 }}
                    transition={{ duration: orbit.duration, repeat: Infinity, ease: 'linear' }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ width: orbit.size, height: orbit.size }}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.8)] bg-zinc-950 backdrop-blur-md">
                      <img 
                        src={`https://flagcdn.com/w80/${country.code}.png`}
                        alt={country.name}
                        className="w-full h-full object-cover opacity-70 mix-blend-screen mix-blend-normal"
                        loading="lazy"
                      />
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        );
      })}
    </div>
  );
};
