import Link from 'next/link'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">Poetica</h3>
            <p className="text-muted-foreground max-w-md mb-4">
              Powered by advanced neural networks, Poetica transforms creative expression through cutting-edge AI technology.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/yourproject" target="_blank" className="text-muted-foreground hover:text-foreground">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://twitter.com/yourproject" target="_blank" className="text-muted-foreground hover:text-foreground">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com/company/yourproject" target="_blank" className="text-muted-foreground hover:text-foreground">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="mailto:contact@poetica.ai" className="text-muted-foreground hover:text-foreground">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-foreground">Explore</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">
                Demo
              </Link>
              <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </nav>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-foreground">Stay Inspired</h4>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button 
                type="submit" 
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Subscribe to Insights
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-2 md:mb-0">
            © {currentYear} Poetica. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Made with AI</span>
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer