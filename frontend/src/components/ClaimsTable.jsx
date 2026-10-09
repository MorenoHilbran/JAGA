import React, { useState } from 'react'
import { Download, Search, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react'
import DataTable from './DataTable'
import JagaButton from './JagaButton'
import RiskBadge from './RiskBadge'

/**
 * ClaimsTable - Granular Network Claims Inspection Table
 * Matches UU PDP privacy regulations with masked NIK & patient identifiers.
 */
const ClaimsTable = ({
  claims = null,
  networkId = 'NET-2026-001',
}) => {
  const defaultClaims = [
    {
      claim_id: 'CLM-2026-JKN-9021',
      date: '2026-10-08',
      patient_masked: 'Tn. B**** S***** (NIK: 317102******0004)',
      doctor: 'dr. Ahmad Fachri, Sp.JP',
      faskes: 'RSUD T',
      icd10: 'I50.9 (Heart Failure)',
      procedure: '37.22 (Left Heart Angiography)',
      amount: 14850000,
      similarity_score: 98.2,
      flags: ['KLONING BERKAS', 'RUJUKAN SIRKULAR'],
    },
    {
      claim_id: 'CLM-2026-JKN-9022',
      date: '2026-10-08',
      patient_masked: 'Ny. S**** M***** (NIK: 317105******0002)',
      doctor: 'dr. Ahmad Fachri, Sp.JP',
      faskes: 'RSUD T',
      icd10: 'I50.9 (Heart Failure)',
      procedure: '37.22 (Left Heart Angiography)',
      amount: 14850000,
      similarity_score: 97.9,
      flags: ['KLONING BERKAS'],
    },
    {
      claim_id: 'CLM-2026-JKN-8841',
      date: '2026-10-07',
      patient_masked: 'Tn. H***** W***** (NIK: 327503******0011)',
      doctor: 'dr. Budi Santoso, Sp.PD',
      faskes: 'Klinik Pratama P',
      icd10: 'E11.9 (Type 2 Diabetes)',
      procedure: '89.52 (Electrocardiogram)',
      amount: 4200000,
      similarity_score: 84.1,
      flags: ['UPCODING RINGAN'],
    },
    {
      claim_id: 'CLM-2026-JKN-8842',
      date: '2026-10-06',
      patient_masked: 'Ny. D**** A***** (NIK: 317409******0008)',
      doctor: 'dr. Siti Aminah, Sp.A',
      faskes: 'RSIA K',
      icd10: 'J18.9 (Pneumonia Berat)',
      procedure: '96.71 (Continuous Mech Ventilation)',
      amount: 18200000,
      similarity_score: 92.4,
      flags: ['UPCODING SEVERITY', 'LOS ANOMALY'],
    },
    {
      claim_id: 'CLM-2026-JKN-8710',
      date: '2026-10-05',
      patient_masked: 'Tn. R***** K***** (NIK: 327501******0003)',
      doctor: 'dr. Ahmad Fachri, Sp.JP',
      faskes: 'RSUD T',
      icd10: 'I50.9 (Heart Failure)',
      procedure: '37.22 (Left Heart Angiography)',
      amount: 14850000,
      similarity_score: 98.4,
      flags: ['KLONING BERKAS'],
    },
  ]

  const [claimList] = useState(claims || defaultClaims)
  const [filterText, setFilterText] = useState('')

  const filtered = claimList.filter((c) => {
    if (!filterText) return true
    const q = filterText.toLowerCase()
    return (
      c.claim_id.toLowerCase().includes(q) ||
      c.doctor.toLowerCase().includes(q) ||
      c.icd10.toLowerCase().includes(q) ||
      c.patient_masked.toLowerCase().includes(q)
    )
  })

  const exportCSV = () => {
    const headers = 'ID_Klaim,Tanggal,Pasien_Masked,Dokter,Faskes,Diagnosis,Nominal,Similarity\n'
    const rows = filtered
      .map(
        (c) =>
          `"${c.claim_id}","${c.date}","${c.patient_masked}","${c.doctor}","${c.faskes}","${c.icd10}","${c.amount}","${c.similarity_score}%"`
      )
      .join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `jaga_claims_${networkId}.csv`
    a.click()
  }

  const columns = [
    {
      header: 'ID KLAIM & WAKTU',
      key: 'claim_id',
      render: (id, row) => (
        <div>
          <span className="font-mono font-bold text-xs text-[#35F2A0] block">
            {id}
          </span>
          <span className="text-[10px] font-mono text-[#859588]">
            {row.date} • {row.faskes}
          </span>
        </div>
      ),
    },
    {
      header: 'IDENTITAS PESERTA (MASKED UU PDP)',
      key: 'patient_masked',
      render: (val) => (
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#35F2A0] flex-shrink-0" />
          <span className="font-mono text-xs text-[#DFE0FF] truncate">
            {val}
          </span>
        </div>
      ),
    },
    {
      header: 'DOKTER PENANGGUNG JAWAB',
      key: 'doctor',
      render: (doc) => (
        <span className="text-xs text-[#DFE0FF] font-medium block">
          {doc}
        </span>
      ),
    },
    {
      header: 'DIAGNOSIS & TINDAKAN',
      key: 'icd10',
      render: (diag, row) => (
        <div>
          <span className="text-xs font-semibold text-[#DFE0FF] block">
            {diag}
          </span>
          <span className="text-[10px] text-[#859588] font-mono block">
            Tindakan: {row.procedure}
          </span>
        </div>
      ),
    },
    {
      header: 'NOMINAL KLAIM',
      key: 'amount',
      align: 'right',
      isMono: true,
      render: (amt) => (
        <span className="text-xs font-bold text-white font-mono">
          Rp {amt.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      header: 'KESAMAAN (SIMILARITY)',
      key: 'similarity_score',
      align: 'center',
      render: (score) => (
        <span
          className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded-[2px] border ${
            score >= 95
              ? 'text-[#FF7A85] bg-[#FF5C67]/10 border-[#FF5C67]/30'
              : 'text-[#FFAE66] bg-[#FF9F43]/10 border-[#FF9F43]/30'
          }`}
        >
          {score}%
        </span>
      ),
    },
    {
      header: 'FLAG ANOMALI',
      key: 'flags',
      render: (flags) => (
        <div className="flex items-center gap-1 flex-wrap">
          {flags.map((f, i) => (
            <span
              key={i}
              className="px-1.5 py-0.2 rounded-[2px] bg-white/5 border border-white/10 text-[9px] font-mono text-[#BACBBD]"
            >
              {f}
            </span>
          ))}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-3">
      {/* Search and Export Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#859588]" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Cari ID Klaim, Dokter, atau Diagnosis..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#0D1130] text-[#DFE0FF] border border-white/10 rounded-sm focus:outline-none focus:border-[#35F2A0]"
          />
        </div>

        <JagaButton
          variant="secondary"
          size="sm"
          onClick={exportCSV}
          icon={<Download className="w-3.5 h-3.5" />}
        >
          Ekspor CSV Berkas
        </JagaButton>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        keyField="claim_id"
        compact={true}
        emptyMessage="Tidak ada data klaim yang sesuai."
      />
    </div>
  )
}

export default ClaimsTable
