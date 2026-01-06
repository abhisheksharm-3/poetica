/**
 * Centralized Configuration
 * Single source of truth for all site-wide constants
 */

// Site Information
export const SITE_CONFIG = {
  name: "Poetica",
  tagline: "AI Poetry Generation",
  description: "Create beautiful, meaningful poetry with the help of AI. Transform your ideas into eloquent verses.",
  url: "https://poetica-ai.vercel.app",
  locale: "en_US",
  category: "technology",
  classification: "AI Writing Tools",
} as const;

// Developer Information
export const DEVELOPER_INFO = {
  name: "Abhishek Sharma",
  role: "Full-Stack Developer",
  bio: "As part of my Neural Networks major project, I developed Poetica to demonstrate practical applications of Large Language Models in creative writing and computational linguistics.",
  expertise: [
    "Neural Networks",
    "LLM Integration",
    "Full-Stack Development",
    "Natural Language Processing",
  ],
  website: "https://abhisheksan.com",
  email: "contact@abhisheksan.com",
} as const;

// Social Media Links
export const SOCIAL_LINKS = {
  github: {
    name: "GitHub",
    username: "abhisheksharm-3",
    url: "https://github.com/abhisheksharm-3",
    projectUrl: "https://github.com/abhisheksharm-3/poetica",
  },
  twitter: {
    name: "Twitter",
    handle: "@iabhisheksan",
    url: "https://x.com/iabhisheksan",
  },
  linkedin: {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/abhisheksharm-3",
  },
} as const;

// Navigation Links
export const NAV_LINKS = {
  main: [
    { href: "/", label: "Home", description: "Return to homepage" },
    { href: "/create", label: "Create", description: "Create your own poem" },
    { href: "/my-poems", label: "My Poems", description: "View your saved poems" },
    { href: "/about", label: "About", description: "Learn about Poetica" },
  ],
  footer: [
    { href: "/about", label: "About", section: "product" },
    { href: "/create", label: "Create", section: "product" },
    { href: "/my-poems", label: "My Poems", section: "product" },
  ],
} as const;

// Tech Stack Information
export const TECH_STACK = {
  frontend: [
    { name: "Next.js", description: "React framework for production" },
    { name: "TypeScript", description: "Type-safe JavaScript" },
    { name: "Tailwind CSS", description: "Utility-first CSS framework" },
    { name: "shadcn/ui", description: "Re-usable UI components" },
    { name: "Framer Motion", description: "Production-ready animations" },
    { name: "Zustand", description: "Lightweight state management" },
  ],
  backend: [
    { name: "FastAPI", description: "Modern Python web framework" },
    { name: "Python", description: "Server-side programming" },
  ],
  ai: [
    { name: "Gemini API", description: "Google's advanced language model" },
    { name: "PoeticaGPT", description: "Quantized local language model based on GPT2 Architecture (Experimental)" },
  ],
} as const;

// SEO and Metadata
export const SEO_CONFIG = {
  title: {
    default: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "AI poetry",
    "poem generator",
    "artificial intelligence poetry",
    "creative writing",
    "poetry creation",
    "AI writer",
    "poetry assistant",
    "verse generator",
    "digital poetry",
    "creative AI",
    "neural networks",
    "LLM poetry",
  ] as string[],
  openGraph: {
    type: "website" as const,
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
      },
    ] as Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>,
  },
  twitter: {
    card: "summary_large_image" as const,
    title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    site: SOCIAL_LINKS.twitter.handle,
    creator: SOCIAL_LINKS.twitter.handle,
    images: ["/og-image.png"] as string[],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1 as const,
      "max-image-preview": "large" as const,
      "max-snippet": -1 as const,
    },
  },
};

// Theme Colors
export const THEME_COLORS = {
  light: "#ffffff",
  dark: "#000000",
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  generate: "/api/poem/generate",
  generateFast: "/api/poem/generate-fast",
  save: "/api/poem/save",
  share: "/api/poem/share",
  get: "/api/poem/get",
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  poems: "poetica_poems",
  favorites: "poetica_favorites",
  drafts: "poetica_drafts",
  settings: "poetica_settings",
} as const;

// App Constants
export const APP_CONSTANTS = {
  maxPoemLength: 5000,
  minPoemLength: 10,
  maxTitleLength: 100,
  poemsPerPage: 12,
  recentPoemsLimit: 5,
} as const;

// Contact Information (for footer and about page)
export const CONTACT_INFO = {
  developer: DEVELOPER_INFO,
  social: SOCIAL_LINKS,
  support: {
    email: DEVELOPER_INFO.email,
  },
} as const;
