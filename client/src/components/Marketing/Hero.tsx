import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Volume2, ArrowDownCircle } from 'lucide-react'
import { useState } from 'react';
import Link from 'next/link';

interface HeroProps {
  scrollToComponent: () => void;
}

const Hero = ({ scrollToComponent }: HeroProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAudioPlay = () => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance('poetica');
    
    // Configure the utterance
    utterance.rate = 0.8; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.lang = 'la'; // Latin language code
    
    // Add event handlers
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    // Play the audio
    window.speechSynthesis.speak(utterance);
  }

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.215, 0.61, 0.355, 1]
      }
    })
  }

  return (
    <section className="min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="space-y-12">
          {/* Word and Pronunciation Section */}
          <motion.div 
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <h1 className="text-5xl md:text-7xl font-serif tracking-tight">
                poētica
              </h1>
              <button 
                onClick={handleAudioPlay}
                disabled={isPlaying}
                className={`h-12 w-12 flex items-center justify-center rounded-full transition-colors ${
                  isPlaying ? 'bg-gray-100' : 'hover:bg-gray-100'
                }`}
                aria-label="Listen to pronunciation"
              >
                <Volume2 className={`h-6 w-6 ${
                  isPlaying ? 'text-gray-400' : 'text-blue-600'
                }`} />
              </button>
            </div>
            
            <div className="space-y-2">
              <p className="text-xl text-muted-foreground font-mono">
                /poˈeːtɪka/
              </p>
              <div className="flex gap-2 items-center">
                <p className="text-sm italic text-muted-foreground">
                  Latin
                </p>
                <span className="text-muted-foreground">•</span>
                <p className="text-sm text-muted-foreground">
                  fem. of poēticus (&quot;poetic&quot;)
                </p>
              </div>
            </div>
          </motion.div>

          {/* Etymology and Definition Section */}
          <motion.div 
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
            className="space-y-4 border-l-2 border-gray-200 pl-6"
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                Etymology
              </p>
              <p className="text-base text-muted-foreground">
                From Latin <span className="italic">poēticus</span>, from Ancient Greek <span className="italic">ποιητικός</span> (poiētikós, &quot;creative, productive&quot;), from <span className="italic">ποιέω</span> (poiéō, &quot;I make, create&quot;).
              </p>
            </div>
            
            <div className="space-y-4 mt-6">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                Meaning
              </p>
              <div>
                <span className="text-sm text-muted-foreground">1.</span>
                <p className="text-lg mt-1">
                  The art and principles of poetic composition
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">2.</span>
                <p className="text-lg mt-1">
                  A modern platform merging classical poetic traditions with artificial intelligence
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
            className="flex flex-col sm:flex-row items-center gap-4 pt-6"
          >
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/create">Begin Creating</Link>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={scrollToComponent}
              className="w-full sm:w-auto group"
            >
              Discover More
              <ArrowDownCircle className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero