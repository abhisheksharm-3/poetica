import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-muted py-8">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-semibold mb-2">About Poetica</h3>
          <p className="text-muted-foreground max-w-md">
            Powered by advanced neural networks, Poetica brings the beauty of AI-generated poetry to life.
          </p>
        </div>
        <nav className="flex space-x-4">
          <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
          <Link href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">Demo</Link>
        </nav>
      </div>
      <div className="mt-8 text-center">
        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">Made with AI</span>
      </div>
    </div>
  </footer>
  )
}

export default Footer