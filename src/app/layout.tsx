import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { TorneoProvider } from "@/context/torneoContext";
import "./globals.css";
import Navbar from "./torneos/crear/ui/Navbar";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Torneo App",
  description: "Crea un torneo de Paddle o Pelota Paleta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TorneoProvider>
          <Navbar />
          {children}
        </TorneoProvider>
      </body>
    </html>
  );
}
