import { motion } from 'framer-motion'
import Link from 'next/link'
const Navbar = ({isScrolled}: {isScrolled: boolean}) => {
  return (
    <header className={`fixed w-full z-10 transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-sm' : ''}`}>
    <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold"
      >
        Poetica
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-x-4"
      >
        <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
        <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
        <Link href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">Demo</Link>
      </motion.div>
    </nav>
  </header>
  )
}

export default Navbar