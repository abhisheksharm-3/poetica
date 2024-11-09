import type { Metadata } from "next";
import { Sora, Source_Serif_4 } from 'next/font/google'
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

//TODO: Review the next/font implementation
const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sora'
})

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-source-serif-4'
})

export const metadata: Metadata = {
  title: {
    default: "Poetica | AI Poetry Generation",
    template: "%s | Poetica"
  },
  description: "Create beautiful, meaningful poetry with the help of AI. Poetica combines artificial intelligence with creative expression to help you craft unique poems, verses, and literary pieces.",
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
    "creative AI"
  ],
  authors: [
    {
      name: "Abhishek Sharma",
      url: "https://poetica-ai.vercel.app",
    }
  ],
  creator: "Abhishek Sharma",
  publisher: "Abhishek Sharma",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // verification: {
  //   // Add your verification tokens here
  //   google: "google-site-verification-token",
  //   yandex: "yandex-verification-token",
  //   // other verification tokens as needed
  // },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  /* 
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
  */
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://poetica-ai.vercel.app',
    title: 'Poetica | AI Poetry Generation',
    description: 'Create beautiful, meaningful poetry with the help of AI. Transform your ideas into eloquent verses.',
    siteName: 'Poetica',
     images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Poetica - AI Poetry Generation',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Poetica | AI Poetry Generation',
    description: 'Create beautiful, meaningful poetry with the help of AI. Transform your ideas into eloquent verses.',
    site: '@iabhisheksan',
    creator: '@iabhisheksan',
    images: ['/og-image.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  category: 'technology',
  classification: 'AI Writing Tools',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="hide-scrollbar">
      <body
        className={`${sora.variable} ${sourceSerif4.variable} ${sora.className} ${sourceSerif4.className} antialiased overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}