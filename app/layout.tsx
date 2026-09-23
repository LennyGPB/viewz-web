import type { Metadata } from "next";
import { Geist_Mono, MuseoModerno, Nunito } from "next/font/google";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const museoModerno = MuseoModerno({
  variable: "--font-museo-moderno",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: { default: "ViewZ — Informations légales", template: "%s — ViewZ" },
  description: "Conditions générales d’utilisation et politique de confidentialité de ViewZ.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${nunito.variable} ${geistMono.variable} ${museoModerno.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg font-sans text-ink">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
