import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "ATR - All The Rest",
    template: "%s | ATR",
  },
  description: "Your AI co-founder for building digital businesses",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "ATR - All The Rest",
    description: "Your AI co-founder for building digital businesses",
    type: "website",
    siteName: "ATR",
  },
  twitter: {
    card: "summary",
    title: "ATR - All The Rest",
    description: "Your AI co-founder for building digital businesses",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
        <Toaster richColors />
      </body>
    </html>
  );
}
