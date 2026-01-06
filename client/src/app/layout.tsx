import type { Metadata } from "next";
import { Sora, Source_Serif_4 } from 'next/font/google'
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { SEO_CONFIG, DEVELOPER_INFO, SITE_CONFIG, THEME_COLORS } from "@/constants/config";

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
  metadataBase: new URL(SITE_CONFIG.url),
  title: SEO_CONFIG.title,
  description: SEO_CONFIG.description,
  keywords: SEO_CONFIG.keywords,
  authors: [
    {
      name: DEVELOPER_INFO.name,
      url: SITE_CONFIG.url,
    }
  ],
  creator: DEVELOPER_INFO.name,
  publisher: DEVELOPER_INFO.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: SEO_CONFIG.robots,
  openGraph: SEO_CONFIG.openGraph,
  twitter: SEO_CONFIG.twitter,
  category: SITE_CONFIG.category,
  classification: SITE_CONFIG.classification,
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: THEME_COLORS.light },
    { media: '(prefers-color-scheme: dark)', color: THEME_COLORS.dark },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="hide-scrollbar" suppressHydrationWarning>
      <body
        className={`${sora.variable} ${sourceSerif4.variable} ${sora.className} ${sourceSerif4.className} antialiased overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
          </QueryProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}