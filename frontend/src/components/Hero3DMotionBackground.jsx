import React, { useRef, useEffect } from 'react'
import { useJagaTheme } from '../context/ThemeContext'

/**
 * Hero3DMotionBackground
 * 3D interactive topological motion background for JAGA Hero Section.
 * Features:
 * - 3D Euler perspective projection & depth sorting
 * - Floating healthcare fraud detection constellation lattice
 * - Flowing data packets traveling across 3D network edges
 * - Interactive mouse parallax with smooth spring/easing
 * - Dynamic theme adaptation (Dark Sovereign Cyber & Light Clean Minimal)
 * - Zero external 3D engine overhead (pure 60fps HTML5 Canvas)
 */
const Hero3DMotionBackground = () => {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const { isDark } = useJagaTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width = 0
    let height = 0

    // High DPI scaling with robust dimension bounds
    const updateDimensions = () => {
      const container = containerRef.current || canvas.parentElement
      if (!container) return
      const rect = container.getBoundingClientRect()

      const measuredW = rect.width > 120 ? rect.width : (window.innerWidth > 120 ? window.innerWidth : 1280)
      const measuredH = rect.height > 120 ? rect.height : (window.innerHeight > 120 ? window.innerHeight : 680)

      width = measuredW
      height = measuredH

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    updateDimensions()
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions()
    })
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    // Interactive mouse parallax state
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1
      mouse.targetX = nx * 0.45
      mouse.targetY = ny * 0.35
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Generate 3D Constellation Nodes
    // Form structured orbital rings and topological clusters
    const nodes = []
    const nodeCount = 54

    // Cluster 1: Sovereign Core Hub (BPJS Center & Regional Faskes)
    for (let i = 0; i < 22; i++) {
      const theta = (i / 22) * Math.PI * 2
      const radius = 180 + Math.sin(i * 3.4) * 50
      const yOffset = (Math.sin(i * 2.1) - 0.5) * 90
      nodes.push({
        x: Math.cos(theta) * radius,
        y: yOffset,
        z: Math.sin(theta) * radius,
        baseX: Math.cos(theta) * radius,
        baseY: yOffset,
        baseZ: Math.sin(theta) * radius,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 0.3,
        type: i % 4 === 0 ? 'faskes' : i % 3 === 0 ? 'anomaly' : 'core',
        radius: i % 5 === 0 ? 4.5 : 3.2,
      })
    }

    // Cluster 2: Outer Equatorial Perimeter Ring
    for (let i = 0; i < 18; i++) {
      const phi = (i / 18) * Math.PI * 2
      const r = 320 + Math.cos(i * 1.8) * 40
      const y = Math.sin(i * 2.5) * 70
      nodes.push({
        x: Math.cos(phi) * r,
        y: y,
        z: Math.sin(phi) * r,
        baseX: Math.cos(phi) * r,
        baseY: y,
        baseZ: Math.sin(phi) * r,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        vz: (Math.random() - 0.5) * 0.25,
        type: i % 6 === 0 ? 'warning' : 'satellite',
        radius: 2.8,
      })
    }

    // Cluster 3: Deep Field Star Dust Nodes
    for (let i = 0; i < 14; i++) {
      const theta = Math.random() * Math.PI * 2
      const r = 120 + Math.random() * 260
      const y = (Math.random() - 0.5) * 220
      nodes.push({
        x: Math.cos(theta) * r,
        y: y,
        z: Math.sin(theta) * r,
        baseX: Math.cos(theta) * r,
        baseY: y,
        baseZ: Math.sin(theta) * r,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        vz: (Math.random() - 0.5) * 0.2,
        type: 'ambient',
        radius: 2.0,
      })
    }

    // Dynamic Edge Data Packets (flowing pulses)
    const packets = []
    for (let i = 0; i < 9; i++) {
      packets.push({
        sourceIdx: Math.floor(Math.random() * nodes.length),
        targetIdx: Math.floor(Math.random() * nodes.length),
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.006,
      })
    }

    // 3D Perspective Projection Function
    const fov = 480
    const cameraDistance = 520

    const project3D = (x, y, z, rotX, rotY, w, h) => {
      // Rotation around Y
      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)
      const x1 = x * cosY - z * sinY
      const z1 = z * cosY + x * sinY

      // Rotation around X
      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)
      const y2 = y * cosX - z1 * sinX
      const z2 = z1 * cosX + y * sinX

      const depth = cameraDistance + z2
      const scale = depth > 40 ? fov / depth : 0

      return {
        x: w / 2 + x1 * scale,
        y: h / 2 + y2 * scale,
        scale,
        depth: z2,
      }
    }

    let rotY = 0
    let rotX = 0.22
    let clock = 0

    // Render Loop
    const render = () => {
      clock += 0.016
      ctx.clearRect(0, 0, width, height)

      // Smooth mouse parallax lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.04
      mouse.y += (mouse.targetY - mouse.y) * 0.04

      // Gentle continuous ambient auto-rotation combined with mouse offset
      rotY += 0.0018
      const currentRotX = rotX + mouse.y * 0.4
      const currentRotY = rotY + mouse.x * 0.6

      // Ambient radial cyber glow backdrop in hero
      const cx = width * 0.5
      const cy = height * 0.45
      const radialGradient = ctx.createRadialGradient(
        cx,
        cy,
        40,
        cx,
        cy,
        Math.max(width * 0.6, 500)
      )

      if (isDark) {
        radialGradient.addColorStop(0, 'rgba(53, 242, 160, 0.08)')
        radialGradient.addColorStop(0.35, 'rgba(56, 189, 248, 0.04)')
        radialGradient.addColorStop(0.7, 'rgba(30, 41, 89, 0.02)')
        radialGradient.addColorStop(1, 'rgba(8, 11, 36, 0)')
      } else {
        radialGradient.addColorStop(0, 'rgba(16, 185, 129, 0.07)')
        radialGradient.addColorStop(0.35, 'rgba(14, 165, 233, 0.04)')
        radialGradient.addColorStop(0.7, 'rgba(226, 232, 240, 0.02)')
        radialGradient.addColorStop(1, 'rgba(244, 246, 251, 0)')
      }
      ctx.fillStyle = radialGradient
      ctx.fillRect(0, 0, width, height)

      // Subtle cyber floating particle drift
      nodes.forEach((node) => {
        node.x += node.vx
        node.y += node.vy
        node.z += node.vz

        // Bound elastic bounce near original base
        const dx = node.x - node.baseX
        const dy = node.y - node.baseY
        const dz = node.z - node.baseZ
        if (Math.abs(dx) > 25) node.vx *= -1
        if (Math.abs(dy) > 25) node.vy *= -1
        if (Math.abs(dz) > 25) node.vz *= -1
      })

      // Project all nodes to 2D screen coordinates
      const projected = nodes.map((node, idx) => {
        const p = project3D(node.x, node.y, node.z, currentRotX, currentRotY, width, height)
        return {
          ...node,
          idx,
          sx: p.x,
          sy: p.y,
          scale: p.scale,
          depth: p.depth,
        }
      })

      // Painter's algorithm: sort by depth for correct 3D overlap
      projected.sort((a, b) => a.depth - b.depth)

      // Build quick lookup for edge connections
      const maxConnectDist = 160

      // Draw 3D Interconnecting Graph Edges
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i]
        if (p1.scale <= 0) continue

        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j]
          if (p2.scale <= 0) continue

          const dx3 = p1.x - p2.x
          const dy3 = p1.y - p2.y
          const dz3 = p1.z - p2.z
          const dist3D = Math.sqrt(dx3 * dx3 + dy3 * dy3 + dz3 * dz3)

          if (dist3D < maxConnectDist) {
            const proximity = 1 - dist3D / maxConnectDist
            // Normalize depth opacity
            const avgDepth = (p1.depth + p2.depth) / 2
            const depthFactor = Math.max(0.15, Math.min(1, (avgDepth + 260) / 520))
            const alpha = proximity * 0.28 * depthFactor

            ctx.beginPath()
            ctx.moveTo(p1.sx, p1.sy)
            ctx.lineTo(p2.sx, p2.sy)

            if (isDark) {
              if (p1.type === 'anomaly' || p2.type === 'anomaly') {
                ctx.strokeStyle = `rgba(255, 92, 103, ${alpha * 1.2})`
              } else if (p1.type === 'core' || p2.type === 'core') {
                ctx.strokeStyle = `rgba(53, 242, 160, ${alpha * 1.1})`
              } else {
                ctx.strokeStyle = `rgba(148, 163, 184, ${alpha * 0.7})`
              }
            } else {
              if (p1.type === 'anomaly' || p2.type === 'anomaly') {
                ctx.strokeStyle = `rgba(239, 68, 68, ${alpha * 1.3})`
              } else if (p1.type === 'core' || p2.type === 'core') {
                ctx.strokeStyle = `rgba(16, 185, 129, ${alpha * 1.2})`
              } else {
                ctx.strokeStyle = `rgba(100, 116, 139, ${alpha * 0.8})`
              }
            }

            ctx.lineWidth = Math.max(0.6, (p1.scale + p2.scale) * 0.6)
            ctx.stroke()
          }
        }
      }

      // Draw Flowing Data Packets
      packets.forEach((pkt) => {
        pkt.progress += pkt.speed
        if (pkt.progress >= 1) {
          pkt.progress = 0
          pkt.sourceIdx = Math.floor(Math.random() * nodes.length)
          pkt.targetIdx = Math.floor(Math.random() * nodes.length)
        }

        const src = projected.find((p) => p.idx === pkt.sourceIdx)
        const tgt = projected.find((p) => p.idx === pkt.targetIdx)

        if (src && tgt && src.scale > 0 && tgt.scale > 0) {
          const dx3 = src.x - tgt.x
          const dy3 = src.y - tgt.y
          const dz3 = src.z - tgt.z
          const dist = Math.sqrt(dx3 * dx3 + dy3 * dy3 + dz3 * dz3)

          if (dist < maxConnectDist) {
            const px = src.sx + (tgt.sx - src.sx) * pkt.progress
            const py = src.sy + (tgt.sy - src.sy) * pkt.progress
            const pscale = src.scale + (tgt.scale - src.scale) * pkt.progress

            ctx.beginPath()
            ctx.arc(px, py, Math.max(1.5, pscale * 2.2), 0, Math.PI * 2)
            ctx.fillStyle = isDark
              ? 'rgba(53, 242, 160, 0.95)'
              : 'rgba(16, 185, 129, 0.95)'
            ctx.shadowColor = isDark ? '#35F2A0' : '#10B981'
            ctx.shadowBlur = 8
            ctx.fill()
            ctx.shadowBlur = 0
          }
        }
      })

      // Draw 3D Nodes with Perspective Halo
      projected.forEach((p) => {
        if (p.scale <= 0) return

        const nodeRadius = Math.max(1.5, p.radius * p.scale)
        const depthNorm = Math.max(0.2, Math.min(1, (p.depth + 300) / 600))

        ctx.beginPath()
        ctx.arc(p.sx, p.sy, nodeRadius, 0, Math.PI * 2)

        let nodeColor = '#35F2A0'
        let haloColor = 'rgba(53, 242, 160, 0.25)'

        if (p.type === 'anomaly') {
          nodeColor = '#FF5C67'
          haloColor = 'rgba(255, 92, 103, 0.3)'
        } else if (p.type === 'faskes') {
          nodeColor = isDark ? '#38BDF8' : '#0284C7'
          haloColor = isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(2, 132, 199, 0.2)'
        } else if (p.type === 'warning') {
          nodeColor = '#FFAE66'
          haloColor = 'rgba(255, 174, 102, 0.25)'
        } else if (p.type === 'ambient') {
          nodeColor = isDark ? '#94A3B8' : '#64748B'
          haloColor = 'rgba(148, 163, 184, 0.15)'
        } else {
          nodeColor = isDark ? '#35F2A0' : '#10B981'
          haloColor = isDark ? 'rgba(53, 242, 160, 0.25)' : 'rgba(16, 185, 129, 0.2)'
        }

        // Outer soft glow ring
        if (p.type !== 'ambient') {
          ctx.beginPath()
          ctx.arc(p.sx, p.sy, nodeRadius * 2.4, 0, Math.PI * 2)
          ctx.fillStyle = haloColor
          ctx.fill()
        }

        // Inner solid core
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, nodeRadius, 0, Math.PI * 2)
        ctx.fillStyle = nodeColor
        ctx.globalAlpha = depthNorm
        ctx.fill()
        ctx.globalAlpha = 1.0

        // Concentric pulse on primary hub nodes
        if (p.type === 'core' && p.idx % 5 === 0) {
          const pulseR = nodeRadius + (Math.sin(clock * 3 + p.idx) + 1) * 3
          ctx.beginPath()
          ctx.arc(p.sx, p.sy, pulseR, 0, Math.PI * 2)
          ctx.strokeStyle = isDark ? 'rgba(53, 242, 160, 0.4)' : 'rgba(16, 185, 129, 0.4)'
          ctx.lineWidth = 0.8
          ctx.stroke()
        }
      })

      // Bottom Fade Vignette for Seamless Transition into next section
      const fadeHeight = 120
      const bottomGradient = ctx.createLinearGradient(0, height - fadeHeight, 0, height)
      if (isDark) {
        bottomGradient.addColorStop(0, 'rgba(8, 11, 36, 0)')
        bottomGradient.addColorStop(1, 'rgba(8, 11, 36, 0.95)')
      } else {
        bottomGradient.addColorStop(0, 'rgba(244, 246, 251, 0)')
        bottomGradient.addColorStop(1, 'rgba(244, 246, 251, 0.95)')
      }
      ctx.fillStyle = bottomGradient
      ctx.fillRect(0, height - fadeHeight, width, fadeHeight)

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current)
      }
      resizeObserver.disconnect()
    }
  }, [isDark])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  )
}

export default Hero3DMotionBackground
