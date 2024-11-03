import Link from 'next/link'
import { Github, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-16">
          {/* Main Content */}
          <div className="grid gap-16 md:grid-cols-2">
            {/* Brand Section */}
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl tracking-tight">poetica</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Transforming creative expression through neural networks
                </p>
              </div>
              <div className="flex gap-4">
                <a 
                  href="https://github.com/yourproject" 
                  target="_blank" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a 
                  href="https://twitter.com/yourproject" 
                  target="_blank" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="space-y-6">
              <div>
                <h4 className="font-medium">Stay Updated</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Get weekly insights on AI poetry and creativity
                </p>
              </div>
              <form className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Email address"
                  className="max-w-[240px]"
                />
                <Button type="submit" variant="outline">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          {/* Links Section */}
          <div className="flex flex-wrap gap-6 text-sm">
            <Link 
              href="/features" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link 
              href="/blog" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <Link 
              href="/privacy" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-border/40">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Poetica. All rights reserved.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600">
              <span className="text-xs font-medium">Made with AI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer