import React from 'react'
import { BarChart3, AlertOctagon, Info, CheckCircle2 } from 'lucide-react'
import JagaCard from './JagaCard'

/**
 * PeerComparisonChart - Statistical Deviation vs Peer Group
 * Demonstrates z-score / standard deviation analysis against peer faskes group.
 */
const PeerComparisonChart = ({
  metrics = null,
  peerGroup = 'RSUD Kelas B - Kedeputian Wilayah IV (DKI Jakarta)',
}) => {
  const defaultMetrics = [
    {
      label: 'Rasio Rujukan Pasien Rawat Inap',
      faskesValue: 82.4,
      peerMedian: 14.2,
      peerStdDev: 9.8,
      unit: '%',
      zScore: 6.95,
      isAnomalous: true,
      description: 'Deviasi 6.9σ di atas median kelompok sejawat',
    },
    {
      label: 'Konsentrasi Diagnosis Penyakit Jantung (I50.9)',
      faskesValue: 78.1,
      peerMedian: 22.4,
      peerStdDev: 11.2,
      unit: '%',
      zScore: 4.97,
      isAnomalous: true,
      description: 'Deviasi 5.0σ menunjukkan indikasi upcoding sistemik',
    },
    {
      label: 'Rata-rata Lama Rawat Inap (ALOS)',
      faskesValue: 7.2,
      peerMedian: 4.1,
      peerStdDev: 1.2,
      unit: ' Hari',
      zScore: 2.58,
      isAnomalous: true,
      description: 'Deviasi 2.6σ indikasi perpanjangan hari rawat artifisial',
    },
    {
      label: 'Biaya Klaim Rata-rata per Episode',
      faskesValue: 14850000,
      peerMedian: 8900000,
      peerStdDev: 2100000,
      unit: ' IDR',
      zScore: 2.83,
      isAnomalous: true,
      isCurrency: true,
      description: 'Deviasi 2.8σ dari tarif rerata INA-CBG regional',
    },
  ]

  const data = metrics || defaultMetrics

  const formatVal = (item, val) => {
    if (item.isCurrency) {
      return `Rp ${(val / 1000000).toFixed(1)} jt`
    }
    return `${val}${item.unit}`
  }

  return (
    <JagaCard
      elevation="low"
      title="Analisis Deviasi Statistik Kelompok Sejawat (Peer Group)"
      subtitle={`Kelompok Pembanding: ${peerGroup} (38 Faskes Serupa)`}
      badge={
        <span className="px-2 py-0.5 rounded-[2px] bg-white/5 border border-white/10 font-mono text-[10px] text-[#9CA7C5]">
          METODE: Z-SCORE & IQR OUTLIER
        </span>
      }
      bodyClassName="p-4 space-y-5"
    >
      <div className="space-y-4">
        {data.map((m, idx) => {
          const zScoreVal = Math.abs(m.zScore)
          const isHighAlert = zScoreVal >= 3.0
          const barColor = isHighAlert ? '#FF5C67' : zScoreVal >= 2.0 ? '#FF9F43' : '#35F2A0'

          return (
            <div
              key={idx}
              className="p-3.5 bg-[#080B24] border border-white/6 rounded-sm space-y-2 hover:border-white/12 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold text-[#DFE0FF] block">
                    {m.label}
                  </span>
                  <span className="text-[10px] font-mono text-[#859588]">
                    {m.description}
                  </span>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <div className="text-right">
                    <span className="text-[10px] text-[#859588] block">NILAI FASKES:</span>
                    <span className="font-bold text-sm" style={{ color: barColor }}>
                      {formatVal(m, m.faskesValue)}
                    </span>
                  </div>
                  <div className="text-right border-l border-white/10 pl-3">
                    <span className="text-[10px] text-[#859588] block">MEDIAN PEER:</span>
                    <span className="text-[#9CA7C5]">
                      {formatVal(m, m.peerMedian)}
                    </span>
                  </div>
                  <div className="pl-2">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold border ${
                        isHighAlert
                          ? 'bg-[#FF5C67]/10 text-[#FF7A85] border-[#FF5C67]/30'
                          : 'bg-[#FF9F43]/10 text-[#FFAE66] border-[#FF9F43]/30'
                      }`}
                    >
                      +{m.zScore.toFixed(1)}σ
                    </span>
                  </div>
                </div>
              </div>

              {/* Statistical Distribution Range Bar */}
              <div className="space-y-1 pt-1">
                <div className="relative h-3 bg-[#131735] rounded-full overflow-hidden border border-white/5">
                  {/* Normal Distribution Range (0 to 2 sigma) */}
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-[#35F2A0]/20 border-r border-[#35F2A0]/50"
                    style={{ width: '40%' }}
                    title="Zona Normal (< 2σ)"
                  />
                  {/* Warning Zone (2 to 3 sigma) */}
                  <div
                    className="absolute top-0 bottom-0 left-[40%] bg-[#FF9F43]/20 border-r border-[#FF9F43]/50"
                    style={{ width: '25%' }}
                    title="Zona Peringatan (2σ - 3σ)"
                  />
                  {/* Critical Anomaly Zone (> 3 sigma) */}
                  <div
                    className="absolute top-0 bottom-0 left-[65%] right-0 bg-[#FF5C67]/20"
                    title="Zona Kritis (> 3σ)"
                  />
                  {/* Entity Marker Point */}
                  <div
                    className="absolute top-0 bottom-0 w-2 -ml-1 rounded-sm shadow-md transition-all duration-500"
                    style={{
                      left: `${Math.min(96, Math.max(10, (m.zScore / 7) * 90))}%`,
                      backgroundColor: barColor,
                      boxShadow: `0 0 8px ${barColor}`,
                    }}
                    title={`Nilai Entitas (+${m.zScore.toFixed(1)}σ)`}
                  />
                </div>

                <div className="flex justify-between text-[9px] font-mono text-[#859588] px-1">
                  <span>Median (μ)</span>
                  <span>Ambang Batas +2σ</span>
                  <span>Ambang Kritis +3σ</span>
                  <span className="text-[#FF7A85] font-bold">Terdeteksi Outlier</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </JagaCard>
  )
}

export default PeerComparisonChart
