import type { Metadata } from "next";
import { Anton, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import CookieBanner from "@/components/CookieBanner";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "V2 — Dark Streetwear",
    template: "%s · V2",
  },
  description: "Trap scuro / underground streetwear. Felpe e t-shirt in drop limitati.",
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "V2 — Dark Streetwear",
    description: "Underground trap streetwear. Drop limitati.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${anton.variable} ${grotesk.variable}`}>
      <body className="min-h-screen font-[var(--font-body)]">
        <Providers>
          <Header />
          <main className="container-page py-8">{children}</main>
          <Footer />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
