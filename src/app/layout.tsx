import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Klienthantering",
  description: "Klienthantering och testschemaläggning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#f8f9fa" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={`${inter.className} antialiased bg-white text-gray-900 dark:bg-gray-900 dark:text-white`}>
        {children}
      </body>
    </html>
  );
}
