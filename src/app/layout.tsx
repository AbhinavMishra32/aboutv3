import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const sixtyFourConv = localFont({
  src: "./fonts/SixtyfourConvergence-Regular.ttf",
  variable: "--font-sixty-four",
  weight: "100 900",
})

const instrumentSerif = localFont({
  src: "./fonts/InstrumentSerif-Regular.ttf",
  variable: "--font-instrument-serif",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Portfolio | Abhinav Mishra",
  description: "Portfolio of Abhinav Mishra",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <head>
      <link rel="icon" href="./favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${instrumentSerif.variable} ${geistMono.variable} ${sixtyFourConv.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
