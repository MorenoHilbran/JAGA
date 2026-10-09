import React, { useState } from 'react'
import { Search as SearchIcon, X as ClearIcon } from 'lucide-react'

/**
 * SearchInput - Defense-grade Triage Query Bar
 * Matches JAGA Design System (Design.md lines 213-216):
 * - Background #0D1130 with 1px solid rgba(255, 255, 255, 0.1)
 * - Focus state illuminates sharp 1px solid #35F2A0 hairline
 * - Query prefix chips (entity:, icd-10:, nik:, id:)
 */
const SearchInput = ({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Cari sindikat klaim, NIK, ID Faskes, atau ICD-10...',
  prefixes = ['entity:', 'icd-10:', 'nik:', 'id:'],
  onSelectPrefix,
  className = '',
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value)
    }
  }

  const handleClear = () => {
    if (onChange) {
      onChange({ target: { value: '' } })
    }
  }

  const handlePrefixClick = (prefix) => {
    if (onSelectPrefix) {
      onSelectPrefix(prefix)
    } else if (onChange) {
      const nextVal = value ? `${value} ${prefix}` : prefix
      onChange({ target: { value: nextVal } })
    }
  }

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      <div
        className={`
          relative flex items-center bg-[#0D1130] rounded-sm transition-all duration-150
          border ${isFocused ? 'border-[#35F2A0] shadow-[0_0_12px_rgba(53,242,160,0.15)]' : 'border-white/10 hover:border-white/20'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="pl-3 pr-2 text-[#859588] flex-shrink-0">
          <SearchIcon className="w-4 h-4 text-[#859588]" />
        </div>

        <input
          type="text"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full bg-transparent py-2.5 pr-8 text-sm text-[#DFE0FF] placeholder-[#859588] font-sans focus:outline-none"
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 p-1 text-[#859588] hover:text-[#DFE0FF] transition-colors"
            title="Bersihkan pencarian"
          >
            <ClearIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {prefixes && prefixes.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap px-0.5">
          <span className="text-[10px] font-mono text-[#859588] uppercase tracking-wider">
            Filter Cepat:
          </span>
          {prefixes.map((pref) => (
            <button
              key={pref}
              type="button"
              onClick={() => handlePrefixClick(pref)}
              className="text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] bg-[#131735] text-[#35F2A0]/90 border border-white/5 hover:border-[#35F2A0]/40 hover:bg-[#35F2A0]/10 transition-colors"
            >
              {pref}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchInput
