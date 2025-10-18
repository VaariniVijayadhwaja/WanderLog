"use client";

import { X } from "lucide-react";

interface HashtagSelectorProps {
  hashtags: string[]
  selectedHashtags: string[];
  onToggle: (hashtag: string) => void;
  onRemove: (hashtag: string) => void;
}

/**
 * HashtagSelector Component
 * Displays hashtags as clickable chips that can be selected/deselected
 */
const HashtagSelector = ({
  hashtags,
  selectedHashtags,
  onToggle,
  onRemove,
}: HashtagSelectorProps) => {
  if (hashtags.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-14-medium text-black-200">
        Click to select/deselect hashtags:
      </p>
      <div className="flex flex-wrap gap-2">
        {hashtags.map((hashtag) => {
          const isSelected = selectedHashtags.includes(hashtag);

          return (
            <div
              key={hashtag}
              className={`
                group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                cursor-pointer transition-all duration-200 text-14-medium
                ${
                  isSelected
                    ? "bg-primary-100 text-white-100 hover:bg-primary/90"
                    : "bg-black-200/10 text-black-200 hover:bg-black-200/20 border border-black-200/30"
                }
              `}
              onClick={() => onToggle(hashtag)}
            >
              <span>#{hashtag}</span>

              {/* Remove button (only show on hover for unselected, always for selected) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(hashtag);
                }}
                className={`
                  flex items-center justify-center w-4 h-4 rounded-full
                  transition-opacity duration-200
                  ${
                    isSelected
                      ? "bg-white-100/20 hover:bg-white-100/30 opacity-100"
                      : "bg-black-200/20 hover:bg-black-200/30 opacity-0 group-hover:opacity-100"
                  }
                `}
                aria-label={`Remove ${hashtag}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
      <p className="text-12-normal text-black-300">
        {selectedHashtags.length} hashtag{selectedHashtags.length !== 1 ? "s" : ""} selected
      </p>
    </div>
  );
};

export default HashtagSelector;

