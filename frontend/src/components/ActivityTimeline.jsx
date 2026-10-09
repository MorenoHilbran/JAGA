import React from 'react'
import { Clock, AlertTriangle, Calendar, CheckCircle2, Flame, ShieldAlert } from 'lucide-react'
import JagaCard from './JagaCard'

/**
 * ActivityTimeline - Chronological Fraud Event Sequence
 * Maps out temporal clustering and coordinated claim submission events.
 */
const ActivityTimeline = ({ events = null }) => {
  const defaultEvents = [
    {
      date: '08 Okt 2026',
      time: '14:22 WIB',
      title: 'Lonjakan Rujukan Simultan (Burst Referrals)',
      desc: 'Sebanyak 24 pasien rujukan dialihkan dari Klinik Pratama P ke RSUD T dalam selang waktu 45 menit dengan kode diagnosis kardiologi identik.',
      severity: 'CRITICAL',
      color: '#FF5C67',
      icon: <Flame className="w-3.5 h-3.5 text-[#FF5C67]" />,
      badge: '4x Rerata Normal',
    },
    {
      date: '07 Okt 2026',
      time: '23:45 WIB',
      title: 'Entri Berkas Massal Tengah Malam',
      desc: 'Operator RSUD T mengunggah 38 berkas klaim dengan nilai maksimal plafon INA-CBG secara batch pada jam di luar operasional administrasi.',
      severity: 'HIGH',
      color: '#FF9F43',
      icon: <Clock className="w-3.5 h-3.5 text-[#FF9F43]" />,
      badge: 'Jam Non-Operasional',
    },
    {
      date: '05 Okt 2026',
      time: '10:15 WIB',
      title: 'Tumpang Tindih Praktik dr. Ahmad',
      desc: 'Tanda tangan digital tervalidasi pada klaim di RSIA K dan RSUD T pada waktu visitasi yang bertabrakan (jarak 28 km).',
      severity: 'HIGH',
      color: '#FF9F43',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-[#FF9F43]" />,
      badge: 'Konflik Fisiologis',
    },
    {
      date: '02 Okt 2026',
      time: '08:00 WIB',
      title: 'Pendaftaran Rujukan Sirkular Pertama Terdeteksi',
      desc: 'Pasien B**** S***** didaftarkan kembali untuk siklus rawat inap ke-3 dalam periode 45 hari tanpa riwayat rujukan balik FKTP.',
      severity: 'MEDIUM',
      color: '#FCD34D',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-[#FCD34D]" />,
      badge: 'Awal Siklus',
    },
    {
      date: '28 Sep 2026',
      time: '09:00 WIB',
      title: 'Baseline Normal Operasional Faskes',
      desc: 'Aktivitas rujukan dan klaim masih berada dalam rentang toleransi standar deviasi normal (±1.0σ).',
      severity: 'LOW',
      color: '#35F2A0',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#35F2A0]" />,
      badge: 'Baseline',
    },
  ]

  const eventList = events || defaultEvents

  return (
    <JagaCard
      elevation="low"
      title="Rekonstruksi Linimasa Kronologis Kejadian"
      subtitle="Urutan temporal koordinasi anomali klaim dan rujukan terorganisir"
      badge={
        <span className="px-2 py-0.5 rounded-[2px] bg-white/5 border border-white/10 font-mono text-[10px] text-[#9CA7C5]">
          TEMPORAL ANOMALY RADAR
        </span>
      }
      bodyClassName="p-5"
    >
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
        {eventList.map((ev, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Node Dot */}
            <div
              className="absolute -left-6 top-1.5 w-5 h-5 rounded-full flex items-center justify-center bg-[#0D1130] border transition-transform duration-200 group-hover:scale-110"
              style={{ borderColor: ev.color, boxShadow: `0 0 8px ${ev.color}40` }}
            >
              {ev.icon}
            </div>

            {/* Event Box */}
            <div className="bg-[#080B24] border border-white/6 rounded-sm p-3.5 hover:border-white/15 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                <span className="text-xs font-semibold text-[#DFE0FF] font-sans">
                  {ev.title}
                </span>
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="text-[#859588]">{ev.date} • {ev.time}</span>
                  <span
                    className="px-1.5 py-0.2 rounded-[2px] font-bold"
                    style={{
                      color: ev.color,
                      backgroundColor: `${ev.color}15`,
                      border: `1px solid ${ev.color}40`,
                    }}
                  >
                    {ev.badge}
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#9CA7C5] leading-relaxed font-sans">
                {ev.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </JagaCard>
  )
}

export default ActivityTimeline
