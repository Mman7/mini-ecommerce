import type { Metadata } from "next";
import {
  Be_Vietnam_Pro,
  Fredoka,
  Geist_Mono,
  Inter,
  Poppins,
} from "next/font/google";
import "./globals.css";
import { NavbarSection } from "../components/sections/NavbarSection";

const displayFont = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600"],
});

const headingFont = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const metaFont = Be_Vietnam_Pro({
  variable: "--font-meta",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Komorebi Gift Atelier",
  description:
    "Luxury kawaii gifts and artisan collections inspired by a warm Tokyo atelier.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${headingFont.variable} ${bodyFont.variable} ${metaFont.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NavbarSection />
        {children}
      </body>
    </html>
  );
}
