import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ShieldAlert,
  Network as NetworkIcon,
  Download,
  AlertTriangle,
  Building2,
  Users,
  FileText,
  Activity,
  Layers,
  Sparkles,
  Share2,
} from 'lucide-react'

import {
  JagaButton,
  RiskBadge,
  JagaCard,
  StatCard,
  RiskScoreGauge,
  RiskExplanationPanel,
  PeerComparisonChart,
  ClaimsTable,
  ActivityTimeline,
  DecisionPanel,
} from '../components'
import { getNetworkDetail } from '../services/api'

// Fallback high-fidelity dossier dataset
const FALLBACK_DOSSIER = {
  network_id: 'NET-2026-JKN-089',
  name: 'Sindikat Rujukan Sirkular RSUD T-P-K',
  risk_score: 94,
  risk_category: 'CRITICAL',
  primary_risk_type: 'Referral Concentration',
  total_claim_amount: 18450000000,
  detected_at: '2026-10-09 08:42 WIB',
  status: 'Triage Dibutuhkan',
  region: 'DKI Jakarta (Kedeputian Wilayah IV)',
  entities: {
    faskes: 4,
    doctors: 9,
    patients: 412,
    claims: 864,
  },
  top_icd10: 'I50.9 (Heart Failure) & 37.22 (Left Heart Angiography)',
  explanation: `
Analisis graf relasional Apache AGE mendeteksi siklus tertutup rujukan sirkular antar RSUD T, Klinik Pratama P, dan Laboratorium K.
Sebanyak 82% pasien rawat inap dialihkan bolak-balik tanpa jeda waktu fisiologis yang sah guna memaksimalkan plafon klaim INA-CBG.
Tiga dokter spesialis terindikasi menandatangani rekam medis di dua fasilitas berbeda pada jam yang sama, melebihi 3.4σ deviasi dari median kelompok sejawat.
  `.trim(),
}

const NetworkDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState(0)
  const [network, setNetwork] = useState(FALLBACK_DOSSIER)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadDetail()
  }, [id])

  const loadDetail = async () => {
    setLoading(true)
    try {
      const data = await getNetworkDetail(id)
      if (data && data.network_id) {
        setNetwork((prev) => ({ ...prev, ...data }))
      } else {
        setNetwork((prev) => ({ ...prev, network_id: id || prev.network_id }))
      }
    } catch {
      setNetwork((prev) => ({ ...prev, network_id: id || prev.network_id }))
    } finally {
      setLoading(false)
    }
  }

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const tabs = [
    { label: 'Sintesis & Keputusan', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { label: 'Visualisasi Graf Sub-Jaringan', icon: <NetworkIcon className="w-3.5 h-3.5" /> },
    { label: 'Daftar Berkas Klaim', icon: <FileText className="w-3.5 h-3.5" /> },
    { label: 'Linimasa Aktivitas', icon: <Activity className="w-3.5 h-3.5" /> },
  ]

  return (
    <div className="space-y-5">
      {/* 1. Navigation & Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-white/8">
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#859588] hover:text-[#35F2A0] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>KEMBALI KE DASBOR TRIAGE</span>
          </button>

          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold font-headline text-white tracking-tight">
              {network.name}
            </h1>
            <RiskBadge category={network.risk_category} score={network.risk_score} size="md" pulse />
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-[#9CA7C5] flex-wrap">
            <span>BERKAS: {network.network_id}</span>
            <span>•</span>
            <span>WILAYAH: {network.region}</span>
            <span>•</span>
            <span>TERDETEKSI: {network.detected_at}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <JagaButton
            variant="tactical"
            size="sm"
            onClick={() => alert(`Dossier ${network.network_id} berhasil diekspor.`)}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Ekspor Dossier Lengkap
          </JagaButton>
          <JagaButton
            variant="danger"
            size="sm"
            onClick={() => {
              setActiveTab(0)
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
            }}
            icon={<ShieldAlert className="w-3.5 h-3.5 text-[#080B24]" />}
          >
            Otorisasi Pembekuan
          </JagaButton>
        </div>
      </div>

      {/* 2. Key Metrics Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          label="Nilai Klaim Berisiko"
          value={(network.total_claim_amount / 1000000000).toFixed(1)}
          prefix="Rp"
          suffix="Miliar"
          caption="Total indikasi fraud INA-CBG"
          delta="Audit Prioritas"
          deltaType="danger"
          variant="critical"
        />
        <StatCard
          label="Skor Risiko Relasional"
          value={network.risk_score}
          suffix="/100"
          caption="Konsensus Aturan + Graph + IF"
          delta="KRITIS (≥85)"
          deltaType="negative"
          variant="high"
        />
        <StatCard
          label="Entitas Terlibat"
          value={`${network.entities?.faskes || 4} Faskes`}
          suffix={`• ${network.entities?.doctors || 9} Dr`}
          caption={`${network.entities?.patients || 412} Pasien • ${network.entities?.claims || 864} Klaim`}
          delta="Kluster Sindikat"
          deltaType="neutral"
          variant="default"
        />
        <StatCard
          label="Tipologi Anomali"
          value="Sirkularitas"
          caption="Rujukan tertutup antar faskes mitra"
          delta="Deviasi 6.9σ"
          deltaType="positive"
          variant="signal"
        />
      </div>

      {/* 3. Navigation Tabs */}
      <div className="border-b border-white/8 flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === idx
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`
                flex items-center gap-2 px-4 py-3 text-xs font-mono tracking-wider uppercase border-b-2 transition-all whitespace-nowrap
                ${
                  isActive
                    ? 'border-[#35F2A0] text-white font-bold bg-white/[0.03]'
                    : 'border-transparent text-[#859588] hover:text-[#DFE0FF] hover:bg-white/[0.01]'
                }
              `}
            >
              <span className={isActive ? 'text-[#35F2A0]' : 'text-[#859588]'}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* 4. Tab Contents */}
      <div className="pt-1">
        {/* TAB 0: OVERVIEW & DECISION */}
        {activeTab === 0 && (
          <div className="space-y-6">
            <RiskExplanationPanel network={network} />
            <PeerComparisonChart />
            <DecisionPanel
              networkId={network.network_id}
              onDecisionSubmitted={() => {
                // refresh or notification
              }}
            />
          </div>
        )}

        {/* TAB 1: NETWORK VISUALIZATION */}
        {activeTab === 1 && (
          <div className="space-y-4">
            <JagaCard
              elevation="low"
              title="Rekonstruksi Sub-Graf Relasional Sindikat (Apache AGE Cypher)"
              subtitle="Hubungan multi-entitas: Faskes (RSUD/Klinik), Dokter Penanggung Jawab, dan Berkas Klaim Pasien"
              badge={
                <span className="px-2 py-0.5 rounded-[2px] bg-[#35F2A0]/10 border border-[#35F2A0]/30 font-mono text-[10px] text-[#35F2A0]">
                  LOUVAIN COMMUNITY ID: #CLUST-48
                </span>
              }
              hudAccents={true}
              bodyClassName="p-4 space-y-4"
            >
              {/* Interactive Graph HUD Mockup */}
              <div className="relative w-full h-[460px] bg-[#080B24] border border-white/8 rounded-sm overflow-hidden flex flex-col justify-between p-4">
                {/* HUD Top Bar Overlay */}
                <div className="flex items-center justify-between text-[11px] font-mono text-[#859588] z-10 pointer-events-none">
                  <div className="flex items-center gap-3">
                    <span className="text-[#35F2A0] font-bold">MODE: SUBGRAPH INSPECTOR</span>
                    <span>•</span>
                    <span>4 Faskes</span>
                    <span>•</span>
                    <span>9 Dokter</span>
                    <span>•</span>
                    <span>412 Pasien</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF5C67] animate-ping" />
                    <span className="text-[#FF7A85] font-bold">SIKLUS SIRKULAR TERKUNCI</span>
                  </div>
                </div>

                {/* SVG Graph Canvas Representation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 800 460">
                    <defs>
                      <linearGradient id="edgeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#35F2A0" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#FF5C67" stopOpacity="0.8" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Background Grid Pattern */}
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    </pattern>
                    <rect width="800" height="460" fill="url(#grid)" />

                    {/* Circular Referral Loop Edges */}
                    <path
                      d="M 280 180 Q 400 90 520 180"
                      fill="none"
                      stroke="#FF5C67"
                      strokeWidth="2.5"
                      strokeDasharray="6,4"
                      className="animate-pulse"
                    />
                    <path
                      d="M 520 180 Q 400 320 280 180"
                      fill="none"
                      stroke="#FF5C67"
                      strokeWidth="2.5"
                      strokeDasharray="6,4"
                      className="animate-pulse"
                    />
                    <path
                      d="M 280 180 L 400 280"
                      fill="none"
                      stroke="#FFAE66"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 520 180 L 400 280"
                      fill="none"
                      stroke="#FFAE66"
                      strokeWidth="1.5"
                    />

                    {/* Sub Nodes Edges to Patients */}
                    <line x1="280" y1="180" x2="160" y2="120" stroke="rgba(53,242,160,0.3)" strokeWidth="1" />
                    <line x1="280" y1="180" x2="160" y2="240" stroke="rgba(53,242,160,0.3)" strokeWidth="1" />
                    <line x1="520" y1="180" x2="640" y2="120" stroke="rgba(53,242,160,0.3)" strokeWidth="1" />
                    <line x1="520" y1="180" x2="640" y2="240" stroke="rgba(53,242,160,0.3)" strokeWidth="1" />

                    {/* Central Doctor Node */}
                    <g transform="translate(400, 280)">
                      <circle r="22" fill="#131735" stroke="#FFAE66" strokeWidth="2" filter="url(#glow)" />
                      <text textAnchor="middle" y="4" fill="#FFAE66" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">DR. A</text>
                      <text textAnchor="middle" y="36" fill="#DFE0FF" fontSize="9" fontFamily="Inter">dr. Ahmad (98 Klaim)</text>
                    </g>

                    {/* Faskes 1 Node (RSUD T) */}
                    <g transform="translate(280, 180)">
                      <circle r="30" fill="#0D1130" stroke="#FF5C67" strokeWidth="2.5" filter="url(#glow)" />
                      <text textAnchor="middle" y="4" fill="#FF7A85" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">RSUD T</text>
                      <text textAnchor="middle" y="44" fill="#DFE0FF" fontSize="9" fontFamily="Inter">Faskes Rujukan Utama</text>
                    </g>

                    {/* Faskes 2 Node (Klinik P) */}
                    <g transform="translate(520, 180)">
                      <circle r="26" fill="#0D1130" stroke="#FF5C67" strokeWidth="2.5" filter="url(#glow)" />
                      <text textAnchor="middle" y="4" fill="#FF7A85" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">KLINIK P</text>
                      <text textAnchor="middle" y="40" fill="#DFE0FF" fontSize="9" fontFamily="Inter">Faskes Pengirim Berulang</text>
                    </g>

                    {/* Satellite Patient Nodes */}
                    <g transform="translate(160, 120)">
                      <circle r="12" fill="#131735" stroke="#35F2A0" strokeWidth="1.5" />
                      <text textAnchor="middle" y="3" fill="#35F2A0" fontSize="8" fontFamily="JetBrains Mono">P01</text>
                    </g>
                    <g transform="translate(160, 240)">
                      <circle r="12" fill="#131735" stroke="#35F2A0" strokeWidth="1.5" />
                      <text textAnchor="middle" y="3" fill="#35F2A0" fontSize="8" fontFamily="JetBrains Mono">P02</text>
                    </g>
                    <g transform="translate(640, 120)">
                      <circle r="12" fill="#131735" stroke="#35F2A0" strokeWidth="1.5" />
                      <text textAnchor="middle" y="3" fill="#35F2A0" fontSize="8" fontFamily="JetBrains Mono">P03</text>
                    </g>
                    <g transform="translate(640, 240)">
                      <circle r="12" fill="#131735" stroke="#35F2A0" strokeWidth="1.5" />
                      <text textAnchor="middle" y="3" fill="#35F2A0" fontSize="8" fontFamily="JetBrains Mono">P04</text>
                    </g>
                  </svg>
                </div>

                {/* HUD Bottom Legend */}
                <div className="flex items-center justify-between text-[10px] font-mono bg-[#0D1130]/90 border border-white/10 p-2.5 rounded-sm z-10 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-[#DFE0FF]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5C67]" />
                      Faskes Terindikasi
                    </span>
                    <span className="flex items-center gap-1.5 text-[#DFE0FF]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFAE66]" />
                      Dokter Terkoordinasi
                    </span>
                    <span className="flex items-center gap-1.5 text-[#DFE0FF]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#35F2A0]" />
                      Pasien / Klaim Identik
                    </span>
                  </div>

                  <span className="text-[#35F2A0] font-semibold">
                    ALGORITMA DETEKSI: CYCLIC_PATH(k=3)
                  </span>
                </div>
              </div>
            </JagaCard>
          </div>
        )}

        {/* TAB 2: CLAIMS DATA TABLE */}
        {activeTab === 2 && (
          <div className="space-y-4">
            <ClaimsTable networkId={network.network_id} />
          </div>
        )}

        {/* TAB 3: TIMELINE */}
        {activeTab === 3 && (
          <div className="space-y-4">
            <ActivityTimeline />
          </div>
        )}
      </div>
    </div>
  )
}

export default NetworkDetail
