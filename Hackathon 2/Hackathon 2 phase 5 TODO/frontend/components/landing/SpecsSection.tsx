"use client";

export default function SpecsSection() {
  const features = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "AI Natural Language Processing",
      description: "Just type naturally and let GPT-4 parse your tasks automatically",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      title: "Smart Tagging System",
      description: "Organize tasks with custom tags, filter and search instantly",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
      ),
      title: "Priority Management",
      description: "Color-coded priorities (Low/Medium/High) to focus on what matters",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Completion Tracking",
      description: "Track when tasks are completed with automatic date logging",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Secure & Private",
      description: "JWT authentication with complete user isolation per account",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      title: "Beautiful Dark Theme",
      description: "Premium obsidian dark UI with violet accents, easy on the eyes",
    },
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-zinc-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Powerful{" "}
            <span className="bg-gradient-to-r from-violet-500 to-violet-300 bg-clip-text text-transparent">
              Features
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need for effortless task management
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Dashboard Mockup */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-700 shadow-xl shadow-violet-500/10">
              {/* Browser Chrome */}
              <div className="bg-zinc-800 px-4 py-3 flex items-center gap-2 border-b border-zinc-700">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 ml-4">
                  <div className="bg-zinc-900 rounded px-3 py-1 text-xs text-gray-500 max-w-xs">
                    obsidianlist.app/dashboard
                  </div>
                </div>
              </div>

              {/* Mock Dashboard Content */}
              <div className="bg-black p-6">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
                    <div className="text-2xl font-bold text-violet-500">12</div>
                    <div className="text-xs text-gray-500">Pending</div>
                  </div>
                  <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
                    <div className="text-2xl font-bold text-green-500">24</div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </div>
                  <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
                    <div className="text-2xl font-bold text-red-500">5</div>
                    <div className="text-xs text-gray-500">High Priority</div>
                  </div>
                </div>

                {/* Task Cards */}
                <div className="space-y-3">
                  <div className="bg-zinc-900 rounded-lg p-4 border-l-4 border-red-500">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">Complete project docs</span>
                      <span className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/30">High</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 rounded bg-zinc-800 text-violet-300">work</span>
                      <span className="text-xs px-2 py-1 rounded bg-zinc-800 text-violet-300">urgent</span>
                    </div>
                  </div>

                  <div className="bg-zinc-900 rounded-lg p-4 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">Review pull requests</span>
                      <span className="text-xs px-2 py-1 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">Medium</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 rounded bg-zinc-800 text-violet-300">code</span>
                    </div>
                  </div>

                  <div className="bg-zinc-900 rounded-lg p-4 border-l-4 border-green-500 opacity-60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white line-through">Setup database</span>
                      <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/30">Done</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 -right-4 bg-violet-600 text-white px-4 py-2 rounded-lg shadow-lg shadow-violet-500/30">
              <span className="text-sm font-bold">Dark Mode UI</span>
            </div>
          </div>

          {/* Features List */}
          <div className="order-1 lg:order-2 space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 rounded-xl bg-black border border-zinc-700 hover:border-violet-500 transition-all group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-500 group-hover:bg-violet-500 group-hover:text-white transition-all">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
