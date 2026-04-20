import type { Metadata } from "next";
import Script from "next/script";
import { Familjen_Grotesk, Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const familjenGrotesk = Familjen_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const newsreader = Newsreader({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const themeScript = `
  (() => {
    const storageKey = "site-theme-preference";
    const root = document.documentElement;
    const stored = window.localStorage.getItem(storageKey);
    const preference = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    const resolved = preference === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      : preference;
    root.dataset.themePreference = preference;
    root.dataset.theme = resolved;
  })();
`;

export const metadata: Metadata = {
  title: "Abhinav Mishra",
  description: "Software developer building thoughtful products, modern interfaces, and reliable systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${familjenGrotesk.variable} ${newsreader.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
