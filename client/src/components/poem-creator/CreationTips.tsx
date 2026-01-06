import React from "react";
import { motion } from "framer-motion";
// import { fadeUpVariant } from "@/lib/animations";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1] as const,
    },
  }),
};

export const CreationTips: React.FC = () => {
  return (
    <motion.div
      custom={2}
      initial="hidden"
      animate="visible"
      variants={fadeUpVariant}
      className="border-l-2 border-gray-200 pl-6 space-y-4"
    >
      <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
        Tips for Getting the Best AI-Generated Poems
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
        <p>• Set higher Creative Style (70-90) for innovative, contemporary expressions</p>
        <p>• Keep Language Variety above 0.7 for rich vocabulary and metaphors</p>
        <p>• Match Emotional Tone to your theme (e.g., Romantic for love poems)</p>
        <p>• Choose Word Repetition closer to 2 for more varied language</p>
        <p>• Try Sonnet style for structured, emotional narratives</p>
        <p>• Use Free Verse for more experimental, modern poetry</p>
        <p>• Combine thoughtful tone with rich language for deeper meanings</p>
        <p>• Start with Standard length and adjust based on complexity</p>
        <p>• Use Haiku style for nature-themed or minimalist expressions</p>
        <p>• Select Villanelle for poems with recurring themes</p>
        <p>• Experiment with different style-tone combinations</p>
        <p>• Generate multiple versions to find the perfect match</p>
      </div>
    </motion.div>
  );
};