import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "ObsidianList - Premium Dark Task Management",
  description:
    "Obsidian-themed task manager with AI assistant, priority management, and elegant dark UI. Built with Next.js, FastAPI, and OpenAI.",
  keywords: [
    "task manager",
    "todo list",
    "dark theme",
    "AI assistant",
    "productivity",
    "Next.js",
    "ObsidianList",
  ],
  authors: [{ name: "ObsidianList Team" }],
  openGraph: {
    title: "ObsidianList - Premium Dark Task Management",
    description:
      "Elegant task management with AI-powered natural language input, priority tracking, and beautiful dark UI.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ObsidianList - Premium Dark Task Management",
    description:
      "Elegant task management with AI-powered natural language input",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
