import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import InstallPWABanner from "@/components/install-pwa-banner";
import Navbar from "@/components/navbar/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: '#0c111d',
};

export const metadata: Metadata = {
  manifest:'/manifest.json',
  appleWebApp:{
    capable:true,
    statusBarStyle: 'default',
    title: "SkyBook - Premium Flight Booking",
  },
  title: "SkyBook | Premium, Secure & Seamless Flight Bookings",
  description: "Experience luxury air travel bookings with SkyBook. Highly secure transactions, PCI-DSS compliant checkout, real-time seat lock, and 100% encrypted flight confirmations.",
  keywords: ["flight booking", "luxury flights", "secure travel booking", "SkyBook flight bookings", "book flight seats"],
  authors: [{ name: "SkyBook Inc." }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-accent/30 selection:text-primary">
        <Navbar />
        <InstallPWABanner />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
