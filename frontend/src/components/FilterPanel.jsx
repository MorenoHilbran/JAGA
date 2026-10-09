import React from 'react'
import { Filter as FilterIcon, RotateCcw as ResetIcon } from 'lucide-react'
import JagaButton from './JagaButton'

/**
 * FilterPanel - Tactical Triage Query Filter
 * Matches JAGA Design System (Design.md)
 */
const FilterPanel = ({
  filters = {
    category: 'ALL',
    riskType: 'ALL',
    region: 'ALL',
    minScore: 0,
  },
  onChange,
  onReset,
  className = '',
}) => {
  const categories = [
    { value: 'ALL', label: 'SEMUA TINGKAT' },
    { value: 'CRITICAL', label: 'KRITIS (≥85)' },
    { value: 'HIGH', label: 'TINGGI (70-84)' },
    { value: 'MEDIUM', label: 'SEDANG (40-69)' },
    { value: 'LOW', label: 'RENDAH (<40)' },
  ]

  const riskTypes = [
    { value: 'ALL', label: 'Semua Pola Anomali' },
    { value: 'Referral Concentration', label: 'Konsentrasi Rujukan Sirkular' },
    { value: 'Phantom Billing', label: 'Klaim Fiktif (Ghost Patient)' },
    { value: 'Upcoding', label: 'Inflasi Diagnosis / Upcoding' },
    { value: 'Cloning Pattern', label: 'Kloning Berkas Klaim' },
    { value: 'Length of Stay Anomaly', label: 'Anomali Durasi Rawat (LOS)' },
  ]

  const regions = [
    { value: 'ALL', label: 'Seluruh Wilayah (Nasional)' },
    { value: 'DKI Jakarta', label: 'DKI Jakarta (Kedeputian Wil. IV)' },
    { value: 'Jawa Barat', label: 'Jawa Barat (Kedeputian Wil. V)' },
    { value: 'Jawa Timur', label: 'Jawa Timur (Kedeputian Wil. VII)' },
    { value: 'Sumatera Utara', label: 'Sumatera Utara (Kedeputian Wil. I)' },
    { value: 'Sulawesi Selatan', label: 'Sulawesi Selatan (Kedeputian Wil. IX)' },
  ]

  const handleChange = (key, val) => {
    if (onChange) {
      onChange({ ...filters, [key]: val })
    }
  }

  return (
    <div
      className={`
        bg-[#0D1130] border border-white/8 rounded-sm p-4 text-xs font-sans
        ${className}
      `}
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/6">
        <div className="flex items-center gap-2">
          <FilterIcon className="w-3.5 h-3.5 text-[#35F2A0]" />
          <span className="font-mono uppercase font-semibold text-[#DFE0FF] tracking-wider text-[11px]">
            PARAMETER FILTER TRIAGE
          </span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-[11px] font-mono text-[#859588] hover:text-[#DFE0FF] transition-colors"
        >
          <ResetIcon className="w-3 h-3" />
          <span>Reset Filter</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Kategori Risiko */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-[#859588] mb-1.5">
            Tingkat Risiko
          </label>
          <select
            value={filters.category || 'ALL'}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full bg-[#131735] text-[#DFE0FF] border border-white/10 rounded-sm px-2.5 py-1.5 focus:outline-none focus:border-[#35F2A0] text-xs font-mono"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value} className="bg-[#0D1130]">
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Pola Anomali */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-[#859588] mb-1.5">
            Pola Sindikat / Anomali
          </label>
          <select
            value={filters.riskType || 'ALL'}
            onChange={(e) => handleChange('riskType', e.target.value)}
            className="w-full bg-[#131735] text-[#DFE0FF] border border-white/10 rounded-sm px-2.5 py-1.5 focus:outline-none focus:border-[#35F2A0] text-xs font-sans"
          >
            {riskTypes.map((t) => (
              <option key={t.value} value={t.value} className="bg-[#0D1130]">
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Wilayah Kedeputian */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-[#859588] mb-1.5">
            Wilayah Kedeputian BPJS
          </label>
          <select
            value={filters.region || 'ALL'}
            onChange={(e) => handleChange('region', e.target.value)}
            className="w-full bg-[#131735] text-[#DFE0FF] border border-white/10 rounded-sm px-2.5 py-1.5 focus:outline-none focus:border-[#35F2A0] text-xs font-sans"
          >
            {regions.map((r) => (
              <option key={r.value} value={r.value} className="bg-[#0D1130]">
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Skor Minimal Slider */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[10px] font-mono uppercase text-[#859588]">
              Skor Risiko Min:
            </label>
            <span className="font-mono text-[11px] font-bold text-[#35F2A0]">
              ≥ {filters.minScore || 0}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={filters.minScore || 0}
            onChange={(e) => handleChange('minScore', Number(e.target.value))}
            className="w-full accent-[#35F2A0] h-1.5 bg-[#131735] rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}

export default FilterPanel
