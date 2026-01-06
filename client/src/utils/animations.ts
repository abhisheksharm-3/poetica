import { Variants } from 'framer-motion';

/**
 * Centralized Animation Variants
 * Consistent animations across the application
 */

// Easing curves
export const EASE = {
  smooth: [0.215, 0.61, 0.355, 1],
  spring: [0.6, 0.01, -0.05, 0.9],
  bouncy: [0.68, -0.55, 0.265, 1.55],
} as const;

// Fade Up Animation
export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: EASE.smooth,
    },
  }),
};

// Fade In Animation
export const fadeInVariant: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: EASE.smooth,
    },
  }),
};

// Scale Up Animation
export const scaleUpVariant: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: EASE.smooth,
    },
  }),
};

// Slide In From Left
export const slideInLeftVariant: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: EASE.smooth,
    },
  }),
};

// Slide In From Right
export const slideInRightVariant: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: EASE.smooth,
    },
  }),
};

// Stagger Children Animation
export const staggerContainerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Card Hover Animation
export const cardHoverVariant: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: EASE.smooth,
    },
  },
};

// Button Tap Animation
export const buttonTapVariant: Variants = {
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: EASE.smooth,
    },
  },
};

// Page Transition Variants
export const pageTransitionVariant: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASE.smooth,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: EASE.smooth,
    },
  },
};

// Loading Spinner Variants
export const spinnerVariant: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// Pulse Animation (for loading states)
export const pulseVariant: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};