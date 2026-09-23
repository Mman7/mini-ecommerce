import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story and Atelier",
  description:
    "Meet Komorebi Gift Atelier, a warm Tokyo-inspired gift shop built around thoughtful objects, playful design, and everyday joy.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Our Story and Atelier | Komorebi Gift Atelier",
    description:
      "Explore the story, philosophy, and craft behind Komorebi Gift Atelier.",
    images: [{ url: "/Shared/about_page_banner.png" }],
  },
};

export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
