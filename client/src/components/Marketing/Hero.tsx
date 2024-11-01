import { motion } from 'framer-motion'
import { Button } from '../ui/button'

interface HeroProps {
  scrollToComponent: () => void;
}

const Hero = ({ scrollToComponent }: HeroProps) => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="scroll-m-20 text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl font-heading"
        >
          Poetica
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="leading-7 [&:not(:first-child)]:mt-6 text-xl md:text-2xl text-muted-foreground"
        >
          Where AI Meets Poetic Emotion
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="leading-7 [&:not(:first-child)]:mt-6 text-lg max-w-2xl mx-auto text-muted-foreground"
        >
          Experience the future of poetry with our AI-powered platform. Create emotionally rich, diverse, and captivating verses in seconds.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex justify-center space-x-4 mt-10"
        >
          <Button size="lg">Try Poetica</Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={scrollToComponent}
          >
            How It Works
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero