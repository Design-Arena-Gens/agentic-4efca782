import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TezPrep Mock Tests | SSC & Railway Practice",
  description:
    "Structured SSC and Railway mock tests with smart analytics, timers, and detailed explanations to sharpen your exam strategy.",
  metadataBase: new URL("https://agentic-4efca782.vercel.app"),
  openGraph: {
    title: "TezPrep Mock Tests | SSC & Railway Practice",
    description:
      "Attempt SSC & Railway mock tests with real-time analytics, timer, and detailed solutions.",
    url: "https://agentic-4efca782.vercel.app",
    siteName: "TezPrep Mock Tests",
  },
  alternates: {
    canonical: "https://agentic-4efca782.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="app-shell">
          <header className="app-header">
            <Link href="/" className="brand">
              TezPrep
            </Link>
            <nav className="app-nav">
              <Link href="/tests">Mock Tests</Link>
              <a
                href="#features"
                className="hide-on-mobile"
              >
                Features
              </a>
              <a
                href="#faqs"
                className="hide-on-mobile"
              >
                FAQs
              </a>
            </nav>
          </header>
          <main className="app-main">{children}</main>
          <footer className="app-footer">
            <div className="footer-primary">
              <span className="brand">TezPrep</span>
              <p>
                Smart practice engine for SSC, Railway, and central government
                exam preparation. Crafted for repeated revision and speed.
              </p>
            </div>
            <div className="footer-meta">
              <span>© {new Date().getFullYear()} TezPrep Labs</span>
              <div className="footer-links">
                <Link href="/tests">All Tests</Link>
                <a href="#features">Features</a>
                <a href="#faqs">Support</a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
