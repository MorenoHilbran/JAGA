import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldAlert,
  Search,
  Filter,
  FileText,
  Building2,
  Users,
  ChevronRight,
  SlidersHorizontal,
  Download,
  AlertTriangle,
  CheckCircle2,
  Network,
  Clock,
  ArrowUpRight,
} from 'lucide-react'
import {
  JagaCard,
  StatCard,
  JagaButton,
  RiskBadge,
  RiskScoreGauge,
  SearchInput,
  FilterPanel,
  DataTable,
} from '../components'
import { getRiskNetworks, getDashboardStats } from '../services/api'
import { useJagaTheme } from '../context/ThemeContext'

// Comprehensive Investigation Mock Cases
const INVESTIGATION_CASES = [
  {
    network_id: 'NET-2026-JKN-089',
    name: 'Sindikat Rujukan Sirkular RSUD T-P-K',
    risk_score: 94,
    risk_category: 'CRITICAL',
    primary_risk_type: 'Referral Concentration',
    total_claim_amount: 18450000000,
    entity_count: { faskes: 4, doctors: 9, patients: 412, claims: 864 },
    region: 'DKI Jakarta',
    detected_at: '2026-10-09 08:42 WIB',
    status: 'Triage Dibutuhkan',
    top_icd10: 'I50.9 (Gagal Jantung)',
    confidence: '98.4%',
    stage: 'active',
    assigned_auditor: 'Auditor Moreno (L3)',
  },
  {
    network_id: 'NET-2026-JKN-074',
    name: 'Kloning Berkas Rawat Inap Faskes Pratama X',
    risk_score: 89,
    risk_category: 'CRITICAL',
    primary_risk_type: 'Cloning Pattern',
    total_claim_amount: 11200000000,
    entity_count: { faskes: 2, doctors: 4, patients: 280, claims: 412 },
    region: 'Jawa Barat',
    detected_at: '2026-10-08 17:15 WIB',
    status: 'Triage Dibutuhkan',
    top_icd10: 'A09 (Diare & Gastroenteritis)',
    confidence: '96.1%',
    stage: 'active',
    assigned_auditor: 'Auditor Moreno (L3)',
  },
  {
    network_id: 'NET-2026-JKN-061',
    name: 'Inflasi Diagnosis Sistemik (Upcoding Sub-akut)',
    risk_score: 82,
    risk_category: 'HIGH',
    primary_risk_type: 'Upcoding',
    total_claim_amount: 8750000000,
    entity_count: { faskes: 1, doctors: 6, patients: 530, claims: 620 },
    region: 'Jawa Timur',
    detected_at: '2026-10-07 11:30 WIB',
    status: 'Sedang Diinvestigasi',
    top_icd10: 'J18.9 (Pneumonia Berat)',
    confidence: '91.8%',
    stage: 'under_review',
    assigned_auditor: 'Auditor Hendra (L2)',
  },
  {
    network_id: 'NET-2026-JKN-055',
    name: 'Klaim Peserta Non-Hadir (Ghost Billing Farmasi)',
    risk_score: 78,
    risk_category: 'HIGH',
    primary_risk_type: 'Ghost Billing',
    total_claim_amount: 6400000000,
    entity_count: { faskes: 3, doctors: 5, patients: 195, claims: 340 },
    region: 'Sumatera Utara',
    detected_at: '2026-10-06 14:20 WIB',
    status: 'Sedang Diinvestigasi',
    top_icd10: 'E11.9 (Diabetes Mellitus Tipe 2)',
    confidence: '88.5%',
    stage: 'under_review',
    assigned_auditor: 'Auditor Dian (L3)',
  },
  {
    network_id: 'NET-2026-JKN-047',
    name: 'Prolonged Length of Stay (LOS Artifisial) Kelas 3',
    risk_score: 71,
    risk_category: 'HIGH',
    primary_risk_type: 'Excessive LOS',
    total_claim_amount: 4100000000,
    entity_count: { faskes: 1, doctors: 3, patients: 142, claims: 210 },
    region: 'Sulawesi Selatan',
    detected_at: '2026-10-05 09:10 WIB',
    status: 'Monitoring Rutin',
    top_icd10: 'K29.7 (Gastritis)',
    confidence: '82.0%',
    stage: 'escalated',
    assigned_auditor: 'Auditor Moreno (L3)',
  },
  {
    network_id: 'NET-2026-JKN-038',
    name: 'Split Claiming Laboratorium Patologi Mitra',
    risk_score: 55,
    risk_category: 'MEDIUM',
    primary_risk_type: 'Split Claiming',
    total_claim_amount: 1950000000,
    entity_count: { faskes: 1, doctors: 2, patients: 88, claims: 154 },
    region: 'DKI Jakarta',
    detected_at: '2026-10-04 16:45 WIB',
    status: 'Monitoring Rutin',
    top_icd10: 'Z01.7 (Lab Patologi)',
    confidence: '79.5%',
    stage: 'escalated',
    assigned_auditor: 'Auditor Budi (L1)',
  },
]

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val)
}

const Investigation = () => {
  const navigate = useNavigate()
  const { isDark } = useJagaTheme()

  const [cases, setCases] = useState(INVESTIGATION_CASES)
  const [loading, setLoading] = useState(false)
  const [activeStage, setActiveStage] = useState('ALL') // ALL | active | under_review | escalated
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: 'ALL',
    riskType: 'ALL',
    region: 'ALL',
    minScore: 0,
  })

  // Quick Stats
  const stats = useMemo(() => {
    const total = cases.length
    const critical = cases.filter((c) => c.risk_category === 'CRITICAL').length
    const underReview = cases.filter((c) => c.stage === 'under_review').length
    const escalated = cases.filter((c) => c.stage === 'escalated').length
    const totalAmount = cases.reduce((acc, c) => acc + (c.total_claim_amount || 0), 0)
    return { total, critical, underReview, escalated, totalAmount }
  }, [cases])

  // Filtered Cases
  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      // Stage tab filter
      if (activeStage !== 'ALL' && item.stage !== activeStage) return false

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchId = item.network_id.toLowerCase().includes(q)
        const matchName = (item.name || '').toLowerCase().includes(q)
        const matchType = (item.primary_risk_type || '').toLowerCase().includes(q)
        const matchRegion = (item.region || '').toLowerCase().includes(q)
        if (!matchId && !matchName && !matchType && !matchRegion) return false
      }

      // Category
      if (filters.category !== 'ALL' && item.risk_category !== filters.category) return false

      // Risk Type
      if (filters.riskType !== 'ALL' && item.primary_risk_type !== filters.riskType) return false

      // Region
      if (filters.region !== 'ALL' && item.region !== filters.region) return false

      // Min Score
      if (item.risk_score < filters.minScore) return false

      return true
    })
  }, [cases, activeStage, searchQuery, filters])

  const stageTabs = [
    { id: 'ALL', label: 'Semua Berkas', count: cases.length },
    { id: 'active', label: 'Triage Dibutuhkan', count: cases.filter((c) => c.stage === 'active').length },
    { id: 'under_review', label: 'Sedang Diperiksa', count: cases.filter((c) => c.stage === 'under_review').length },
    { id: 'escalated', label: 'Eskalasi & Audit', count: cases.filter((c) => c.stage === 'escalated').length },
  ]

  const columns = [
    {
      header: 'KASUS SINDIKAT / IDENTITAS',
      key: 'network_id',
      width: 'w-[280px]',
      render: (id, row) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs text-[#35F2A0] group-hover:underline">
              {id}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] bg-white/5 text-[#9CA7C5] border border-white/10">
              {row.region}
            </span>
          </div>
          <span className={`text-xs font-medium mt-0.5 line-clamp-1 ${isDark ? 'text-[#DFE0FF]' : 'text-slate-900'}`}>
            {row.name}
          </span>
          <span className="text-[11px] text-[#859588] font-mono mt-0.5">
            ICD-10: {row.top_icd10}
          </span>
        </div>
      ),
    },
    {
      header: 'SKOR & LEVEL RISIKO',
      key: 'risk_score',
      width: 'w-[180px]',
      render: (score, row) => (
        <div className="flex items-center gap-2.5">
          <RiskScoreGauge score={score} size="sm" />
          <div className="flex flex-col gap-1">
            <RiskBadge category={row.risk_category} size="xs" pulse={row.risk_category === 'CRITICAL'} />
            <span className="text-[10px] font-mono text-[#859588]">
              Konsensus: {row.confidence}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'TIPOLOGI FRAUD',
      key: 'primary_risk_type',
      width: 'w-[190px]',
      render: (type) => (
        <div className="flex flex-col">
          <span className={`text-xs font-semibold font-sans ${isDark ? 'text-[#DFE0FF]' : 'text-slate-800'}`}>
            {type}
          </span>
          <span className="text-[10px] font-mono text-[#859588]">
            Multi-Layer Anomaly Pattern
          </span>
        </div>
      ),
    },
    {
      header: 'ENTITAS TERLIBAT',
      key: 'entity_count',
      width: 'w-[160px]',
      render: (counts) => (
        <div className="flex items-center gap-2 text-[11px] font-mono text-[#9CA7C5]">
          <span title="Faskes" className="flex items-center gap-1">
            <Building2 className="w-3 h-3 text-[#35F2A0]" />
            {counts.faskes}
          </span>
          <span>•</span>
          <span title="Dokter" className="flex items-center gap-1">
            <Users className="w-3 h-3 text-[#FFAE66]" />
            {counts.doctors}
          </span>
          <span>•</span>
          <span>{counts.patients} Pasien</span>
        </div>
      ),
    },
    {
      header: 'PAPARAN KLAIM',
      key: 'total_claim_amount',
      width: 'w-[180px]',
      align: 'right',
      render: (amount) => (
        <div className="text-right">
          <span className={`text-xs font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {formatRupiah(amount)}
          </span>
          <div className="text-[10px] text-[#FF5C67] font-mono">
            Audit Prioritas
          </div>
        </div>
      ),
    },
    {
      header: 'AKSI INVESTIGASI',
      key: 'actions',
      width: 'w-[140px]',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
          <JagaButton
            size="xs"
            variant="primary"
            onClick={() => navigate(`/network/${row.network_id}`)}
            iconRight={<ChevronRight className="w-3 h-3" />}
          >
            Buka Berkas
          </JagaButton>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      {/* 1. Header */}
      <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-3 border-b ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF5C67] animate-pulse" />
            <span className={`text-[11px] font-mono uppercase tracking-widest font-semibold ${isDark ? 'text-[#FF5C67]' : 'text-red-600'}`}>
              MODUL WORKSPACE // INVESTIGASI BERKAS SINDIKAT
            </span>
          </div>
          <h1 className={`text-2xl font-bold font-headline tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Ruang Kerja Investigasi & Audit Berkas
          </h1>
          <p className={`text-xs font-sans mt-0.5 ${isDark ? 'text-[#9CA7C5]' : 'text-slate-500'}`}>
            Daftar lengkap berkas sindikat terdeteksi, rekonstruksi graf relasional per kasus, dan otorisasi tindakan triage resmi BPJS Kesehatan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <JagaButton
            variant="tactical"
            size="sm"
            onClick={() => alert('Laporan rekapitulasi berkas investigasi berhasil diekspor (PDF/Excel).')}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Ekspor Rekap Berkas
          </JagaButton>
        </div>
      </div>

      {/* 2. Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          label="Total Berkas Kasus"
          value={stats.total}
          suffix="Sindikat"
          caption="Terdaftar di database Apache AGE"
          delta="Aktif"
          deltaType="signal"
          variant="signal"
          icon={<Network className="w-4 h-4 text-[#35F2A0]" />}
        />
        <StatCard
          label="Kasus Kritis Butuh Tindakan"
          value={stats.critical}
          suffix="Kasus"
          caption="Skor anomali ≥ 85 (Urgent)"
          delta="Prioritas 1"
          deltaType="danger"
          variant="critical"
          icon={<ShieldAlert className="w-4 h-4 text-[#FF5C67]" />}
        />
        <StatCard
          label="Dalam Pemeriksaan Lapangan"
          value={stats.underReview}
          suffix="Berkas"
          caption="Verifikator aktif di faskes"
          delta="Audit Fisik"
          deltaType="neutral"
          icon={<FileText className="w-4 h-4 text-[#FFAE66]" />}
        />
        <StatCard
          label="Total Nilai Klaim Terpapar"
          value={(stats.totalAmount / 1000000000).toFixed(1)}
          prefix="Rp"
          suffix="M"
          caption="Potensi penyelamatan dana JKN"
          delta="Dana Terlindungi"
          deltaType="positive"
          icon={<CheckCircle2 className="w-4 h-4 text-[#35F2A0]" />}
        />
      </div>

      {/* 3. Stage Navigation Tabs */}
      <div className={`border-b flex items-center gap-1 overflow-x-auto ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
        {stageTabs.map((tab) => {
          const isActive = activeStage === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveStage(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 text-xs font-mono tracking-wider uppercase border-b-2 transition-all whitespace-nowrap cursor-pointer
                ${
                  isActive
                    ? isDark
                      ? 'border-[#35F2A0] text-white font-bold bg-white/[0.03]'
                      : 'border-[#0B945B] text-slate-900 font-bold bg-emerald-50/50'
                    : isDark
                    ? 'border-transparent text-[#859588] hover:text-[#DFE0FF] hover:bg-white/[0.01]'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }
              `}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isActive
                  ? isDark ? 'bg-[#35F2A0]/20 text-[#35F2A0]' : 'bg-emerald-100 text-[#0B945B]'
                  : isDark ? 'bg-white/5 text-[#859588]' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* 4. Search and Filters */}
      <div className="space-y-2.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID kasus (NET-...), nama faskes, kode ICD-10, atau NIK dokter..."
              prefixes={['entity:', 'icd-10:', 'region:', 'crit:']}
              onSelectPrefix={(pref) => setSearchQuery((prev) => (prev ? `${prev} ${pref}` : pref))}
            />
          </div>
          <JagaButton
            variant={showFilters ? 'primary' : 'secondary'}
            size="md"
            onClick={() => setShowFilters(!showFilters)}
            icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
          >
            {showFilters ? 'Tutup Filter' : 'Filter Kasus'}
          </JagaButton>
        </div>

        {showFilters && (
          <FilterPanel
            filters={filters}
            onChange={(nextFilters) => setFilters(nextFilters)}
            onReset={() =>
              setFilters({ category: 'ALL', riskType: 'ALL', region: 'ALL', minScore: 0 })
            }
          />
        )}
      </div>

      {/* 5. Main Cases Data Table */}
      <JagaCard
        elevation="lowest"
        title="Daftar Berkas Investigasi Sindikat Fraud"
        subtitle={`Menampilkan ${filteredCases.length} berkas investigasi terindeks`}
        badge={
          <span className="px-2 py-0.5 rounded-[2px] bg-[#35F2A0]/10 border border-[#35F2A0]/30 font-mono text-[10px] text-[#35F2A0] uppercase font-bold">
            CLOSED-LOOP AUDIT ACTIVE
          </span>
        }
        hudAccents={true}
        bodyClassName="p-0"
      >
        <DataTable
          columns={columns}
          data={filteredCases}
          keyField="network_id"
          loading={loading}
          onRowClick={(row) => navigate(`/network/${row.network_id}`)}
          emptyMessage="Tidak ada berkas investigasi yang sesuai dengan filter."
        />
      </JagaCard>
    </div>
  )
}

export default Investigation
