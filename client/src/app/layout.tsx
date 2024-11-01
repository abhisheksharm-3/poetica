import type { Metadata } from "next";
import { Sora, Source_Serif_4 } from 'next/font/google'
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${sourceSerif4.variable} ${sora.className} ${sourceSerif4.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
