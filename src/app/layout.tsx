import type { Metadata } from "next";
import { Big_Shoulders, IBM_Plex_Sans, IBM_Plex_Mono, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-display",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "600", "700"],
  variable: "--font-devanagari",
});

export const metadata: Metadata = {
  title: "ARTHKAVACH · Institutional FDR Ledger System",
  description: "AICTE Fixed Deposit Receipt & Security Deposit Decision Support System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bigShoulders.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} ${notoSerifDevanagari.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#EDE4CE] text-[#1A1F1B] selection:bg-[#F2A900] selection:text-[#0C1411]">
        {children}
      </body>
    </html>
  );
}
