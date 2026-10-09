import React, { useRef, useEffect, useState, useMemo } from 'react'
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Info,
  ShieldAlert,
  Building2,
  Users,
  Eye,
  Activity,
  Layers,
} from 'lucide-react'
import { useJagaTheme } from '../context/ThemeContext'
import RiskBadge from './RiskBadge'

/**
 * GlobalNetwork3DWidget
 * 3D Isometric / Orbiting Canvas Network Graph Widget
 * Visualizes the entire system's entities (Faskes, Doctors, Claims, Syndicates)
 * in an interactive, user-friendly 3D perspective space using HTML5 Canvas.
 */
const GlobalNetwork3DWidget = ({
  networks = [],
  onSelectNetwork = null,
  height = 360,
}) => {
  const { isDark } = useJagaTheme()
  const canvasRef = useRef(null)

  // Camera & interaction state
  const [rotation, setRotation] = useState({ x: 0.45, y: -0.6 })
  const [zoom, setZoom] = useState(1.0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hoveredNode, setHoveredNode] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [filterType, setFilterType] = useState('ALL') // ALL, CRITICAL, FASKES, DOCTOR

  // Generate 3D Node Mesh representing the entire syndicate universe
  const { nodes, edges } = useMemo(() => {
    const rawNodes = []
    const rawEdges = []

    // 1. Core Center Hub (BPJS Sovereign Engine)
    rawNodes.push({
      id: 'HUB-BPJS',
      label: 'BPJS Sovereign Engine (Apache AGE)',
      type: 'hub',
      x: 0,
      y: 0,
      z: 0,
      radius: 14,
      color: '#35F2A0',
      category: 'HUB',
      score: 100,
      desc: 'Pusat Analisis Graf & Knowledge Base Nasional',
    })

    // 2. Map networks as major cluster anchors in 3D orbit
    const baseNetworks = networks.length > 0 ? networks : [
      { network_id: 'NET-089', name: 'Sindikat RSUD T-P-K', risk_category: 'CRITICAL', risk_score: 94, region: 'DKI Jakarta' },
      { network_id: 'NET-074', name: 'Kloning Berkas Pratama X', risk_category: 'CRITICAL', risk_score: 89, region: 'Jawa Barat' },
      { network_id: 'NET-061', name: 'Inflasi Diagnosis Sub-akut', risk_category: 'HIGH', risk_score: 82, region: 'Jawa Timur' },
      { network_id: 'NET-055', name: 'Ghost Billing Farmasi', risk_category: 'HIGH', risk_score: 78, region: 'Sumatera Utara' },
      { network_id: 'NET-038', name: 'Split Claiming Patologi', risk_category: 'MEDIUM', risk_score: 55, region: 'DKI Jakarta' },
    ]

    baseNetworks.slice(0, 8).forEach((net, idx) => {
      const angle = (idx / Math.min(baseNetworks.length, 8)) * Math.PI * 2
      const radius = 130 + (idx % 2) * 35
      const heightOffset = ((idx % 3) - 1) * 60

      const netX = Math.cos(angle) * radius
      const netY = heightOffset
      const netZ = Math.sin(angle) * radius

      const isCritical = net.risk_category === 'CRITICAL' || net.risk_score >= 85
      const netColor = isCritical ? '#FF5C67' : net.risk_score >= 70 ? '#FFAE66' : '#35F2A0'

      const syndicateNode = {
        id: net.network_id,
        label: net.name || `Kasus ${net.network_id}`,
        type: 'syndicate',
        networkId: net.network_id,
        x: netX,
        y: netY,
        z: netZ,
        radius: 11,
        color: netColor,
        category: net.risk_category || 'HIGH',
        score: net.risk_score || 80,
        region: net.region || 'Nasional',
        desc: `Total Klaim Berisiko • Skor ${net.risk_score}/100`,
      }
      rawNodes.push(syndicateNode)

      // Connect to Core Hub
      rawEdges.push({
        source: 'HUB-BPJS',
        target: syndicateNode.id,
        color: isCritical ? 'rgba(255, 92, 103, 0.45)' : 'rgba(53, 242, 160, 0.35)',
        width: isCritical ? 2.2 : 1.2,
        dashed: !isCritical,
      })

      // 3. Child entities for each syndicate (Faskes, Doctors, Claims)
      const subCount = 3 + (idx % 3)
      for (let s = 0; s < subCount; s++) {
        const subAngle = angle + ((s - subCount / 2) * 0.42)
        const subDist = 45 + (s * 15)
        const subY = netY + ((s % 2 === 0 ? 1 : -1) * (20 + s * 10))

        const subType = s === 0 ? 'faskes' : s === 1 ? 'doctor' : 'claim'
        const subColor =
          subType === 'faskes'
            ? '#38BDF8' // Sky blue
            : subType === 'doctor'
            ? '#FCD34D' // Amber yellow
            : '#A78BFA' // Violet

        const subNode = {
          id: `${net.network_id}-SUB-${s}`,
          label:
            subType === 'faskes'
              ? `Faskes Terlibat #${s + 1}`
              : subType === 'doctor'
              ? `Dokter DPJP #${s + 1}`
              : `Klaim Anomali #${s + 1}`,
          type: subType,
          networkId: net.network_id,
          x: netX + Math.cos(subAngle) * subDist,
          y: subY,
          z: netZ + Math.sin(subAngle) * subDist,
          radius: subType === 'faskes' ? 7.5 : subType === 'doctor' ? 6 : 4.5,
          color: subColor,
          category: net.risk_category,
          score: Math.max(40, net.risk_score - s * 8),
          desc: `Entitas Terhubung di ${net.network_id}`,
        }
        rawNodes.push(subNode)

        // Connect child to syndicate anchor
        rawEdges.push({
          source: syndicateNode.id,
          target: subNode.id,
          color: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(15, 23, 42, 0.15)',
          width: 1,
          dashed: false,
        })
      }
    })

    return { nodes: rawNodes, edges: rawEdges }
  }, [networks, isDark])

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let currentRot = { ...rotation }

    // Responsive sizing & handle resize observer
    let lastWidth = 0
    let lastHeight = 0

    const checkSize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      const w = Math.floor(rect.width * dpr)
      const h = Math.floor(rect.height * dpr)

      if (w > 0 && h > 0 && (w !== lastWidth || h !== lastHeight)) {
        canvas.width = w
        canvas.height = h
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.scale(dpr, dpr)
        lastWidth = w
        lastHeight = h
      }
    }
    checkSize()

    const resizeObserver = new ResizeObserver(() => {
      checkSize()
    })
    resizeObserver.observe(canvas)

    // 3D Projection math
    const project3D = (x, y, z, rot, currentZoom, width, height) => {
      // Rotation around Y
      const cosY = Math.cos(rot.y)
      const sinY = Math.sin(rot.y)
      const x1 = x * cosY - z * sinY
      const z1 = z * cosY + x * sinY

      // Rotation around X
      const cosX = Math.cos(rot.x)
      const sinX = Math.sin(rot.x)
      const y2 = y * cosX - z1 * sinX
      const z2 = z1 * cosX + y * sinX

      // Perspective projection
      const fov = 420
      const distance = 460
      const scale = (fov / (distance + z2)) * currentZoom

      const projX = width / 2 + x1 * scale
      const projY = height / 2 + y2 * scale

      return {
        x: projX,
        y: projY,
        scale,
        depth: z2,
      }
    }

    const render = () => {
      const width = canvas.clientWidth || 800
      const height = canvas.clientHeight || 340

      ctx.clearRect(0, 0, width, height)

      // Auto rotation when idle
      if (autoRotate && !isDragging) {
        currentRot.y += 0.0035
      }

      // Background Grid / 3D Plane rings
      const ringRadius = [100, 160, 220]
      ringRadius.forEach((r) => {
        ctx.beginPath()
        ctx.ellipse(
          width / 2,
          height / 2 + 30 * Math.sin(currentRot.x),
          r * zoom * 0.9,
          r * zoom * 0.38 * Math.abs(Math.cos(currentRot.x)),
          0,
          0,
          Math.PI * 2
        )
        ctx.strokeStyle = isDark ? 'rgba(53, 242, 160, 0.06)' : 'rgba(11, 148, 91, 0.08)'
        ctx.lineWidth = 1
        ctx.setLineDash([4, 4])
        ctx.stroke()
        ctx.setLineDash([])
      })

      // Project all nodes
      const projectedNodes = nodes.map((node) => {
        const proj = project3D(node.x, node.y, node.z, currentRot, zoom, width, height)
        return {
          ...node,
          projX: proj.x,
          projY: proj.y,
          projScale: proj.scale,
          depth: proj.depth,
        }
      })

      // Build quick lookup for edges
      const nodeMap = new Map()
      projectedNodes.forEach((n) => nodeMap.set(n.id, n))

      // 1. Draw Edges
      edges.forEach((edge) => {
        const s = nodeMap.get(edge.source)
        const t = nodeMap.get(edge.target)
        if (!s || !t) return

        ctx.beginPath()
        ctx.moveTo(s.projX, s.projY)
        ctx.lineTo(t.projX, t.projY)
        ctx.strokeStyle = edge.color
        ctx.lineWidth = edge.width * Math.min(s.projScale, t.projScale)
        if (edge.dashed) {
          ctx.setLineDash([3, 3])
        } else {
          ctx.setLineDash([])
        }
        ctx.stroke()
        ctx.setLineDash([])
      })

      // 2. Sort nodes by depth (painter's algorithm)
      const sortedNodes = [...projectedNodes].sort((a, b) => b.depth - a.depth)

      // 3. Draw Nodes
      sortedNodes.forEach((node) => {
        const isHovered = hoveredNode?.id === node.id
        const isSelected = selectedNode?.id === node.id
        const r = Math.max(2, node.radius * node.projScale * (isHovered || isSelected ? 1.35 : 1))

        // Outer glow
        if (node.type === 'syndicate' || node.type === 'hub' || isHovered) {
          ctx.beginPath()
          ctx.arc(node.projX, node.projY, r * 2.2, 0, Math.PI * 2)
          const grad = ctx.createRadialGradient(
            node.projX,
            node.projY,
            r * 0.5,
            node.projX,
            node.projY,
            r * 2.2
          )
          grad.addColorStop(0, `${node.color}55`)
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.fill()
        }

        // Inner circle
        ctx.beginPath()
        ctx.arc(node.projX, node.projY, r, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()
        ctx.strokeStyle = isDark ? '#080B24' : '#FFFFFF'
        ctx.lineWidth = 1.5 * node.projScale
        ctx.stroke()

        // Highlight ring if selected
        if (isSelected) {
          ctx.beginPath()
          ctx.arc(node.projX, node.projY, r + 4, 0, Math.PI * 2)
          ctx.strokeStyle = '#35F2A0'
          ctx.lineWidth = 2
          ctx.setLineDash([3, 2])
          ctx.stroke()
          ctx.setLineDash([])
        }

        // Labels for high-level nodes or hovered
        if (node.type === 'hub' || node.type === 'syndicate' || isHovered || isSelected) {
          ctx.font = `${isHovered ? 'bold ' : ''}${Math.round(
            Math.max(9, 11 * node.projScale)
          )}px Inter, sans-serif`
          ctx.fillStyle = isDark ? '#DFE0FF' : '#0F172A'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'top'

          // Background pill for label legibility
          const text = node.label
          const metrics = ctx.measureText(text)
          const pad = 4
          const labelY = node.projY + r + 4

          ctx.fillStyle = isDark ? 'rgba(8, 11, 36, 0.85)' : 'rgba(255, 255, 255, 0.9)'
          ctx.fillRect(
            node.projX - metrics.width / 2 - pad,
            labelY - 1,
            metrics.width + pad * 2,
            14
          )
          ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          ctx.lineWidth = 0.5
          ctx.strokeRect(
            node.projX - metrics.width / 2 - pad,
            labelY - 1,
            metrics.width + pad * 2,
            14
          )

          ctx.fillStyle = isDark ? '#DFE0FF' : '#0F172A'
          ctx.fillText(text, node.projX, labelY)
        }
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      resizeObserver.disconnect()
      cancelAnimationFrame(animationFrameId)
    }
  }, [nodes, edges, rotation, zoom, hoveredNode, selectedNode, autoRotate, isDragging, isDark])

  // Mouse & touch handlers for 3D navigation
  const handleMouseDown = (e) => {
    setIsDragging(true)
    setAutoRotate(false)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    if (isDragging) {
      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y
      setRotation((prev) => ({
        x: Math.max(-1.1, Math.min(1.1, prev.x + deltaY * 0.006)),
        y: prev.y + deltaX * 0.008,
      }))
      setDragStart({ x: e.clientX, y: e.clientY })
    } else {
      // Hit detection for hover
      // Project nodes in current state
      const width = rect.width
      const height = rect.height
      let found = null

      for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i]
        const cosY = Math.cos(rotation.y)
        const sinY = Math.sin(rotation.y)
        const x1 = node.x * cosY - node.z * sinY
        const z1 = node.z * cosY + node.x * sinY

        const cosX = Math.cos(rotation.x)
        const sinX = Math.sin(rotation.x)
        const y2 = node.y * cosX - z1 * sinX
        const z2 = z1 * cosX + node.y * sinX

        const fov = 420
        const distance = 460
        const scale = (fov / (distance + z2)) * zoom
        const px = width / 2 + x1 * scale
        const py = height / 2 + y2 * scale

        const dist = Math.hypot(mouseX - px, mouseY - py)
        if (dist <= Math.max(10, node.radius * scale + 6)) {
          found = node
          break
        }
      }

      setHoveredNode(found)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleClick = () => {
    if (hoveredNode) {
      setSelectedNode(hoveredNode)
      if (hoveredNode.networkId && onSelectNetwork) {
        onSelectNetwork(hoveredNode.networkId)
      }
    }
  }

  const handleWheel = (e) => {
    e.preventDefault()
    setZoom((prev) => Math.max(0.6, Math.min(2.2, prev - e.deltaY * 0.0012)))
  }

  const resetView = () => {
    setRotation({ x: 0.45, y: -0.6 })
    setZoom(1.0)
    setAutoRotate(true)
    setSelectedNode(null)
  }

  return (
    <div className={`relative rounded-sm border overflow-hidden transition-all ${
      isDark ? 'bg-[#080B24] border-white/8' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      {/* Top Header Widget Bar */}
      <div className={`px-4 py-2.5 border-b flex items-center justify-between flex-wrap gap-2 text-xs font-mono ${
        isDark ? 'bg-[#0D1130] border-white/8' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#35F2A0] animate-pulse" />
          <span className={`font-bold font-headline tracking-wide uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Topologi 3D Jaringan Graf Nasional (Omni-View)
          </span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-[2px] ${
            isDark ? 'bg-[#35F2A0]/10 text-[#35F2A0] border border-[#35F2A0]/30' : 'bg-emerald-100 text-[#0B945B]'
          }`}>
            {nodes.length} Entitas Aktif
          </span>
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2 py-1 rounded-[2px] text-[10px] border transition-colors cursor-pointer ${
              autoRotate
                ? isDark
                  ? 'bg-[#35F2A0]/10 border-[#35F2A0]/40 text-[#35F2A0]'
                  : 'bg-emerald-50 border-[#0B945B] text-[#0B945B]'
                : isDark
                ? 'bg-white/5 border-white/10 text-[#9CA7C5]'
                : 'bg-white border-slate-300 text-slate-600'
            }`}
            title="Toggle Putar Otomatis"
          >
            {autoRotate ? 'Orbit: Aktif' : 'Orbit: Diam'}
          </button>

          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.2, z + 0.2))}
            className={`p-1 rounded-[2px] border transition-colors cursor-pointer ${
              isDark ? 'border-white/10 text-[#DFE0FF] hover:bg-white/5' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
            title="Perbesar"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
            className={`p-1 rounded-[2px] border transition-colors cursor-pointer ${
              isDark ? 'border-white/10 text-[#DFE0FF] hover:bg-white/5' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
            title="Perkecil"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={resetView}
            className={`p-1 rounded-[2px] border transition-colors cursor-pointer ${
              isDark ? 'border-white/10 text-[#DFE0FF] hover:bg-white/5' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
            title="Reset Sudut Pandang"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive 3D Canvas */}
      <div
        className="relative cursor-grab active:cursor-grabbing select-none"
        style={{ height: `${height}px` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onWheel={handleWheel}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ height: `${height}px` }}
        />

        {/* Legend Overlay */}
        <div className={`absolute bottom-3 left-3 px-3 py-2 rounded-sm border text-[10px] font-mono backdrop-blur-md pointer-events-none ${
          isDark ? 'bg-[#080B24]/90 border-white/10 text-[#DFE0FF]' : 'bg-white/95 border-slate-200 text-slate-800 shadow-xs'
        }`}>
          <div className="font-bold mb-1 uppercase tracking-wider text-[9px] text-[#859588]">
            Legenda Node 3D
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF5C67]" />
              Sindikat Kritis (≥85)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
              Faskes Rujukan
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FFAE66]" />
              Sindikat Tinggi
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FCD34D]" />
              Dokter Penanggung Jawab
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#35F2A0]" />
              Sovereign Core Hub
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#A78BFA]" />
              Klaim Pasien Terkait
            </span>
          </div>
        </div>

        {/* Instruction hint */}
        <div className={`absolute top-3 right-3 text-[10px] font-mono px-2 py-1 rounded-[2px] border pointer-events-none ${
          isDark ? 'bg-[#080B24]/80 border-white/8 text-[#859588]' : 'bg-slate-50/90 border-slate-200 text-slate-500'
        }`}>
          Drag untuk putar 3D • Scroll untuk zoom • Klik node untuk info
        </div>

        {/* Selected / Hovered Node Tooltip Panel */}
        {(hoveredNode || selectedNode) && (
          <div className={`absolute top-3 left-3 max-w-xs p-3 rounded-sm border shadow-lg text-xs font-mono pointer-events-none transition-all ${
            isDark ? 'bg-[#0D1130]/95 border-white/15 text-[#DFE0FF]' : 'bg-white/95 border-slate-300 text-slate-900'
          }`}>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-bold font-headline truncate">
                {(hoveredNode || selectedNode).label}
              </span>
              {(hoveredNode || selectedNode).category && (
                <span
                  className="px-1.5 py-0.2 rounded-[2px] text-[9px] font-bold"
                  style={{
                    backgroundColor: `${(hoveredNode || selectedNode).color}22`,
                    color: (hoveredNode || selectedNode).color,
                    border: `1px solid ${(hoveredNode || selectedNode).color}55`,
                  }}
                >
                  {(hoveredNode || selectedNode).category}
                </span>
              )}
            </div>
            <div className={`text-[11px] mb-1.5 ${isDark ? 'text-[#9CA7C5]' : 'text-slate-600'}`}>
              {(hoveredNode || selectedNode).desc}
            </div>
            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/10 text-[#859588]">
              <span>Tipe: {(hoveredNode || selectedNode).type?.toUpperCase()}</span>
              {(hoveredNode || selectedNode).score && (
                <span>Skor Risiko: {(hoveredNode || selectedNode).score}/100</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GlobalNetwork3DWidget
