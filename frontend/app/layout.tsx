import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { AuthProvider } from "@/lib/useAuth";
import "./globals.css";

/**
 * DESIGN.md font substitutes: CoinbaseDisplay and CoinbaseSans are licensed,
 * and Inter is the sanctioned stand-in for both. CoinbaseMono -> Geist Mono.
 * Display weight stays at 400 — that restraint is the whole typographic voice.
 */
const inter = Inter({
  variable: "--font-sase-sans",
  subsets: ["latin"],
  display: "swap",
});

const interDisplay = Inter({
  variable: "--font-sase-display",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-sase-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OU SASE — Society of Asian Scientists and Engineers",
    template: "%s | OU SASE",
  },
  description:
    "The University of Oklahoma chapter of the Society of Asian Scientists and Engineers. Professional development, community, and a pipeline of engineering talent.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interDisplay.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/*
          Scroll-reveal elements start at opacity 0 and are revealed by JS.
          With JS disabled that would hide the entire page, so unhide them
          here. DESIGN.md: a missing animation must never mean missing content.
        */}
        <noscript>
          <style>{`[data-reveal],[data-scene-step]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="bg-canvas text-ink flex min-h-full flex-col">
        <a
          href="#main"
          className="bg-brand text-on-brand sr-only rounded-md px-4 py-2 focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100]"
        >
          Skip to content
        </a>
        {/* One auth listener for the whole app — see lib/useAuth.ts. */}
        <AuthProvider>
          <Nav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
