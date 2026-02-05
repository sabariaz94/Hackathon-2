"use client";

import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-black">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600 rounded-full blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-900 rounded-full blur-3xl opacity-10"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-violet-500/30 mb-8">
          <svg
            className="w-5 h-5 text-violet-500"
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
          <span className="text-sm text-violet-300 font-medium">
            Free Forever &bull; No Credit Card
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
          Ready to Master Your{" "}
          <span className="bg-gradient-to-r from-violet-500 to-violet-300 bg-clip-text text-transparent">
            Tasks
          </span>
          ?
        </h2>

        {/* Description */}
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Join thousands of users who have transformed their productivity with
          ObsidianList&apos;s AI-powered task management.
        </p>

        {/* CTA Button */}
        <Link
          href="/signup"
          className="inline-flex items-center justify-center gap-3 px-12 py-5 bg-violet-600 text-white text-xl font-bold rounded-xl shadow-xl shadow-violet-500/30 hover:bg-violet-700 hover:scale-105 transition-all duration-300"
        >
          <span>Start Managing Tasks</span>
          <svg
            className="w-6 h-6"
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

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-500">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>No Setup Required</span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>AI-Powered</span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>100% Private</span>
          </div>
        </div>
      </div>
    </section>
  );
}
