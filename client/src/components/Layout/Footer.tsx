import Link from 'next/link'
import { Github, Twitter, Globe } from 'lucide-react'
import { SITE_CONFIG, SOCIAL_LINKS, NAV_LINKS, DEVELOPER_INFO } from '@/constants/config'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  // Get footer links
  const productLinks = NAV_LINKS.footer

  return (
    <footer className="border-t border-border/40 py-20 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="space-y-16">
          {/* Main Content */}
          <div className="grid gap-16 md:grid-cols-3">
            {/* Brand Section */}
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl tracking-tight">{SITE_CONFIG.name.toLowerCase()}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {SITE_CONFIG.description}
                </p>
              </div>
              <div className="flex gap-4">
                <a
                  href={SOCIAL_LINKS.github.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={SOCIAL_LINKS.github.name}
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href={SOCIAL_LINKS.twitter.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={SOCIAL_LINKS.twitter.name}
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href={DEVELOPER_INFO.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Website"
                >
                  <Globe className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Product</h4>
              <nav className="flex flex-col gap-3">
                {productLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact Section */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Contact</h4>
              <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                <p>{DEVELOPER_INFO.email}</p>
                <a
                  href={DEVELOPER_INFO.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  {DEVELOPER_INFO.website}
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-border/40">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {SITE_CONFIG.name}. Built by{' '}
              <a
                href={DEVELOPER_INFO.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors underline decoration-dotted underline-offset-4"
              >
                {DEVELOPER_INFO.name}
              </a>
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary">
              <span className="text-xs font-medium">Powered by AI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer