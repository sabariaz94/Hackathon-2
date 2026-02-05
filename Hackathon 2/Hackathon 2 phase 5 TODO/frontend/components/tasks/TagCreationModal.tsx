"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PRESET_COLORS = [
  "#8B5CF6", "#EC4899", "#EF4444", "#F59E0B", "#10B981",
  "#3B82F6", "#6366F1", "#14B8A6", "#F97316", "#A855F7",
];

interface TagCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTag: (tag: { name: string; color: string }) => void;
}

export default function TagCreationModal({ isOpen, onClose, onCreateTag }: TagCreationModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await onCreateTag({ name: name.trim(), color });
      setName("");
      setColor(PRESET_COLORS[0]);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-obsidian-gray-900 border border-obsidian-gray-700 rounded-xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-4">Create New Tag</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Tag Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter tag name..."
                  className="w-full bg-obsidian-gray-800 border border-obsidian-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-obsidian-violet-primary focus:ring-1 focus:ring-obsidian-violet-primary transition-all"
                  autoFocus
                  maxLength={30}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full transition-all ${
                        color === c ? "ring-2 ring-white ring-offset-2 ring-offset-obsidian-gray-900 scale-110" : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: c }}
                      aria-label={`Select color ${c}`}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Preview</label>
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  {name || "Tag name"}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-obsidian-gray-800 text-white hover:bg-obsidian-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || isSubmitting}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-obsidian-violet-primary text-white hover:bg-obsidian-violet-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Create Tag"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
