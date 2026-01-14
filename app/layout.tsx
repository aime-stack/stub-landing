import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://stubgram.app'),
  title: "Stubgram - Earn While You Connect | Social Media That Pays",
  description: "Join Stubgram and earn Snap Coins for every like, comment, and share. Access celebrity chat, learn from courses, and get paid for engaging. Download now!",
  keywords: ["social media", "earn money", "content creator", "celebrity chat", "online courses", "mobile money", "snap coins", "rewards platform"],
  authors: [{ name: "Stubgram" }],
  openGraph: {
    title: "Stubgram - The Social Platform That Pays You",
    description: "Earn coins for engagement. Access celebrity chat. Learn from courses. Cash out anytime.",
    url: "https://stubgram.app",
    siteName: "Stubgram",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Stubgram - Earn While You Connect",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stubgram - Social Media That Pays",
    description: "Earn Snap Coins for every interaction on the platform.",
    images: ["/og-image.png"],
    creator: "@stubgram",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
