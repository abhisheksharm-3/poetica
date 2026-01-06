import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Volume2, ArrowDownCircle } from 'lucide-react'
import { useState } from 'react';
import Link from 'next/link';

const Hero = () => {
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
        ease: [0.215, 0.61, 0.355, 1] as const
      }
    })
  }

  return (
    <section className="min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-12">
          {/* Word and Pronunciation Section */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
            className="space-y-6"
          >
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-6xl md:text-8xl font-serif tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                poētica
              </h1>
              <motion.button
                onClick={handleAudioPlay}
                disabled={isPlaying}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`h-14 w-14 flex items-center justify-center rounded-full transition-all duration-300 ${isPlaying
                  ? 'bg-primary/10 ring-2 ring-primary animate-pulse'
                  : 'bg-primary/5 hover:bg-primary/10 hover:ring-2 hover:ring-primary/20'
                  }`}
                aria-label="Listen to pronunciation"
              >
                <Volume2 className={`h-6 w-6 transition-colors ${isPlaying ? 'text-primary' : 'text-primary/80 hover:text-primary'
                  }`} />
              </motion.button>
            </div>

            <div className="space-y-3">
              <p className="text-2xl text-muted-foreground font-mono tracking-wide">
                /poˈeːtɪka/
              </p>
              <div className="flex gap-3 items-center flex-wrap">
                <span className="px-3 py-1 bg-muted rounded-full text-sm font-medium text-muted-foreground">
                  Latin
                </span>
                <span className="text-muted-foreground/40">•</span>
                <p className="text-sm text-muted-foreground">
                  fem. of <span className="italic font-serif">poēticus</span> <span className="text-muted-foreground/60">(&quot;poetic&quot;)</span>
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
            className="space-y-8 border-l-4 border-primary/20 pl-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-xs font-medium uppercase tracking-wider text-primary">
                  Etymology
                </p>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed">
                From Latin <span className="font-serif italic text-foreground">poēticus</span>, from Ancient Greek <span className="font-serif italic text-foreground">ποιητικός</span> <span className="text-sm">(poiētikós, &quot;creative, productive&quot;)</span>, from <span className="font-serif italic text-foreground">ποιέω</span> <span className="text-sm">(poiéō, &quot;I make, create&quot;)</span>.
              </p>
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-xs font-medium uppercase tracking-wider text-primary">
                  Definitions
                </p>
              </div>

              <div className="space-y-5">
                <div className="group">
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-mono text-primary mt-1">1.</span>
                    <p className="text-lg leading-relaxed group-hover:text-foreground transition-colors">
                      The art and principles of poetic composition
                    </p>
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-mono text-primary mt-1">2.</span>
                    <div className="space-y-2">
                      <p className="text-lg leading-relaxed group-hover:text-foreground transition-colors">
                        A modern platform merging classical poetic traditions with artificial intelligence
                      </p>
                      <p className="text-sm text-muted-foreground italic">
                        Create, explore, and share AI-generated poetry
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
            className="flex flex-col sm:flex-row items-center gap-4 pt-8"
          >
            <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8 shadow-lg hover:shadow-xl transition-shadow" asChild>
              <Link href="/create">
                Begin Creating
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto group text-base h-12 px-8 border-2 hover:bg-muted/50"
              asChild
            >
              <Link href="#how-it-works">
                Discover More
                <ArrowDownCircle className="ml-2 h-5 w-5 transition-transform group-hover:translate-y-1 duration-300" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero