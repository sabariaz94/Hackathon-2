"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TagCreationModal from "./TagCreationModal";

export interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TagInputProps {
  selectedTagIds: string[];
  availableTags: Tag[];
  onChange: (tagIds: string[]) => void;
  onCreateTag?: (tag: { name: string; color: string }) => Promise<void>;
}

export default function TagInput({ selectedTagIds, availableTags, onChange, onCreateTag }: TagInputProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredTags = availableTags.filter(
    (tag) =>
      !selectedTagIds.includes(tag.id) &&
      tag.name.toLowerCase().includes(query.toLowerCase())
  );

  const selectedTags = availableTags.filter((t) => selectedTagIds.includes(t.id));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addTag = (tagId: string) => {
    onChange([...selectedTagIds, tagId]);
    setQuery("");
    setIsOpen(false);
  };

  const removeTag = (tagId: string) => {
    onChange(selectedTagIds.filter((id) => id !== tagId));
  };

  return (
    <>
      <div ref={containerRef} className="relative">
        {/* Selected tag badges */}
        <div className="flex flex-wrap gap-2 mb-2">
          <AnimatePresence>
            {selectedTags.map((tag) => (
              <motion.span
                key={tag.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
              >
                {tag.name}
                <button
                  type="button"
                  onClick={() => removeTag(tag.id)}
                  className="ml-1 hover:opacity-70 transition-opacity"
                  aria-label={`Remove tag ${tag.name}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {/* Input with autocomplete */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search tags..."
              className="w-full bg-obsidian-gray-800 border border-obsidian-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-obsidian-violet-primary focus:ring-1 focus:ring-obsidian-violet-primary transition-all"
            />

            <AnimatePresence>
              {isOpen && filteredTags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute z-50 w-full mt-1 max-h-40 overflow-y-auto bg-obsidian-gray-800 border border-obsidian-gray-700 rounded-lg shadow-xl"
                >
                  {filteredTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => addTag(tag.id)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-obsidian-gray-700 transition-colors"
                    >
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                      <span className="text-gray-300">{tag.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {onCreateTag && (
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-2.5 rounded-lg bg-obsidian-violet-primary/20 text-obsidian-violet-light hover:bg-obsidian-violet-primary/30 transition-all border border-obsidian-violet-primary/30"
              aria-label="Add new tag"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {onCreateTag && (
        <TagCreationModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateTag={onCreateTag}
        />
      )}
    </>
  );
}
