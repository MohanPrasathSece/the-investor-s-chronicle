import React, { useState, useRef, useEffect } from "react";
import { COUNTRIES } from "../lib/phoneValidation";
import { ChevronDown, Check, Search } from "lucide-react";

interface CountrySelectProps {
  value: string;
  onChange: (code: string) => void;
  className?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedCountry = COUNTRIES.find((c) => c.code === value) || COUNTRIES[0];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.dialCode.includes(search)
  );

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch("");
        }}
        className="flex items-center justify-between gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-3 text-sm text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition h-12 w-full cursor-pointer hover:bg-white/10 whitespace-nowrap"
      >
        <span className="flex items-center gap-1.5">
          <span className="text-base leading-none">{selectedCountry.flag}</span>
          <span className="text-xs font-semibold text-slate-350">
            {selectedCountry.code === "GEN" ? "Other" : selectedCountry.dialCode || selectedCountry.code}
          </span>
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-purple-400" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 max-h-72 w-[240px] overflow-hidden rounded-xl border border-white/10 bg-[#131218]/95 backdrop-blur-xl p-1.5 shadow-2xl flex flex-col shadow-purple-950/20">
          {/* Search Input */}
          <div className="relative mb-1.5 p-1 flex items-center border-b border-white/5">
            <Search className="absolute left-3 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            />
          </div>

          {/* List options */}
          <div className="flex-1 overflow-y-auto max-h-48 space-y-0.5 scrollbar-thin scrollbar-thumb-white/10">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c) => {
                const isSelected = c.code === value;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      onChange(c.code);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between w-full rounded-lg px-3 py-2 text-left text-xs transition duration-150 cursor-pointer ${
                      isSelected
                        ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 font-bold"
                        : "text-slate-350 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base leading-none">{c.flag}</span>
                      <span className="font-medium truncate max-w-[110px]">{c.name}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className={`text-[10px] ${isSelected ? "text-purple-300" : "text-slate-500"}`}>
                        {c.dialCode}
                      </span>
                      {isSelected && <Check className="h-3 w-3 text-purple-400" />}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="py-4 text-center text-xs text-slate-500">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
