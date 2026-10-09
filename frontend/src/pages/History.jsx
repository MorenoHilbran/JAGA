import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  History as HistoryIcon,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  FileCheck,
  Search,
  Filter,
  Download,
  Lock,
  ExternalLink,
  ChevronRight,
  Clock,
  UserCheck,
} from 'lucide-react'
import {
  JagaCard,
  StatCard,
  JagaButton,
  SearchInput,
  DataTable,
} from '../components'
import { useJagaTheme } from '../context/ThemeContext'

// Audit Trail Decisions Dataset (UU PDP Compliant)
const AUDIT_LOGS = [
  {
    log_id: 'LOG-2026-10-09-001',
    network_id: 'NET-2026-JKN-089',
    case_name: 'Sindikat Rujukan Sirkular RSUD T-P-K',
    action: 'freeze',
    action_label: 'Pembekuan Klaim (Freeze Payout)',
    auditor_id: 'AUDITOR-MORENO-01',
    auditor_role: 'Auditor Utama (Level 3)',
    timestamp: '2026-10-09 10:14 WIB',
    status: 'Tereksekusi',
    digital_signature: 'JAGA-DSIG-M09A8F-V4',
    payout_frozen: 18450000000,
    notes: 'Pembekuan sementara dilakukan menyusul konfirmasi siklus tertutup 82% rujukan antar RSUD T dan Klinik P tanpa indikasi medis sah.',
  },
  {
    log_id: 'LOG-2026-10-08-002',
    network_id: 'NET-2026-JKN-074',
    case_name: 'Kloning Berkas Rawat Inap Faskes Pratama X',
    action: 'audit',
    action_label: 'Tugaskan Audit Fisik Lapangan',
    auditor_id: 'AUDITOR-MORENO-01',
    auditor_role: 'Auditor Utama (Level 3)',
    timestamp: '2026-10-08 14:30 WIB',
    status: 'Survei Lapangan',
    digital_signature: 'JAGA-DSIG-X88A72-V4',
    payout_frozen: 0,
    notes: 'Surat tugas inspeksi mendadak diterbitkan ke Kantor Cabang Bekasi untuk verifikasi 42 rekam medis fisik pasien rawat inap.',
  },
  {
    log_id: 'LOG-2026-10-07-003',
    network_id: 'NET-2026-JKN-061',
    case_name: 'Inflasi Diagnosis Sistemik (Upcoding Sub-akut)',
    action: 'escalate',
    action_label: 'Eskalasi ke Kedeputian Hukum',
    auditor_id: 'AUDITOR-HENDRA-02',
    auditor_role: 'Auditor Spesialis (Level 2)',
    timestamp: '2026-10-07 16:45 WIB',
    status: 'Dalam Kajian Legal',
    digital_signature: 'JAGA-DSIG-K91B22-V4',
    payout_frozen: 8750000000,
    notes: 'Diteruskan ke divisi litigasi terkait dugaan manipulasi software bridging SIMRS faskes mitra untuk upcoding INA-CBG.',
  },
  {
    log_id: 'LOG-2026-10-06-004',
    network_id: 'NET-2026-JKN-041',
    case_name: 'Kluster Dialisis Faskes Swasta S',
    action: 'dismiss',
    action_label: 'Verifikasi Sah (False Positive)',
    auditor_id: 'AUDITOR-DIAN-03',
    auditor_role: 'Auditor Utama (Level 3)',
    timestamp: '2026-10-06 11:20 WIB',
    status: 'Kasus Ditutup',
    digital_signature: 'JAGA-DSIG-C44D90-V4',
    payout_frozen: 0,
    notes: 'Klaim frekuensi tinggi diverifikasi sah; fasilitas merupakan pusat rujukan hemodialisis regional dengan persetujuan khusus BPJS.',
  },
  {
    log_id: 'LOG-2026-10-05-005',
    network_id: 'NET-2026-JKN-038',
    case_name: 'Split Claiming Laboratorium Patologi Mitra',
    action: 'audit',
    action_label: 'Tugaskan Audit Fisik Lapangan',
    auditor_id: 'AUDITOR-BUDI-01',
    auditor_role: 'Auditor Muda (Level 1)',
    timestamp: '2026-10-05 09:35 WIB',
    status: 'Sampling Berkas',
    digital_signature: 'JAGA-DSIG-L77A19-V4',
    payout_frozen: 0,
    notes: 'Sampling audit acak 30 berkas pemeriksaan darah lengkap dan patologi anatomi pada tanggal tagihan yang sama.',
  },
]

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val)
}

const History = () => {
  const navigate = useNavigate()
  const { isDark } = useJagaTheme()

  const [logs, setLogs] = useState(AUDIT_LOGS)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterAction, setFilterAction] = useState('ALL') // ALL | freeze | audit | escalate | dismiss

  // Quick statistics
  const stats = useMemo(() => {
    const total = logs.length
    const frozen = logs.filter((l) => l.action === 'freeze').length
    const auditField = logs.filter((l) => l.action === 'audit').length
    const dismissed = logs.filter((l) => l.action === 'dismiss').length
    const totalSaved = logs.reduce((acc, l) => acc + (l.payout_frozen || 0), 0)
    return { total, frozen, auditField, dismissed, totalSaved }
  }, [logs])

  // Filtered log entries
  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      if (filterAction !== 'ALL' && item.action !== filterAction) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchId = item.log_id.toLowerCase().includes(q)
        const matchNet = item.network_id.toLowerCase().includes(q)
        const matchCase = item.case_name.toLowerCase().includes(q)
        const matchAuditor = item.auditor_id.toLowerCase().includes(q)
        const matchSig = item.digital_signature.toLowerCase().includes(q)
        if (!matchId && !matchNet && !matchCase && !matchAuditor && !matchSig) return false
      }

      return true
    })
  }, [logs, filterAction, searchQuery])

  const getActionBadge = (action, label) => {
    switch (action) {
      case 'freeze':
        return (
          <span className="px-2 py-0.5 rounded-[2px] bg-red-500/10 text-red-500 border border-red-500/30 text-[10px] font-mono font-bold">
            {label}
          </span>
        )
      case 'audit':
        return (
          <span className="px-2 py-0.5 rounded-[2px] bg-amber-500/10 text-amber-500 border border-amber-500/30 text-[10px] font-mono font-bold">
            {label}
          </span>
        )
      case 'escalate':
        return (
          <span className="px-2 py-0.5 rounded-[2px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-[10px] font-mono font-bold">
            {label}
          </span>
        )
      case 'dismiss':
        return (
          <span className="px-2 py-0.5 rounded-[2px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] font-mono font-bold">
            {label}
          </span>
        )
      default:
        return <span className="font-mono text-xs">{label}</span>
    }
  }

  const columns = [
    {
      header: 'ID LOG & TANGGAL AUDIT',
      key: 'log_id',
      width: 'w-[200px]',
      render: (id, row) => (
        <div className="flex flex-col">
          <span className="font-mono font-bold text-xs text-[#35F2A0]">
            {id}
          </span>
          <span className="text-[11px] font-mono text-[#859588] mt-0.5">
            {row.timestamp}
          </span>
          <span className="text-[10px] font-mono text-[#9CA7C5] mt-0.5 flex items-center gap-1">
            <Lock className="w-2.5 h-2.5 text-[#35F2A0]" />
            {row.digital_signature}
          </span>
        </div>
      ),
    },
    {
      header: 'BERKAS SINDIKAT TARGET',
      key: 'network_id',
      width: 'w-[260px]',
      render: (netId, row) => (
        <div className="flex flex-col">
          <span
            onClick={() => navigate(`/network/${netId}`)}
            className="font-mono text-xs text-[#35F2A0] hover:underline cursor-pointer font-bold"
          >
            {netId}
          </span>
          <span className={`text-xs font-medium mt-0.5 line-clamp-1 ${isDark ? 'text-[#DFE0FF]' : 'text-slate-900'}`}>
            {row.case_name}
          </span>
        </div>
      ),
    },
    {
      header: 'KEPUTUSAN TRIAGE AUDITOR',
      key: 'action',
      width: 'w-[220px]',
      render: (act, row) => (
        <div className="flex flex-col gap-1">
          {getActionBadge(act, row.action_label)}
          <span className="text-[10px] font-mono text-[#859588]">
            Status: {row.status}
          </span>
        </div>
      ),
    },
    {
      header: 'VERIFIKATOR & JUSTIFIKASI',
      key: 'notes',
      width: 'w-[280px]',
      render: (notes, row) => (
        <div className="flex flex-col">
          <span className={`text-[11px] font-mono font-semibold ${isDark ? 'text-[#DFE0FF]' : 'text-slate-800'}`}>
            {row.auditor_id} • {row.auditor_role}
          </span>
          <p className="text-[11px] text-[#859588] mt-1 line-clamp-2 leading-relaxed">
            "{notes}"
          </p>
        </div>
      ),
    },
    {
      header: 'DANA DIBEKUKAN',
      key: 'payout_frozen',
      width: 'w-[160px]',
      align: 'right',
      render: (val) => (
        <div className="text-right">
          {val > 0 ? (
            <>
              <span className="text-xs font-mono font-bold text-red-500">
                {formatRupiah(val)}
              </span>
              <div className="text-[10px] text-red-400 font-mono">
                Pencairan Ditahan
              </div>
            </>
          ) : (
            <span className="text-xs font-mono text-[#859588]">
              Rp 0
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'AKSI',
      key: 'actions',
      width: 'w-[100px]',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
          <JagaButton
            size="xs"
            variant="ghost"
            onClick={() => navigate(`/network/${row.network_id}`)}
            iconRight={<ExternalLink className="w-3 h-3" />}
          >
            Lihat
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
            <span className="w-2 h-2 rounded-full bg-[#35F2A0] animate-pulse" />
            <span className={`text-[11px] font-mono uppercase tracking-widest font-semibold ${isDark ? 'text-[#35F2A0]' : 'text-emerald-700'}`}>
              AUDIT TRAIL // JEJAK KEPUTUSAN TERVERIFIKASI
            </span>
          </div>
          <h1 className={`text-2xl font-bold font-headline tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Riwayat Audit Trail & Otorisasi Hukum
          </h1>
          <p className={`text-xs font-sans mt-0.5 ${isDark ? 'text-[#9CA7C5]' : 'text-slate-500'}`}>
            Log kriptografis keputusan penegakan hukum auditor manusia, stempel digital UU PDP, dan rekam feedback active learning.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <JagaButton
            variant="tactical"
            size="sm"
            onClick={() => alert('Jejak audit trail resmi BPJS berhasil diekspor berformat PDF Bertanda Tangan Elektronik.')}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Ekspor Audit Trail
          </JagaButton>
        </div>
      </div>

      {/* 2. Sovereign KPI Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          label="Total Keputusan Auditor"
          value={stats.total}
          suffix="Aksi"
          caption="Terekam dalam log permanen"
          delta="100% Sah UU PDP"
          deltaType="positive"
          icon={<HistoryIcon className="w-4 h-4 text-[#35F2A0]" />}
        />
        <StatCard
          label="Klaim Berhasil Dibekukan"
          value={stats.frozen}
          suffix="Kasus"
          caption="Penghentian pencairan dana faskes"
          delta="Proteksi Kas"
          deltaType="danger"
          variant="critical"
          icon={<ShieldAlert className="w-4 h-4 text-[#FF5C67]" />}
        />
        <StatCard
          label="Inspeksi Lapangan Aktif"
          value={stats.auditField}
          suffix="Audit"
          caption="Pemeriksaan fisik rekam medis"
          delta="Surveilans"
          deltaType="neutral"
          icon={<FileCheck className="w-4 h-4 text-[#FFAE66]" />}
        />
        <StatCard
          label="Total Dana Diselamatkan"
          value={(stats.totalSaved / 1000000000).toFixed(1)}
          prefix="Rp"
          suffix="Miliar"
          caption="Dari kasus pembekuan terkonfirmasi"
          delta="FWA Defended"
          deltaType="positive"
          variant="signal"
          icon={<CheckCircle2 className="w-4 h-4 text-[#35F2A0]" />}
        />
      </div>

      {/* 3. Search and Action Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID log, nama sindikat, NIK auditor, atau nomor stempel..."
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          {[
            { id: 'ALL', label: 'Semua Aksi' },
            { id: 'freeze', label: 'Pembekuan' },
            { id: 'audit', label: 'Audit Lapangan' },
            { id: 'escalate', label: 'Eskalasi Hukum' },
            { id: 'dismiss', label: 'Clearance' },
          ].map((pill) => {
            const isActive = filterAction === pill.id
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setFilterAction(pill.id)}
                className={`px-3 py-1.5 rounded-sm border transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? isDark
                      ? 'bg-[#35F2A0]/10 border-[#35F2A0] text-[#35F2A0] font-bold'
                      : 'bg-emerald-50 border-[#0B945B] text-[#0B945B] font-bold'
                    : isDark
                    ? 'bg-white/5 border-white/10 text-[#9CA7C5] hover:text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {pill.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* 4. Table */}
      <JagaCard
        elevation="lowest"
        title="Jurnal Log Keputusan Penegakan Hukum & Feedback Model"
        subtitle={`Menampilkan ${filteredLogs.length} dari ${logs.length} catatan audit trail resmi`}
        badge={
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-[#35F2A0]/10 border border-[#35F2A0]/30 font-mono text-[10px] text-[#35F2A0]">
            <Lock className="w-3 h-3" />
            IMMUTABLE AUDIT LOG
          </span>
        }
        hudAccents={true}
        bodyClassName="p-0"
      >
        <DataTable
          columns={columns}
          data={filteredLogs}
          keyField="log_id"
          onRowClick={(row) => navigate(`/network/${row.network_id}`)}
          emptyMessage="Tidak ada catatan audit log yang cocok dengan filter."
        />
      </JagaCard>
    </div>
  )
}

export default History
