import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Building2 } from 'lucide-react';

export const SearchableSelect = ({
  options = [],
  value = '',
  onChange,
  placeholder = 'Select your School or College...',
  error = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      
      {/* Input / Selector Box */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between py-3.5 px-4 rounded-2xl bg-[var(--bg-primary)] border text-left transition-all ${
          error
            ? 'border-red-500 text-red-500'
            : isOpen
            ? 'border-[var(--orange)] ring-2 ring-[var(--orange)]/20'
            : 'border-[var(--border-color)] text-[var(--text-primary)]'
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <Building2 className="w-5 h-5 text-[var(--orange)] flex-shrink-0" />
          <span className={`text-sm font-semibold truncate ${value ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-muted)]'}`}>
            {value || placeholder}
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 text-[var(--text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[var(--orange)]' : ''}`} />
      </button>

      {/* Floating Dropdown List */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 z-50 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden max-h-72 flex flex-col animate-in fade-in slide-in-from-top-2">
          
          {/* Search Header */}
          <div className="p-3 border-b border-[var(--border-color)] bg-[var(--bg-tertiary)] sticky top-0 z-10">
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search institution name..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                autoFocus
              />
            </div>
          </div>

          {/* Options Scroll List */}
          <div className="overflow-y-auto py-1 divide-y divide-[var(--border-color)]/30">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className={`w-full text-left px-4 py-3 text-xs font-semibold flex items-center justify-between hover:bg-[var(--orange)]/10 hover:text-[var(--orange)] transition-colors ${
                    value === item ? 'bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold' : 'text-[var(--text-primary)]'
                  }`}
                >
                  <span className="truncate pr-2">{item}</span>
                  {value === item && <Check className="w-4 h-4 text-[var(--orange)] flex-shrink-0" />}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-[var(--text-muted)]">
                No matching institutions found.{' '}
                <button
                  type="button"
                  onClick={() => handleSelect('OTHER')}
                  className="text-[var(--orange)] underline font-bold"
                >
                  Select "OTHER"
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {error && <p className="text-xs text-red-500 font-bold mt-1">{error}</p>}
    </div>
  );
};
