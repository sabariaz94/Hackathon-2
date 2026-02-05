"use client";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Speak Naturally",
      description:
        "Just type what you need to do in plain English. Our AI understands context, urgency, and details.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      ),
      example: "Buy groceries tomorrow, high priority",
    },
    {
      number: "02",
      title: "AI Processes",
      description:
        "Our GPT-4 powered assistant extracts title, priority, tags, and due dates automatically.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      example: "→ Title: Buy groceries • Priority: High • Tags: shopping",
    },
    {
      number: "03",
      title: "Organized Beautifully",
      description:
        "Tasks appear in your dashboard with color-coded priorities, tags, and smart filtering.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
      example: "Filter by priority, search, sort by date",
    },
    {
      number: "04",
      title: "Track Progress",
      description:
        "Mark tasks complete, view statistics, and stay motivated with visual progress tracking.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      example: "12 completed • 5 pending • 3 high priority",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-zinc-900">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          How It{" "}
          <span className="bg-gradient-to-r from-violet-500 to-violet-300 bg-clip-text text-transparent">
            Works
          </span>
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Four simple steps to effortless task management with AI-powered intelligence
        </p>
      </div>

      {/* Steps Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step) => (
          <div
            key={step.number}
            className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-xl p-6 hover:border-violet-500 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 group"
          >
            {/* Step Number */}
            <div className="text-6xl font-bold text-zinc-700 mb-4 group-hover:text-violet-500 transition-colors">
              {step.number}
            </div>

            {/* Icon */}
            <div className="w-16 h-16 rounded-xl bg-zinc-800 flex items-center justify-center text-violet-500 mb-6 group-hover:bg-violet-500 group-hover:text-white transition-all shadow-lg shadow-violet-500/10">
              {step.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>

            {/* Description */}
            <p className="text-gray-400 mb-4 leading-relaxed">{step.description}</p>

            {/* Example */}
            <div className="mt-auto pt-4 border-t border-zinc-700">
              <p className="text-sm text-violet-300 font-mono">{step.example}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
