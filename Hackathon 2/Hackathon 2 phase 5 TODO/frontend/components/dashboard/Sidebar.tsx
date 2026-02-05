"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  username: string;
  onLogout: () => void;
}

export default function Sidebar({ username = "User", onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-obsidian-gray-900 border-r border-obsidian-gray-700 transition-all duration-300 z-40 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle */}
          <div className="p-4 border-b border-obsidian-gray-700">
            <div className="flex items-center justify-between">
              <Link href="/" className={isCollapsed ? "hidden" : "block"}>
                <span className="text-xl font-bold gradient-text">
                  ObsidianList
                </span>
              </Link>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 rounded-lg bg-obsidian-gray-800 hover:bg-obsidian-gray-700 text-gray-400 hover:text-white transition-all"
              >
                <svg
                  className={`w-5 h-5 transition-transform ${
                    isCollapsed ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                pathname === "/dashboard"
                  ? "bg-obsidian-violet-primary/10 text-obsidian-violet-light border-l-4 border-obsidian-violet-primary"
                  : "text-gray-400 hover:bg-obsidian-gray-800 hover:text-white"
              }`}
            >
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              <span className={isCollapsed ? "hidden" : "block"}>My Tasks</span>
            </Link>

            <Link
              href="/dashboard/ai-assistant"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                pathname === "/dashboard/ai-assistant"
                  ? "bg-obsidian-violet-primary/10 text-obsidian-violet-light border-l-4 border-obsidian-violet-primary"
                  : "text-gray-400 hover:bg-obsidian-gray-800 hover:text-white"
              }`}
            >
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className={isCollapsed ? "hidden" : "block"}>
                AI Assistant
              </span>
            </Link>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-obsidian-gray-800 hover:text-white transition-all">
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className={isCollapsed ? "hidden" : "block"}>Settings</span>
            </button>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-obsidian-gray-700">
            {/* User Info */}
            <div
              className={`flex items-center gap-3 mb-4 ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-obsidian-violet-primary flex items-center justify-center text-white font-bold">
                {(username || "U").charAt(0).toUpperCase()}
              </div>
              <div className={isCollapsed ? "hidden" : "block"}>
                <p className="text-white font-medium">{username || "User"}</p>
                <p className="text-xs text-gray-500">Free Plan</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-obsidian-gray-800 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className={isCollapsed ? "hidden" : "block"}>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-obsidian-gray-900 border border-obsidian-gray-700 rounded-xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Confirm Logout
              </h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to logout from your account?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-3 rounded-lg bg-obsidian-gray-800 text-white hover:bg-obsidian-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
