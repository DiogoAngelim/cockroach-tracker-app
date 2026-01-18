import * as React from 'react';
import { X, ChevronDown } from 'lucide-react';

export interface MultiTagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  options?: string[]; // available options for dropdown
}

export function MultiTagInput({ tags, onChange, placeholder, options = [] }: MultiTagInputProps) {
  const [input, setInput] = React.useState('');
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [highlightedIdx, setHighlightedIdx] = React.useState<number>(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
      setInput('');
      setDropdownOpen(false);
      setHighlightedIdx(-1);
    }
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter(t => t !== tag));
  };

  // Filter options for dropdown: not already selected, and matches input
  const filteredOptions = options.filter(
    opt => !tags.includes(opt) && (!input || opt.toLowerCase().includes(input.toLowerCase()))
  );

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      if (dropdownOpen && filteredOptions.length > 0 && highlightedIdx >= 0) {
        e.preventDefault();
        addTag(filteredOptions[highlightedIdx]);
      } else if (input.trim()) {
        e.preventDefault();
        addTag(input.trim());
      }
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    } else if (e.key === 'ArrowDown') {
      setDropdownOpen(true);
      setHighlightedIdx(idx => Math.min(idx + 1, filteredOptions.length - 1));
    } else if (e.key === 'Tab' && dropdownOpen && filteredOptions.length > 0) {
      e.preventDefault();
      setHighlightedIdx(idx => Math.min(idx + 1, filteredOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      setHighlightedIdx(idx => Math.max(idx - 1, 0));
    }
  };

  React.useEffect(() => {
    if (!dropdownOpen) setHighlightedIdx(-1);
    else if (filteredOptions.length > 0 && highlightedIdx === -1) setHighlightedIdx(0);
    else if (highlightedIdx >= filteredOptions.length) setHighlightedIdx(filteredOptions.length - 1);
  }, [dropdownOpen, filteredOptions.length]);

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-2 border border-border rounded-md px-2 py-1 bg-input focus-within:ring-2 focus-within:ring-ring">
        {tags.map(tag => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-destructive/20 text-destructive border border-destructive rounded-full px-2 py-0.5 text-sm font-medium"
            style={{ boxShadow: '0 0 0 1.5px #ef4444' }}
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-destructive hover:text-white rounded-full p-0.5 hover:bg-destructive/80 transition-colors"
              style={{ lineHeight: 0 }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          className="flex-1 min-w-[100px] bg-transparent outline-none text-base py-1 px-2"
          value={input}
          onChange={e => {
            setInput(e.target.value);
            setDropdownOpen(true);
            setHighlightedIdx(0);
          }}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setTimeout(() => setDropdownOpen(false), 120)}
        />
        {options.length > 0 && (
          <button
            type="button"
            className="ml-1 text-muted-foreground hover:text-primary"
            tabIndex={-1}
            onClick={() => setDropdownOpen(v => !v)}
            aria-label="Show options"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>
      {dropdownOpen && filteredOptions.length > 0 && (
        <div className="absolute left-0 z-10 mt-1 w-full rounded-md border border-border bg-popover shadow-lg max-h-40 overflow-auto">
          {filteredOptions.map((opt, idx) => (
            <div
              key={opt}
              className={
                "px-3 py-2 cursor-pointer text-foreground " +
                (idx === highlightedIdx ? "bg-destructive/20 text-destructive font-semibold" : "hover:bg-muted")
              }
              onMouseDown={e => {
                e.preventDefault();
                addTag(opt);
              }}
              onMouseEnter={() => setHighlightedIdx(idx)}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
