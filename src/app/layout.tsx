import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

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
      <body className={`${inter.className} antialiased bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
