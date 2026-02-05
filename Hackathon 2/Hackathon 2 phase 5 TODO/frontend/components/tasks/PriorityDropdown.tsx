"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PriorityDropdownProps {
  value: "low" | "medium" | "high";
  onChange: (value: "low" | "medium" | "high") => void;
}

const priorities = [
  { value: "high" as const, label: "High", color: "bg-red-500", textColor: "text-red-400" },
  { value: "medium" as const, label: "Medium", color: "bg-yellow-500", textColor: "text-yellow-400" },
  { value: "low" as const, label: "Low", color: "bg-green-500", textColor: "text-green-400" },
];

export default function PriorityDropdown({ value, onChange }: PriorityDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = priorities.find((p) => p.value === value) || priorities[1];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 bg-obsidian-gray-800 border border-obsidian-gray-700 rounded-lg px-4 py-2.5 text-white hover:border-obsidian-violet-primary focus:border-obsidian-violet-primary focus:ring-1 focus:ring-obsidian-violet-primary transition-all"
        aria-label="Select priority"
        aria-expanded={isOpen}
      >
        <span className={`w-3 h-3 rounded-full ${selected.color}`} />
        <span className="flex-1 text-left">{selected.label}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-obsidian-gray-800 border border-obsidian-gray-700 rounded-lg shadow-xl overflow-hidden"
          >
            {priorities.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => {
                  onChange(p.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-obsidian-gray-700 ${
                  p.value === value ? "bg-obsidian-gray-700" : ""
                }`}
              >
                <span className={`w-3 h-3 rounded-full ${p.color}`} />
                <span className={p.value === value ? p.textColor : "text-gray-300"}>
                  {p.label}
                </span>
                {p.value === value && (
                  <svg className="w-4 h-4 ml-auto text-obsidian-violet-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
