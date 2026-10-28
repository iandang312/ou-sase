import type { Metadata } from "next";
import { Archivo, Caveat, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { AuthProvider } from "@/lib/useAuth";
import "./globals.css";

/**
 * The desk kit's type: Archivo wide for headings (the wdth axis gives the
 * 125% stretch), Instrument Sans for body, JetBrains Mono for labels, Caveat
 * for handwritten captions. Mono sets above-the-fold eyebrows and stats on
 * every page, so it preloads; Caveat is rare, so it loads only where used.
 */
const archivo = Archivo({
  variable: "--font-sase-display",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  // next/font sizes its fallback for Archivo at normal width, but headings run
  // at 125%, so the swap re-wrapped them. globals.css has a wide fallback.
  adjustFontFallback: false,
});

const instrumentSans = Instrument_Sans({
  variable: "--font-sase-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-sase-mono",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-sase-hand",
  subsets: ["latin"],
  display: "swap",
  preload: false,
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
      className={`${archivo.variable} ${instrumentSans.variable} ${jetbrainsMono.variable} ${caveat.variable} h-full antialiased`}
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
