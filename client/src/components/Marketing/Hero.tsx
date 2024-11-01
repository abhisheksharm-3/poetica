import { motion } from 'framer-motion'
import { Button } from '../ui/button'

interface HeroProps {
  scrollToComponent: () => void;
}

const Hero = ({ scrollToComponent }: HeroProps) => {
  return (
    <section className="h-screen flex items-center justify-center">
    <div className="container mx-auto px-6 text-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl md:text-6xl font-bold mb-4"
      >
        Poetica
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="text-xl md:text-2xl mb-8 text-muted-foreground"
      >
        Where AI Meets Poetic Emotion
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="text-lg mb-12 max-w-2xl mx-auto text-muted-foreground"
      >
        Experience the future of poetry with our AI-powered platform. Create emotionally rich, diverse, and captivating verses in seconds.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        className="space-x-4"
      >
        <Button size="lg">Try Poetica</Button>
        <Button variant="outline" size="lg" onClick={scrollToComponent}>
          How It Works
        </Button>
      </motion.div>
    </div>
  </section>
  )
}

export default Hero