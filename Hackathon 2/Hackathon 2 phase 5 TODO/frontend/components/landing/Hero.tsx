"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>

      {/* Animated Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-500 rounded-full blur-3xl opacity-20"></div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 mb-8">
          <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-violet-300 font-medium">
            AI-Powered Task Management
          </span>
        </div>

        {/* Main Heading with Gradient */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6">
          <span className="bg-gradient-to-r from-violet-500 to-violet-300 bg-clip-text text-transparent">
            ObsidianList
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-400 mb-4 max-w-3xl mx-auto">
          Premium dark task manager with{" "}
          <span className="text-violet-300 font-semibold">AI assistant</span>,{" "}
          <span className="text-violet-300 font-semibold">priority tracking</span>, and
          elegant UI
        </p>

        <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
          Speak naturally, manage effortlessly. Your tasks, beautifully organized in
          pure obsidian darkness.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
          >
            <span>Get Started Free</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>

          <Link
            href="#how-it-works"
            className="inline-flex items-center gap-2 bg-transparent border border-violet-500 text-violet-300 hover:bg-violet-500 hover:text-white font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-300"
          >
            See How It Works
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 text-gray-400">
            <svg
              className="w-6 h-6 text-violet-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span>AI Natural Language</span>
          </div>

          <div className="flex items-center justify-center gap-3 text-gray-400">
            <svg
              className="w-6 h-6 text-violet-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>Secure & Private</span>
          </div>

          <div className="flex items-center justify-center gap-3 text-gray-400">
            <svg
              className="w-6 h-6 text-violet-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
            <span>Beautiful Dark UI</span>
          </div>
        </div>
      </div>

      {/* Side Decorations */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-violet-900 rounded-full blur-3xl opacity-10"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500 rounded-full blur-3xl opacity-10"></div>
    </section>
  );
}
