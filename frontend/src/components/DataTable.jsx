import React from 'react'

/**
 * DataTable - Defense-grade Enterprise Data Table
 * Matches JAGA Design System (Design.md lines 208-212):
 * - Micro-padded rows (36px compact, 44px standard)
 * - Separated by 1px solid rgba(255, 255, 255, 0.06)
 * - Monospaced numerical values with tabular figures
 * - Sticky headers on #0D1130 with subtle borders
 */
const DataTable = ({
  columns = [],
  data = [],
  keyField = 'id',
  onRowClick = null,
  compact = false,
  loading = false,
  emptyMessage = 'Tidak ada entri data yang terdeteksi.',
  className = '',
}) => {
  const rowHeightClass = compact ? 'py-2 px-3 text-xs' : 'py-3 px-4 text-sm'
  const headerHeightClass = compact ? 'py-2 px-3 text-[11px]' : 'py-2.5 px-4 text-xs'

  return (
    <div className={`w-full overflow-x-auto rounded-sm border border-white/8 bg-[#080B24] ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead className="sticky top-0 bg-[#0D1130] z-10 border-b border-white/10 shadow-sm">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                className={`
                  ${headerHeightClass}
                  font-mono uppercase tracking-wider font-semibold text-[#859588]
                  ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                  ${col.width ? col.width : ''}
                `}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/6 font-sans">
          {loading ? (
            Array.from({ length: 5 }).map((_, rIdx) => (
              <tr key={rIdx} className="animate-pulse bg-[#0D1130]/30">
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className={rowHeightClass}>
                    <div className="h-4 bg-white/5 rounded-sm w-3/4" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-12 text-center text-sm text-[#859588] font-mono"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rIdx) => {
              const rowKey = row[keyField] || rIdx
              return (
                <tr
                  key={rowKey}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`
                    transition-colors duration-100 group
                    hover:bg-white/[0.04]
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                >
                  {columns.map((col, cIdx) => {
                    const value = row[col.key]
                    const rendered = col.render ? col.render(value, row, rIdx) : value

                    return (
                      <td
                        key={col.key || cIdx}
                        className={`
                          ${rowHeightClass}
                          text-[#DFE0FF]
                          ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                          ${col.isMono ? 'font-mono tabular-nums tracking-tight' : ''}
                        `}
                      >
                        {rendered}
                      </td>
                    )
                  })}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
