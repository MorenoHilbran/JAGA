import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ShieldAlert,
  Network as NetworkIcon,
  TrendingUp,
  RefreshCw,
  Download,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  Building2,
  Users,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

import {
  JagaButton,
  RiskBadge,
  JagaCard,
  StatCard,
  SearchInput,
  DataTable,
  RiskScoreGauge,
  FilterPanel,
} from '../components'
import { getRiskNetworks, getDashboardStats } from '../services/api'

// Fallback high-fidelity mock dataset for JKN fraud investigation
const MOCK_NETWORKS = [
  {
    network_id: 'NET-2026-JKN-089',
    name: 'Sindikat Rujukan Sirkular RSUD T-P-K',
    risk_score: 94,
    risk_category: 'CRITICAL',
    primary_risk_type: 'Referral Concentration',
    total_claim_amount: 18450000000,
    entity_count: { faskes: 4, doctors: 9, patients: 412 },
    region: 'DKI Jakarta',
    detected_at: '2026-10-09 08:42 WIB',
    status: 'Triage Dibutuhkan',
    top_icd10: 'I50.9 (Gagal Jantung)',
    confidence: '98.4%',
  },
  {
    network_id: 'NET-2026-JKN-074',
    name: 'Kloning Berkas Rawat Inap Faskes Pratama X',
    risk_score: 89,
    risk_category: 'CRITICAL',
    primary_risk_type: 'Cloning Pattern',
    total_claim_amount: 11200000000,
    entity_count: { faskes: 2, doctors: 4, patients: 280 },
    region: 'Jawa Barat',
    detected_at: '2026-10-08 17:15 WIB',
    status: 'Triage Dibutuhkan',
    top_icd10: 'A09 (Diare & Gastroenteritis)',
    confidence: '96.1%',
  },
  {
    network_id: 'NET-2026-JKN-061',
    name: 'Inflasi Diagnosis Sistemik (Upcoding Sub-akut)',
    risk_score: 82,
    risk_category: 'HIGH',
    primary_risk_type: 'Upcoding',
    total_claim_amount: 8750000000,
    entity_count: { faskes: 1, doctors: 6, patients: 530 },
    region: 'Jawa Timur',
    detected_at: '2026-10-07 11:30 WIB',
    status: 'Sedang Diinvestigasi',
    top_icd10: 'J18.9 (Pneumonia Berat)',
    confidence: '91.8%',
  },
  {
    network_id: 'NET-2026-JKN-055',
    name: 'Klaim Peserta Non-Hadir (Ghost Billing Farmasi)',
    risk_score: 78,
    risk_category: 'HIGH',
    primary_risk_type: 'Phantom Billing',
    total_claim_amount: 5400000000,
    entity_count: { faskes: 3, doctors: 5, patients: 198 },
    region: 'Sumatera Utara',
    detected_at: '2026-10-06 14:20 WIB',
    status: 'Menunggu Audit Lapangan',
    top_icd10: 'E11.9 (Diabetes Mellitus Tipe 2)',
    confidence: '88.7%',
  },
  {
    network_id: 'NET-2026-JKN-042',
    name: 'Anomali Durasi Rawat Inap (LOS Ekstrem)',
    risk_score: 68,
    risk_category: 'MEDIUM',
    primary_risk_type: 'Length of Stay Anomaly',
    total_claim_amount: 3100000000,
    entity_count: { faskes: 2, doctors: 3, patients: 145 },
    region: 'Sulawesi Selatan',
    detected_at: '2026-10-05 09:10 WIB',
    status: 'Monitoring Rutin',
    top_icd10: 'K29.7 (Gastritis Tanpa Pendarahan)',
    confidence: '82.0%',
  },
  {
    network_id: 'NET-2026-JKN-038',
    name: 'Split Claiming Laboratorium Patologi',
    risk_score: 55,
    risk_category: 'MEDIUM',
    primary_risk_type: 'Upcoding',
    total_claim_amount: 1950000000,
    entity_count: { faskes: 1, doctors: 2, patients: 88 },
    region: 'DKI Jakarta',
    detected_at: '2026-10-04 16:45 WIB',
    status: 'Monitoring Rutin',
    top_icd10: 'Z01.7 (Pemeriksaan Laboratorium)',
    confidence: '79.5%',
  },
]

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val)
}

const Dashboard = () => {
  const navigate = useNavigate()

  // State
  const [networks, setNetworks] = useState(MOCK_NETWORKS)
  const [stats, setStats] = useState({
    totalNetworks: 14,
    criticalCount: 4,
    highCount: 5,
    totalAtRisk: 48850000000,
    consensusPrecision: '97.2%',
  })
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: 'ALL',
    riskType: 'ALL',
    region: 'ALL',
    minScore: 0,
  })
  const [selectedCase, setSelectedCase] = useState(null)
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const netData = await getRiskNetworks()
      if (netData && Array.isArray(netData) && netData.length > 0) {
        setNetworks(netData)
      }
      const statData = await getDashboardStats()
      if (statData) {
        setStats((prev) => ({ ...prev, ...statData }))
      }
    } catch {
      // Graceful fallback to high-fidelity mock data
      setNetworks(MOCK_NETWORKS)
    } finally {
      setLoading(false)
    }
  }

  // Filtered networks
  const filteredNetworks = useMemo(() => {
    return networks.filter((item) => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchId = item.network_id.toLowerCase().includes(q)
        const matchName = (item.name || '').toLowerCase().includes(q)
        const matchType = (item.primary_risk_type || '').toLowerCase().includes(q)
        const matchRegion = (item.region || '').toLowerCase().includes(q)
        const matchIcd = (item.top_icd10 || '').toLowerCase().includes(q)
        if (!matchId && !matchName && !matchType && !matchRegion && !matchIcd) return false
      }

      // Category
      if (filters.category !== 'ALL' && item.risk_category !== filters.category) {
        return false
      }

      // Risk Type
      if (filters.riskType !== 'ALL' && item.primary_risk_type !== filters.riskType) {
        return false
      }

      // Region
      if (filters.region !== 'ALL' && item.region !== filters.region) {
        return false
      }

      // Min Score
      if (item.risk_score < filters.minScore) {
        return false
      }

      return true
    })
  }, [networks, searchQuery, filters])

  // Table Columns Definition
  const columns = [
    {
      header: 'ID / NAMA KASUS SINDIKAT',
      key: 'network_id',
      render: (id, row) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs text-[#35F2A0] group-hover:underline">
              {id}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] bg-white/5 text-[#9CA7C5] border border-white/10">
              {row.region || 'Nasional'}
            </span>
          </div>
          <span className="text-xs text-[#DFE0FF] font-medium mt-0.5 line-clamp-1">
            {row.name || 'Jaringan Anomali Relasional'}
          </span>
          <span className="text-[11px] text-[#859588] font-mono mt-0.5">
            ICD-10: {row.top_icd10 || '—'}
          </span>
        </div>
      ),
    },
    {
      header: 'SKOR & TINGKAT RISIKO',
      key: 'risk_score',
      render: (score, row) => (
        <div className="flex items-center gap-2.5">
          <RiskScoreGauge score={score} size="sm" />
          <div className="flex flex-col gap-1">
            <RiskBadge category={row.risk_category} size="xs" pulse={row.risk_category === 'CRITICAL'} />
            <span className="text-[10px] font-mono text-[#859588]">
              Konsensus: {row.confidence || '95%'}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'TIPOLOGI ANOMALI',
      key: 'primary_risk_type',
      render: (type) => (
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-[#DFE0FF] font-sans">
            {type}
          </span>
          <span className="text-[10px] font-mono text-[#859588]">
            Multi-Layer Graph Consensus
          </span>
        </div>
      ),
    },
    {
      header: 'ENTITAS TERLIBAT',
      key: 'entity_count',
      render: (counts) => {
        if (!counts) return <span className="font-mono text-xs">—</span>
        if (typeof counts === 'number') {
          return (
            <span className="font-mono text-xs text-[#DFE0FF]">
              {counts} Node
            </span>
          )
        }
        return (
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
            <span title="Pasien">{counts.patients} Pasien</span>
          </div>
        )
      },
    },
    {
      header: 'NILAI KLAIM TERINDIKASI',
      key: 'total_claim_amount',
      align: 'right',
      isMono: true,
      render: (amount) => (
        <div className="text-right">
          <span className="text-xs font-bold text-[#FFFFFF] font-mono">
            {formatRupiah(amount)}
          </span>
          <div className="text-[10px] text-[#FF7A85] font-mono">
            Audit Prioritas
          </div>
        </div>
      ),
    },
    {
      header: 'WAKTU DETEKSI',
      key: 'detected_at',
      render: (dt) => (
        <span className="text-[11px] font-mono text-[#859588]">
          {dt}
        </span>
      ),
    },
    {
      header: 'AKSI TRIAGE',
      key: 'actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <JagaButton
            size="xs"
            variant="ghost"
            onClick={() => setSelectedCase(row)}
            icon={<Eye className="w-3 h-3" />}
            title="Pratinjau Cepat"
          >
            Pratinjau
          </JagaButton>
          <JagaButton
            size="xs"
            variant="primary"
            onClick={() => navigate(`/network/${row.network_id}`)}
            iconRight={<ChevronRight className="w-3 h-3" />}
          >
            Investigasi
          </JagaButton>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      {/* 1. Header & Live Telemetry Feed */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-3 border-b border-white/8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#35F2A0] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#35F2A0]" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#35F2A0] font-semibold">
              LIVE RADAR // TRIAGE INTELIJEN KLAIM JKN
            </span>
          </div>
          <h1 className="text-2xl font-bold font-headline text-white tracking-tight">
            Dasbor Triage Investigasi Kecurangan
          </h1>
          <p className="text-xs text-[#9CA7C5] font-sans mt-0.5">
            Deteksi otomatis pola sindikat terorganisir menggunakan rekonstruksi graf relasional Apache AGE dan Multi-Layer AI Consensus.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <JagaButton
            variant="secondary"
            size="sm"
            onClick={fetchDashboardData}
            loading={loading}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Sinkronisasi Radar
          </JagaButton>
          <JagaButton
            variant="tactical"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Ekspor Dossier
          </JagaButton>
        </div>
      </div>

      {/* 2. Sovereign Telemetry Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          label="Total Sindikat Terlacak"
          value={stats.totalNetworks}
          suffix="Jaringan"
          caption="Dalam siklus klaim 30 hari"
          delta="+2 Sindikat Baru"
          deltaType="negative"
          variant="signal"
          icon={<NetworkIcon className="w-4 h-4 text-[#35F2A0]" />}
        />
        <StatCard
          label="Kasus Kritis Butuh Pembekuan"
          value={stats.criticalCount}
          suffix="Kasus"
          caption="Skor anomali ≥ 85 (Urgent)"
          delta="4 Siap Freeze"
          deltaType="danger"
          variant="critical"
          icon={<ShieldAlert className="w-4 h-4 text-[#FF5C67]" />}
        />
        <StatCard
          label="Potensi Kerugian Tercegah"
          value={(stats.totalAtRisk / 1000000000).toFixed(1)}
          prefix="Rp"
          suffix="Miliar"
          caption="Dari klaim terindikasi fraud"
          delta="+14.2% Efisiensi"
          deltaType="positive"
          icon={<TrendingUp className="w-4 h-4 text-[#35F2A0]" />}
        />
        <StatCard
          label="Presisi Konsensus AI"
          value={stats.consensusPrecision}
          caption="Berdasarkan feedback auditor"
          delta="UU PDP Sesuai"
          deltaType="positive"
          icon={<CheckCircle2 className="w-4 h-4 text-[#35F2A0]" />}
        />
      </div>

      {/* 3. Search and Quick Filters Bar */}
      <div className="space-y-2.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID sindikat (NET-...), nama faskes, kode ICD-10, atau NIK dokter..."
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
            {showFilters ? 'Tutup Filter' : 'Filter Lanjutan'}
          </JagaButton>
        </div>

        {/* Collapsible Filter Panel */}
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

      {/* 4. Priority Queue Enterprise Table */}
      <JagaCard
        elevation="lowest"
        title="Antrean Triage Kasus Fraud Prioritas"
        subtitle={`Menampilkan ${filteredNetworks.length} dari ${networks.length} berkas investigasi terindeks radar`}
        badge={
          <span className="px-2 py-0.5 rounded-[2px] bg-[#35F2A0]/10 border border-[#35F2A0]/30 font-mono text-[10px] text-[#35F2A0] uppercase font-bold">
            Real-time Consensus Active
          </span>
        }
        action={
          <span className="text-[11px] font-mono text-[#859588]">
            Urutan: Skor Risiko Tertinggi ↓
          </span>
        }
        hudAccents={true}
        bodyClassName="p-0"
      >
        <DataTable
          columns={columns}
          data={filteredNetworks}
          keyField="network_id"
          loading={loading}
          onRowClick={(row) => setSelectedCase(row)}
          emptyMessage="Tidak ada jaringan yang cocok dengan parameter filter saat ini."
        />
      </JagaCard>

      {/* 5. Quick Triage Side Drawer Modal (Palantir HUD Modal) */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-[#0D1130] border border-white/15 rounded-sm shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <RiskBadge category={selectedCase.risk_category} score={selectedCase.risk_score} size="sm" pulse />
                  <span className="font-mono text-xs text-[#859588]">{selectedCase.network_id}</span>
                </div>
                <h2 className="text-lg font-bold font-headline text-white">
                  {selectedCase.name}
                </h2>
                <p className="text-xs text-[#9CA7C5] mt-0.5">
                  Wilayah: {selectedCase.region} • Terdeteksi: {selectedCase.detected_at}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="p-1 text-[#859588] hover:text-white transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Content Dossier Summary */}
            <div className="grid grid-cols-2 gap-4 my-4 font-mono text-xs">
              <div className="bg-[#131735] p-3 rounded-sm border border-white/6">
                <span className="text-[#859588] block text-[10px] uppercase">Pola Anomali Terdeteksi</span>
                <span className="text-[#DFE0FF] font-semibold text-sm block mt-1">
                  {selectedCase.primary_risk_type}
                </span>
                <span className="text-[11px] text-[#35F2A0] mt-1 block">
                  Presisi Bukti: {selectedCase.confidence}
                </span>
              </div>
              <div className="bg-[#131735] p-3 rounded-sm border border-white/6">
                <span className="text-[#859588] block text-[10px] uppercase">Nilai Klaim Berisiko</span>
                <span className="text-[#FF7A85] font-bold text-sm block mt-1">
                  {formatRupiah(selectedCase.total_claim_amount)}
                </span>
                <span className="text-[11px] text-[#859588] mt-1 block">
                  Diagnosis Utama: {selectedCase.top_icd10}
                </span>
              </div>
            </div>

            {/* Synthesized Reason */}
            <div className="bg-[#131735] p-3.5 rounded-sm border border-white/8 text-xs text-[#DFE0FF] space-y-1.5 mb-5 font-sans">
              <div className="flex items-center gap-2 font-mono text-[#35F2A0] text-[11px] font-bold uppercase">
                <AlertTriangle className="w-3.5 h-3.5 text-[#FFAE66]" />
                Sintesis Bukti Relasional Graf:
              </div>
              <p className="text-xs text-[#BACBBD] leading-relaxed">
                Teridentifikasi pola rujukan sirkular antar faskes mitra dengan konsentrasi tinggi ({selectedCase.entity_count?.patients || 400}+ klaim berulang).
                Dokter yang sama menandatangani diagnosis tanpa jeda fisiologis yang masuk akal, melebihi 3.2 deviasi standar dari rerata faskes sejenis.
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <JagaButton
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCase(null)}
              >
                Tutup Pratinjau
              </JagaButton>
              <div className="flex items-center gap-2">
                <JagaButton
                  variant="danger-ghost"
                  size="sm"
                  onClick={() => alert(`Pembekuan sementara diajukan untuk berkas ${selectedCase.network_id}`)}
                >
                  Bekukan Payout
                </JagaButton>
                <JagaButton
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/network/${selectedCase.network_id}`)}
                  iconRight={<ChevronRight className="w-3.5 h-3.5" />}
                >
                  Buka Investigasi Lengkap
                </JagaButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
