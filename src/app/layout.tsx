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
  title: "GoofyUI - Wonderfully Terrible UI Designs",
  description: "A collection of the most wonderfully terrible UI designs. Frustrating? Yes. Hilarious? Absolutely!",
  metadataBase: new URL('https://goofyui.vercel.app'),
  openGraph: {
    title: "GoofyUI - Wonderfully Terrible UI Designs",
    description: "A collection of the most wonderfully terrible UI designs. Frustrating? Yes. Hilarious? Absolutely!",
    images: [
      {
        url: '/preview.png',
        width: 1200,
        height: 630,
        alt: 'GoofyUI Preview',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "GoofyUI - Wonderfully Terrible UI Designs",
    description: "A collection of the most wonderfully terrible UI designs. Frustrating? Yes. Hilarious? Absolutely!",
    images: ['/preview.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
