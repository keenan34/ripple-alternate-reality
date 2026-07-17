import type { Metadata } from "next";
import { Inter, Oswald, Spline_Sans_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";
import "@xyflow/react/dist/style.css";
import "./globals.css";

const display = Oswald({ subsets: ["latin"], variable: "--font-shoulders" });
const splineMono = Spline_Sans_Mono({ subsets: ["latin"], variable: "--font-record" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const title = "RIPPLE | Alternate History, Under Pressure";
const description = "Run the front office and live with every consequence in a strategic alternate-history campaign.";

// Vercel exposes the production domain at build time; fall back to localhost for `npm run dev`.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
  ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: "RIPPLE",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${display.variable} ${splineMono.variable} ${inter.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        {children}
        <footer className="site-footer">
          <span>RIPPLE / Est. 2026</span>
          <span>One decision changes everything after it.</span>
        </footer>
      </body>
    </html>
  );
}
