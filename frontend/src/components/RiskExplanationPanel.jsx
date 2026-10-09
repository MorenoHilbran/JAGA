import React from 'react'
import {
  BrainCircuit,
  AlertTriangle,
  Layers,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import JagaCard from './JagaCard'

/**
 * RiskExplanationPanel - AI Consensus & Explainability Engine
 * Displays plain-Indonesian synthesis, multi-layer consensus weights, and top contributing factors.
 */
const RiskExplanationPanel = ({
  network,
  explanation = null,
  signals = null,
  factors = null,
}) => {
  const defaultSignals = [
    { name: 'Sirkularitas Relasi Graf (Apache AGE)', weight: 38, score: 94, color: '#FF5C67', desc: 'Rujukan tertutup bolak-balik antar 3 faskes' },
    { name: 'Konsentrasi Diagnosis Spesifik (Upcoding)', weight: 26, score: 88, color: '#FF9F43', desc: '91% pasien didiagnosis I50.9 (rata-rata peer 24%)' },
    { name: 'Kesamaan Atribut Klaim (Similarity Mining)', weight: 22, score: 85, color: '#FFAE66', desc: 'Waktu entri, nominal, dan kode tindakan identik' },
    { name: 'Kluster Temporal & Burst Volume', weight: 14, score: 72, color: '#35F2A0', desc: 'Lonjakan klaim 4x lipat di akhir pekan' },
  ]

  const activeSignals = signals || defaultSignals

  const defaultFactors = factors || [
    {
      title: 'Deviasi Rasio Rujukan Melebihi 3.4σ',
      desc: 'Faskes RSUD T merujuk 82% pasien rawat inap ke Klinik P, dibandingkan rerata faskes kelas B wilayah DKI Jakarta yang hanya 14.2%.',
      impact: 'KRITIS',
      impactColor: 'text-[#FF7A85] bg-[#FF5C67]/10 border-[#FF5C67]/30',
    },
    {
      title: 'Tanda Tangan Dokter Tanpa Jeda Fisiologis',
      desc: 'dr. Ahmad tercatat merawat 58 pasien rawat inap pada hari yang sama di dua faskes berjarak 28 km dalam rentang waktu bersamaan.',
      impact: 'TINGGI',
      impactColor: 'text-[#FFAE66] bg-[#FF9F43]/10 border-[#FF9F43]/30',
    },
    {
      title: 'Kloning Berkas Tagihan Tindakan Diagnostik',
      desc: 'Sebanyak 42 berkas klaim menggunakan deskripsi tindakan kateterisasi jantung dengan teks dan lampiran hasil lab yang identik 100%.',
      impact: 'TINGGI',
      impactColor: 'text-[#FFAE66] bg-[#FF9F43]/10 border-[#FF9F43]/30',
    },
  ]

  const narrativeText = explanation || network?.explanation || `
Sistem JAGA mendeteksi anomali relasional tingkat tinggi pada berkas sindikat ini melalui konsensus 3 mesin analitik (Aturan Deterministik BPJS, Algoritma Graf Komunitas Louvain, dan Isolation Forest).
Ditemukan pola sirkularitas terstruktur di mana pasien dialihkan secara berulang antara RSUD T dan Faskes Pratama P guna memaksimalkan batas klaim INA-CBG, dengan estimasi kerugian dana JKN mencapai nominal prioritas pembekuan.
`

  return (
    <div className="space-y-4">
      {/* 1. AI Synthesis Banner */}
      <JagaCard
        elevation="low"
        title="Sintesis Intelijen AI Multi-Layer"
        badge={
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-[#35F2A0]/10 border border-[#35F2A0]/30 text-[#35F2A0] font-mono text-[10px] font-bold">
            <Sparkles className="w-3 h-3" />
            NLG EXPLAINABILITY ENGINE
          </span>
        }
        hudAccents={true}
        bodyClassName="p-4"
      >
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-sm bg-[#131735] border border-white/10 text-[#35F2A0] flex-shrink-0">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div className="space-y-2 text-xs leading-relaxed text-[#DFE0FF] font-sans">
            <p className="whitespace-pre-line text-[#DFE0FF]">
              {narrativeText.trim()}
            </p>
            <div className="flex items-center gap-4 pt-2 border-t border-white/6 text-[11px] font-mono text-[#859588]">
              <span className="flex items-center gap-1 text-[#35F2A0]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Diverifikasi Aturan Fraud Permenkes No. 16/2019
              </span>
              <span>•</span>
              <span>Tingkat Keyakinan Konsensus: 98.4%</span>
            </div>
          </div>
        </div>
      </JagaCard>

      {/* 2. Signal Attribution Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Signal Weight Contribution */}
        <JagaCard
          elevation="low"
          title="Atribusi Bobot Sinyal Risiko"
          subtitle="Distribusi kontribusi setiap layer deteksi terhadap total skor risiko"
          hudAccents={false}
          bodyClassName="p-4 space-y-3.5"
        >
          {activeSignals.map((sig, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#DFE0FF] font-medium font-sans">{sig.name}</span>
                <span className="font-mono text-[11px] font-bold" style={{ color: sig.color }}>
                  Bobot {sig.weight}% • Skor {sig.score}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#080B24] rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${sig.score}%`,
                    backgroundColor: sig.color,
                    boxShadow: `0 0 8px ${sig.color}66`,
                  }}
                />
              </div>
              <span className="text-[10px] text-[#859588] font-mono block">
                {sig.desc}
              </span>
            </div>
          ))}
        </JagaCard>

        {/* Top Contributing Factors */}
        <JagaCard
          elevation="low"
          title="Faktor Determinan Utama"
          subtitle="Bukti temuan kunci yang memicu elevasi status ke berkas Kritis"
          hudAccents={false}
          bodyClassName="p-4 space-y-3"
        >
          {defaultFactors.map((f, idx) => (
            <div
              key={idx}
              className="p-3 rounded-sm bg-[#080B24] border border-white/6 hover:border-white/12 transition-all space-y-1"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#DFE0FF] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#FFAE66] flex-shrink-0" />
                  {f.title}
                </span>
                <span className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-[2px] border ${f.impactColor}`}>
                  {f.impact}
                </span>
              </div>
              <p className="text-[11px] text-[#9CA7C5] leading-relaxed pl-5 font-sans">
                {f.desc}
              </p>
            </div>
          ))}
        </JagaCard>
      </div>
    </div>
  )
}

export default RiskExplanationPanel
