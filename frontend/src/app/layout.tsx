import type { Metadata } from "next";
import {
  Be_Vietnam_Pro,
  Fredoka,
  Geist_Mono,
  Inter,
  Poppins,
  Geist,
} from "next/font/google";
import "./globals.css";
import { NavbarSection } from "../components/sections/NavbarSection";
import { FooterSection } from "../components/sections/FooterSection";
import { AuthInitializer } from "../components/auth/AuthInitializer";
import { PageTransition } from "../components/motion/PageTransition";
import { cn } from "@/lib/utils";
import { SmoothScroll } from "../components/motion/SmoothScroll";
import { Toaster } from "@/components/ui/toast";
import { QueryProvider } from "../components/providers/QueryProvider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Komorebi Gift Atelier | Thoughtful Japanese-Inspired Gifts",
    template: "%s | Komorebi Gift Atelier",
  },
  description:
    "Shop thoughtful kawaii gifts, stationery, plush collectibles, and artisan treasures inspired by a warm Tokyo atelier.",
  keywords: [
    "Japanese inspired gifts",
    "kawaii gifts",
    "artisan gifts",
    "Japanese stationery",
    "plush collectibles",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Komorebi Gift Atelier",
    title: "Komorebi Gift Atelier | Thoughtful Japanese-Inspired Gifts",
    description:
      "Discover kawaii gifts, stationery, plush collectibles, and artisan treasures from Komorebi Gift Atelier.",
    images: [{ url: "/homepage/komorebi-gift-atelier-store-display.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Komorebi Gift Atelier | Thoughtful Japanese-Inspired Gifts",
    description:
      "Discover kawaii gifts, stationery, plush collectibles, and artisan treasures from Komorebi Gift Atelier.",
    images: ["/homepage/komorebi-gift-atelier-store-display.png"],
  },
  icons: { icon: "/Shared/logo.png", apple: "/Shared/logo.png" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        displayFont.variable,
        headingFont.variable,
        bodyFont.variable,
        metaFont.variable,
        geistMono.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body>
        <SmoothScroll />
        <QueryProvider>
          <AuthInitializer />
          <NavbarSection />
          <PageTransition>{children}</PageTransition>
          <FooterSection />
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
