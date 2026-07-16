import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";
import "@xyflow/react/dist/style.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "RIPPLE | Alternate History, Under Pressure",
  description: "Run the front office and live with every consequence in a strategic alternate-history campaign.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
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
