import type { Metadata, Viewport } from "next";
import Script from "next/script";
import {
  IBM_Plex_Mono,
  Instrument_Sans,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const themeScript = `
  (() => {
    const storageKey = "site-theme-preference";
    const root = document.documentElement;
    const stored = window.localStorage.getItem(storageKey);
    const preference = stored === "light" || stored === "dark" || stored === "system" ? stored : "dark";
    const resolved = preference === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      : preference;
    root.dataset.themePreference = preference;
    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;
  })();
`;

const description =
  "Abhinav Mishra — full-stack engineer building TypeScript products, backend systems, and AI tooling with a bias for depth.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.abhinavmishra.in"),
  title: {
    default: "Abhinav Mishra — Full-Stack Engineer",
    template: "%s · Abhinav Mishra",
  },
  description,
  openGraph: {
    title: "Abhinav Mishra — Full-Stack Engineer",
    description,
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhinav Mishra — Full-Stack Engineer",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
