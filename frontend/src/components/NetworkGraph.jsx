import React, { useEffect, useRef, useState, useMemo } from 'react'
import cytoscape from 'cytoscape'
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Layers,
  Filter,
  Info,
  Building2,
  UserCheck,
  Users,
  FileSpreadsheet,
  AlertTriangle,
  X,
  Play,
  Share2,
} from 'lucide-react'
import { getGraphData } from '../services/api'
import JagaButton from './JagaButton'
import RiskBadge from './RiskBadge'

// High-fidelity fallback graph elements for JKN syndicate detection
const FALLBACK_GRAPH_ELEMENTS = [
  // FASKES (PROVIDERS)
  {
    data: {
      id: 'FASKES-RSUD-T',
      label: 'RSUD T (Pusat Rujukan)',
      type: 'provider',
      riskScore: 94,
      degree: 18,
      claimsCount: 420,
      totalAmount: 'Rp 11.2 M',
      riskCategory: 'CRITICAL',
    },
  },
  {
    data: {
      id: 'FASKES-KLINIK-P',
      label: 'Klinik Pratama P (Pengirim)',
      type: 'provider',
      riskScore: 88,
      degree: 14,
      claimsCount: 280,
      totalAmount: 'Rp 5.4 M',
      riskCategory: 'CRITICAL',
    },
  },
  {
    data: {
      id: 'FASKES-LAB-K',
      label: 'Lab Patologi K',
      type: 'provider',
      riskScore: 76,
      degree: 9,
      claimsCount: 164,
      totalAmount: 'Rp 1.8 M',
      riskCategory: 'HIGH',
    },
  },

  // DOKTER (DOCTORS)
  {
    data: {
      id: 'DOC-AHMAD',
      label: 'dr. Ahmad Fachri, Sp.JP',
      type: 'doctor',
      riskScore: 92,
      degree: 16,
      claimsCount: 198,
      specialty: 'Kardiologi & Vaskular',
      riskCategory: 'CRITICAL',
    },
  },
  {
    data: {
      id: 'DOC-BUDI',
      label: 'dr. Budi Santoso, Sp.PD',
      type: 'doctor',
      riskScore: 81,
      degree: 11,
      claimsCount: 145,
      specialty: 'Penyakit Dalam',
      riskCategory: 'HIGH',
    },
  },
  {
    data: {
      id: 'DOC-SITI',
      label: 'dr. Siti Aminah, Sp.A',
      type: 'doctor',
      riskScore: 68,
      degree: 8,
      claimsCount: 88,
      specialty: 'Kesehatan Anak',
      riskCategory: 'MEDIUM',
    },
  },

  // PESERTA (PATIENTS - MASKED UU PDP)
  {
    data: {
      id: 'PAT-001',
      label: 'Tn. B**** S*****',
      type: 'patient',
      nik: '317102******0004',
      cycleCount: 4,
      totalClaim: 'Rp 59.4 Jt',
      riskCategory: 'CRITICAL',
    },
  },
  {
    data: {
      id: 'PAT-002',
      label: 'Ny. S**** M*****',
      type: 'patient',
      nik: '317105******0002',
      cycleCount: 4,
      totalClaim: 'Rp 59.4 Jt',
      riskCategory: 'CRITICAL',
    },
  },
  {
    data: {
      id: 'PAT-003',
      label: 'Tn. H***** W*****',
      type: 'patient',
      nik: '327503******0011',
      cycleCount: 3,
      totalClaim: 'Rp 28.5 Jt',
      riskCategory: 'HIGH',
    },
  },
  {
    data: {
      id: 'PAT-004',
      label: 'Ny. D**** A*****',
      type: 'patient',
      nik: '317409******0008',
      cycleCount: 3,
      totalClaim: 'Rp 36.4 Jt',
      riskCategory: 'HIGH',
    },
  },
  {
    data: {
      id: 'PAT-005',
      label: 'Tn. R***** K*****',
      type: 'patient',
      nik: '327501******0003',
      cycleCount: 2,
      totalClaim: 'Rp 29.7 Jt',
      riskCategory: 'MEDIUM',
    },
  },

  // EDGES: SIRKULARITAS RUJUKAN (ANOMALOUS REFERRALS)
  {
    data: {
      id: 'E-REF-1',
      source: 'FASKES-KLINIK-P',
      target: 'FASKES-RSUD-T',
      type: 'circular_ref',
      label: 'Rujukan Tertutup (82.4% Vol)',
      weight: 8,
      isSuspicious: true,
    },
  },
  {
    data: {
      id: 'E-REF-2',
      source: 'FASKES-RSUD-T',
      target: 'FASKES-LAB-K',
      type: 'circular_ref',
      label: 'Pemeriksaan Rutin Berulang',
      weight: 6,
      isSuspicious: true,
    },
  },
  {
    data: {
      id: 'E-REF-3',
      source: 'FASKES-LAB-K',
      target: 'FASKES-KLINIK-P',
      type: 'circular_ref',
      label: 'Rujukan Balik Artifisial',
      weight: 5,
      isSuspicious: true,
    },
  },

  // EDGES: DOKTER TREATS / WORKS_AT
  {
    data: {
      id: 'E-DOC-1',
      source: 'DOC-AHMAD',
      target: 'FASKES-RSUD-T',
      type: 'works_at',
      label: 'DPJP Utama',
      weight: 4,
    },
  },
  {
    data: {
      id: 'E-DOC-2',
      source: 'DOC-AHMAD',
      target: 'FASKES-KLINIK-P',
      type: 'suspicious_work',
      label: 'Kunjungan Simultan (Jarak 28km)',
      weight: 5,
      isSuspicious: true,
    },
  },
  {
    data: {
      id: 'E-DOC-3',
      source: 'DOC-BUDI',
      target: 'FASKES-KLINIK-P',
      type: 'works_at',
      label: 'Dokter Penanggung Jawab',
      weight: 3,
    },
  },
  {
    data: {
      id: 'E-DOC-4',
      source: 'DOC-SITI',
      target: 'FASKES-LAB-K',
      type: 'works_at',
      label: 'Konsulen Patologi',
      weight: 3,
    },
  },

  // EDGES: PASIEN VISITS
  {
    data: {
      id: 'E-PAT-1',
      source: 'PAT-001',
      target: 'FASKES-RSUD-T',
      type: 'visits',
      label: '4x Siklus Klaim',
      weight: 3,
    },
  },
  {
    data: {
      id: 'E-PAT-2',
      source: 'PAT-001',
      target: 'FASKES-KLINIK-P',
      type: 'visits',
      label: 'Rujukan Masuk',
      weight: 2,
    },
  },
  {
    data: {
      id: 'E-PAT-3',
      source: 'PAT-002',
      target: 'FASKES-RSUD-T',
      type: 'visits',
      label: '4x Siklus Klaim',
      weight: 3,
    },
  },
  {
    data: {
      id: 'E-PAT-4',
      source: 'PAT-003',
      target: 'DOC-AHMAD',
      type: 'treated_by',
      label: 'Penanganan DPJP',
      weight: 2,
    },
  },
  {
    data: {
      id: 'E-PAT-5',
      source: 'PAT-004',
      target: 'FASKES-LAB-K',
      type: 'visits',
      label: 'Lab Kateterisasi',
      weight: 2,
    },
  },
  {
    data: {
      id: 'E-PAT-6',
      source: 'PAT-005',
      target: 'DOC-AHMAD',
      type: 'treated_by',
      label: 'Penanganan DPJP',
      weight: 2,
    },
  },
]

const NetworkGraph = ({
  networkId = 'NET-2026-JKN-089',
  onNodeSelect = null,
  className = '',
}) => {
  const containerRef = useRef(null)
  const cyRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState(null)
  const [currentLayout, setCurrentLayout] = useState('cose')
  const [activeFilters, setActiveFilters] = useState({
    provider: true,
    doctor: true,
    patient: true,
    claim: true,
  })
  const [highlightLoopOnly, setHighlightLoopOnly] = useState(false)

  // Initialize and update Cytoscape
  useEffect(() => {
    if (!containerRef.current) return

    setLoading(true)

    // Destroy existing instance if any
    if (cyRef.current) {
      cyRef.current.destroy()
    }

    try {
      const cy = cytoscape({
        container: containerRef.current,
        elements: FALLBACK_GRAPH_ELEMENTS,
        style: [
          // BASE NODE STYLE
          {
            selector: 'node',
            style: {
              label: 'data(label)',
              color: '#DFE0FF',
              'font-size': '10px',
              'font-family': 'JetBrains Mono, monospace',
              'text-valign': 'bottom',
              'text-margin-y': 6,
              'text-background-opacity': 0.8,
              'text-background-color': '#080B24',
              'text-background-padding': '2px',
              'text-background-shape': 'roundrectangle',
              'border-width': 2,
              'transition-property': 'background-color, line-color, target-arrow-color',
              'transition-duration': '0.2s',
            },
          },

          // PROVIDER / FASKES NODE
          {
            selector: 'node[type = "provider"]',
            style: {
              shape: 'round-rectangle',
              width: 52,
              height: 52,
              'background-color': '#0D1130',
              'border-color': '#FF5C67',
              'border-width': 3,
              color: '#FFFFFF',
              'font-weight': 'bold',
            },
          },

          // DOCTOR NODE
          {
            selector: 'node[type = "doctor"]',
            style: {
              shape: 'ellipse',
              width: 44,
              height: 44,
              'background-color': '#131735',
              'border-color': '#FFAE66',
              'border-width': 2.5,
              color: '#FFAE66',
            },
          },

          // PATIENT NODE
          {
            selector: 'node[type = "patient"]',
            style: {
              shape: 'ellipse',
              width: 28,
              height: 28,
              'background-color': '#090C25',
              'border-color': '#35F2A0',
              'border-width': 2,
              color: '#35F2A0',
            },
          },

          // BASE EDGE STYLE
          {
            selector: 'edge',
            style: {
              width: 1.5,
              'line-color': 'rgba(255, 255, 255, 0.2)',
              'curve-style': 'bezier',
              'target-arrow-shape': 'triangle',
              'target-arrow-color': 'rgba(255, 255, 255, 0.3)',
              'arrow-scale': 0.8,
              label: 'data(label)',
              'font-size': '8px',
              'font-family': 'Inter, sans-serif',
              color: '#859588',
              'text-rotation': 'autorotate',
              'text-background-opacity': 0.8,
              'text-background-color': '#080B24',
              'text-background-padding': '1px',
            },
          },

          // CIRCULAR / SUSPICIOUS REFERRAL EDGE
          {
            selector: 'edge[type = "circular_ref"]',
            style: {
              width: 3.5,
              'line-color': '#FF5C67',
              'target-arrow-color': '#FF5C67',
              'arrow-scale': 1.2,
              color: '#FF7A85',
              'font-weight': 'bold',
              'line-style': 'solid',
            },
          },

          // SUSPICIOUS WORK EDGE
          {
            selector: 'edge[type = "suspicious_work"]',
            style: {
              width: 2.5,
              'line-color': '#FFAE66',
              'target-arrow-color': '#FFAE66',
              'line-style': 'dashed',
              color: '#FFAE66',
            },
          },

          // VISITS EDGE
          {
            selector: 'edge[type = "visits"]',
            style: {
              width: 1.5,
              'line-color': '#35F2A0',
              'target-arrow-color': '#35F2A0',
            },
          },

          // SELECTED / HIGHLIGHTED STATE
          {
            selector: ':selected',
            style: {
              'border-color': '#35F2A0',
              'border-width': 4,
              'shadow-blur': 15,
              'shadow-color': '#35F2A0',
              'shadow-opacity': 0.8,
            },
          },
        ],
        layout: {
          name: currentLayout,
          animate: true,
          animationDuration: 500,
          padding: 30,
        },
      })

      // Event listener for node selection
      cy.on('tap', 'node', (evt) => {
        const node = evt.target
        const data = node.data()
        setSelectedEntity({
          ...data,
          isNode: true,
        })
        if (onNodeSelect) onNodeSelect(data)
      })

      // Event listener for edge selection
      cy.on('tap', 'edge', (evt) => {
        const edge = evt.target
        const data = edge.data()
        setSelectedEntity({
          ...data,
          isEdge: true,
        })
      })

      // Background click deselects
      cy.on('tap', (evt) => {
        if (evt.target === cy) {
          setSelectedEntity(null)
        }
      })

      cyRef.current = cy
    } catch (err) {
      console.error('Failed to initialize cytoscape:', err)
    } finally {
      setLoading(false)
    }

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy()
      }
    }
  }, [networkId])

  // Change layout
  const handleLayoutChange = (layoutName) => {
    setCurrentLayout(layoutName)
    if (!cyRef.current) return
    cyRef.current
      .layout({
        name: layoutName,
        animate: true,
        animationDuration: 600,
        padding: 40,
      })
      .run()
  }

  // Zoom controls
  const handleZoomIn = () => {
    if (!cyRef.current) return
    cyRef.current.zoom(cyRef.current.zoom() * 1.25)
  }

  const handleZoomOut = () => {
    if (!cyRef.current) return
    cyRef.current.zoom(cyRef.current.zoom() * 0.8)
  }

  const handleFit = () => {
    if (!cyRef.current) return
    cyRef.current.fit(null, 40)
  }

  // Filter entity types
  const toggleFilter = (type) => {
    const next = { ...activeFilters, [type]: !activeFilters[type] }
    setActiveFilters(next)

    if (!cyRef.current) return
    cyRef.current.batch(() => {
      cyRef.current.nodes(`[type = "${type}"]`).style('display', next[type] ? 'element' : 'none')
    })
  }

  // Toggle Highlight Loop
  const toggleLoopHighlight = () => {
    const nextState = !highlightLoopOnly
    setHighlightLoopOnly(nextState)

    if (!cyRef.current) return
    cyRef.current.batch(() => {
      if (nextState) {
        // Dim all non-circular elements
        cyRef.current.elements().style('opacity', 0.2)
        cyRef.current
          .elements('edge[type = "circular_ref"], node[type = "provider"]')
          .style('opacity', 1)
          .style('border-width', 4)
      } else {
        // Reset all opacity
        cyRef.current.elements().style('opacity', 1).style('border-width', 2)
      }
    })
  }

  return (
    <div className={`relative w-full rounded-sm border border-white/8 bg-[#080B24] overflow-hidden ${className}`}>
      {/* 1. TOP TOOLBAR & CONTROLS */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none gap-2 flex-wrap">
        {/* Left: Filter Entity Chips */}
        <div className="flex items-center gap-1.5 bg-[#0D1130]/90 backdrop-blur-md border border-white/10 p-1.5 rounded-sm pointer-events-auto shadow-lg">
          <span className="text-[10px] font-mono text-[#859588] px-1 uppercase font-semibold">
            Filter Node:
          </span>
          <button
            type="button"
            onClick={() => toggleFilter('provider')}
            className={`flex items-center gap-1 px-2 py-1 rounded-[2px] text-[10px] font-mono font-bold transition-colors ${
              activeFilters.provider
                ? 'bg-[#FF5C67]/20 text-[#FF7A85] border border-[#FF5C67]/40'
                : 'text-[#859588] border border-transparent'
            }`}
          >
            <Building2 className="w-3 h-3" />
            Faskes (3)
          </button>
          <button
            type="button"
            onClick={() => toggleFilter('doctor')}
            className={`flex items-center gap-1 px-2 py-1 rounded-[2px] text-[10px] font-mono font-bold transition-colors ${
              activeFilters.doctor
                ? 'bg-[#FFAE66]/20 text-[#FFAE66] border border-[#FFAE66]/40'
                : 'text-[#859588] border border-transparent'
            }`}
          >
            <Users className="w-3 h-3" />
            Dokter (3)
          </button>
          <button
            type="button"
            onClick={() => toggleFilter('patient')}
            className={`flex items-center gap-1 px-2 py-1 rounded-[2px] text-[10px] font-mono font-bold transition-colors ${
              activeFilters.patient
                ? 'bg-[#35F2A0]/20 text-[#35F2A0] border border-[#35F2A0]/40'
                : 'text-[#859588] border border-transparent'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            Pasien (5)
          </button>
        </div>

        {/* Right: Layout Switcher & Actions */}
        <div className="flex items-center gap-1.5 bg-[#0D1130]/90 backdrop-blur-md border border-white/10 p-1.5 rounded-sm pointer-events-auto shadow-lg">
          <button
            type="button"
            onClick={toggleLoopHighlight}
            className={`px-2 py-1 rounded-[2px] text-[10px] font-mono font-bold transition-colors flex items-center gap-1 ${
              highlightLoopOnly
                ? 'bg-[#FF5C67] text-[#080B24]'
                : 'bg-[#FF5C67]/15 text-[#FF7A85] hover:bg-[#FF5C67]/25'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            {highlightLoopOnly ? 'Reset Sorotan' : 'Sorot Jalur Sirkular'}
          </button>

          <span className="h-3 w-px bg-white/15" />

          {/* Layout buttons */}
          {['cose', 'concentric', 'circle'].map((layoutName) => (
            <button
              key={layoutName}
              type="button"
              onClick={() => handleLayoutChange(layoutName)}
              className={`px-2 py-1 rounded-[2px] text-[10px] font-mono uppercase transition-colors ${
                currentLayout === layoutName
                  ? 'bg-[#35F2A0] text-[#080B24] font-bold'
                  : 'text-[#859588] hover:text-[#DFE0FF]'
              }`}
            >
              {layoutName}
            </button>
          ))}
        </div>
      </div>

      {/* 2. ZOOM & PAN FLOATING CONTROLS (BOTTOM RIGHT) */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1 bg-[#0D1130]/90 backdrop-blur-md border border-white/10 p-1 rounded-sm shadow-xl">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-1.5 text-[#859588] hover:text-white hover:bg-white/5 rounded-sm transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-1.5 text-[#859588] hover:text-white hover:bg-white/5 rounded-sm transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleFit}
          title="Fit to Screen"
          className="p-1.5 text-[#859588] hover:text-white hover:bg-white/5 rounded-sm transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 3. CYTOSCAPE CANVAS DOM CONTAINER */}
      <div
        ref={containerRef}
        className="w-full h-[520px] bg-[#080B24] cursor-grab active:cursor-grabbing"
      />

      {/* 4. NODE / EDGE INSPECTOR HUD DRAWER (LEFT BOTTOM) */}
      {selectedEntity && (
        <div className="absolute bottom-4 left-4 z-20 w-80 bg-[#0D1130]/95 backdrop-blur-lg border border-white/15 p-4 rounded-sm shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-start justify-between pb-2 border-b border-white/10 mb-2.5">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#35F2A0] font-bold block">
                {selectedEntity.isNode ? `INSPEKSI NODE // ${selectedEntity.type?.toUpperCase()}` : 'RELASI RELASIONAL // EDGE'}
              </span>
              <h4 className="text-xs font-bold text-white font-headline">
                {selectedEntity.label || selectedEntity.id}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setSelectedEntity(null)}
              className="p-1 text-[#859588] hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {selectedEntity.riskScore !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-[#859588]">Skor Risiko Entitas:</span>
                <span className="text-[#FF7A85] font-bold">
                  {selectedEntity.riskScore}/100
                </span>
              </div>
            )}
            {selectedEntity.degree !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-[#859588]">Derajat Relasi (Degree):</span>
                <span className="text-[#DFE0FF] font-bold">
                  {selectedEntity.degree} Koneksi
                </span>
              </div>
            )}
            {selectedEntity.totalAmount && (
              <div className="flex items-center justify-between">
                <span className="text-[#859588]">Total Akumulasi Klaim:</span>
                <span className="text-white font-bold">
                  {selectedEntity.totalAmount}
                </span>
              </div>
            )}
            {selectedEntity.nik && (
              <div className="flex items-center justify-between">
                <span className="text-[#859588]">NIK (Masked UU PDP):</span>
                <span className="text-[#35F2A0] font-bold">
                  {selectedEntity.nik}
                </span>
              </div>
            )}
            {selectedEntity.specialty && (
              <div className="flex items-center justify-between">
                <span className="text-[#859588]">Spesialisasi Klinis:</span>
                <span className="text-[#FFAE66]">
                  {selectedEntity.specialty}
                </span>
              </div>
            )}
            {selectedEntity.isEdge && (
              <div className="text-[11px] text-[#9CA7C5] pt-1 border-t border-white/6 font-sans">
                Relasi menghubungkan <span className="text-white font-mono">{selectedEntity.source}</span> ke <span className="text-white font-mono">{selectedEntity.target}</span> dengan bobot anomali <span className="text-[#FF7A85] font-mono">{selectedEntity.weight}</span>.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. BOTTOM HUD STATUS & LEGEND */}
      <div className="h-9 px-4 bg-[#090C25] border-t border-white/8 flex items-center justify-between text-[10px] font-mono text-[#859588]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-[1px] bg-[#FF5C67]" />
            Faskes Rujukan Terindikasi
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FFAE66]" />
            Dokter Terkoordinasi
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#35F2A0]" />
            Peserta (Masked UU PDP)
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[#35F2A0]">
          <span>APACHE AGE CYPHER</span>
          <span>•</span>
          <span>KLIK NODE UNTUK INSPEKSI HUD</span>
        </div>
      </div>
    </div>
  )
}

export default NetworkGraph
