import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { MotionProvider } from "@/components/MotionProvider";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Between Real and Made — CMD Afstuderen 2026",
  description:
    "Een CMD-afstudeerproject dat onderzoekt hoe kunstmatige intelligentie verandert hoe mensen muziek ervaren, waarderen en bespreken. Door Tibo Choquet.",
  keywords: [
    "afstudeerproject",
    "CMD",
    "AI-muziek",
    "designonderzoek",
    "interaction design",
    "kunstmatige intelligentie",
    "muziekcultuur",
  ],
  authors: [{ name: "Tibo Choquet" }],
  openGraph: {
    title: "Between Real and Made",
    description:
      "Een CMD-afstudeerproject dat onderzoekt hoe AI de muziekcultuur verandert.",
    type: "website",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary_large_image",
    title: "Between Real and Made",
    description: "CMD Afstudeerproject 2026 — AI & Muziekcultuur",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="nl"
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="font-inter bg-beige text-brown antialiased">
        <div id="grain-overlay" aria-hidden="true" />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
