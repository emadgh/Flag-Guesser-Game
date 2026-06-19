import React, { useRef, useState } from "react";
import { motion, HTMLMotionProps } from "motion/react";

interface SpotlightButtonProps extends HTMLMotionProps<"button"> {
  spotlightColor?: string;
  innerClassName?: string;
}

export const SpotlightButton = React.forwardRef<HTMLButtonElement, SpotlightButtonProps>(({
  className,
  innerClassName,
  children,
  spotlightColor = "rgba(167, 139, 250, 0.2)",
  ...props
}, ref) => {
  const innerRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const mergedRef = React.useMemo(() => {
    return (node: HTMLButtonElement) => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    };
  }, [ref]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!innerRef.current) return;
    const rect = innerRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.button
      ref={mergedRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden group ${className || ''}`}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          opacity,
          background: `radial-gradient(300px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <span className={`relative pointer-events-none z-10 w-full h-full block ${innerClassName || ''}`}>
        {children}
      </span>
    </motion.button>
  );
});
SpotlightButton.displayName = 'SpotlightButton';
