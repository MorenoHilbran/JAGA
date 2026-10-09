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
  NetworkGraph,
  InvestigationDialog,
} from '../components'
import { getNetworkDetail } from '../services/api'
import { useJagaTheme } from '../context/ThemeContext'

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
  const { isDark } = useJagaTheme()

  const [activeTab, setActiveTab] = useState(0)
  const [network, setNetwork] = useState(FALLBACK_DOSSIER)
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [auditDecisionResult, setAuditDecisionResult] = useState(null)

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

        <div className="flex items-center gap-2 flex-wrap">
          <JagaButton
            variant="ghost"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            icon={<AlertTriangle className="w-3.5 h-3.5 text-[#FCD34D]" />}
          >
            Tolak / Sahkan
          </JagaButton>
          <JagaButton
            variant="tactical"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            icon={<FileText className="w-3.5 h-3.5" />}
          >
            Minta Bukti
          </JagaButton>
          <JagaButton
            variant="danger"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            icon={<ShieldAlert className="w-3.5 h-3.5 text-[#080B24]" />}
          >
            Konfirmasi & Bekukan
          </JagaButton>
          <JagaButton
            variant="ghost"
            size="sm"
            onClick={() => alert(`Dossier ${network.network_id} berhasil diekspor.`)}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Ekspor
          </JagaButton>
        </div>
      </div>

      {/* Audit Decision Feedback Banner */}
      {auditDecisionResult && (
        <div className="p-3.5 bg-[#35F2A0]/10 border border-[#35F2A0]/40 rounded-sm flex items-center justify-between text-xs font-mono text-[#35F2A0] animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#35F2A0]" />
            <div>
              <span className="font-bold uppercase tracking-wide">
                STATUS AUDIT TERBARU: [{auditDecisionResult.decision.toUpperCase()}]
              </span>
              <span className="text-white/70 ml-2">
                Otorisasi oleh {auditDecisionResult.auditor_id} • Sig: {auditDecisionResult.digital_signature}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-[11px] underline hover:text-white"
          >
            Kembali ke Antrean Triage →
          </button>
        </div>
      )}

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
      <div className={`border-b flex items-center gap-1 overflow-x-auto ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
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
                    ? isDark
                      ? 'border-[#35F2A0] text-white font-bold bg-white/[0.03]'
                      : 'border-[#0B945B] text-slate-900 font-bold bg-emerald-50/50'
                    : isDark
                    ? 'border-transparent text-[#859588] hover:text-[#DFE0FF] hover:bg-white/[0.01]'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }
              `}
            >
              <span className={isActive ? (isDark ? 'text-[#35F2A0]' : 'text-emerald-700') : (isDark ? 'text-[#859588]' : 'text-slate-400')}>
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
              onDecisionSubmitted={(res) => {
                setAuditDecisionResult({
                  decision: 'freeze',
                  auditor_id: 'AUDITOR-MORENO-01',
                  digital_signature: `JAGA-DSIG-${Date.now().toString(36).toUpperCase()}-V4`,
                })
              }}
            />
          </div>
        )}

        {/* TAB 1: NETWORK VISUALIZATION */}
        {activeTab === 1 && (
          <div className="space-y-4">
            <JagaCard
              elevation="low"
              title="Rekonstruksi Sub-Graf Relasional Sindikat (Cytoscape.js & Apache AGE)"
              subtitle="Hubungan multi-entitas: Faskes (RSUD/Klinik), Dokter Penanggung Jawab, dan Berkas Klaim Pasien"
              badge={
                <span className="px-2 py-0.5 rounded-[2px] bg-[#35F2A0]/10 border border-[#35F2A0]/30 font-mono text-[10px] text-[#35F2A0]">
                  LOUVAIN COMMUNITY ID: #CLUST-48
                </span>
              }
              hudAccents={true}
              bodyClassName="p-4"
            >
              <NetworkGraph networkId={network.network_id} />
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

      {/* Investigation Decision Modal Dialog */}
      <InvestigationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        networkId={network.network_id}
        networkName={network.name}
        currentScore={network.risk_score}
        onDecisionSubmitted={(result) => {
          setAuditDecisionResult(result)
        }}
      />
    </div>
  )
}

export default NetworkDetail
