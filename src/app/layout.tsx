import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

/**
 * Display face — Space Grotesk, self-hosted (no build-time network dependency).
 * Used for titles, hero numbers, section headers. Gives the product a voice
 * the default body font never could.
 *
 * Owner note: to swap in Clash Display later, drop its woff2 files into
 * /public/fonts and point `src` here at them — nothing else changes.
 */
const display = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "../../public/fonts/space-grotesk-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/space-grotesk-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/space-grotesk-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: {
    default: "maga — English, mastered",
    template: "%s · maga",
  },
  description:
    "maga — IELTS & General English, built to be addictive. Daily practice, AI checks, and a centre that runs inside the app.",
  applicationName: "maga",
  appleWebApp: { capable: true, title: "maga", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {/* Grain overlay — kills gradient banding, adds craft. Fixed, non-interactive. */}
        <div aria-hidden className="grain" />
        {/* One restrained ambient glow behind everything (never three competing ones). */}
        <div aria-hidden className="ambient" />
        {children}
      </body>
    </html>
  );
}
