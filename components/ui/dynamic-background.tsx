"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

interface DynamicBackgroundProps {
  className?: string
  intensity?: number
  children?: React.ReactNode
}

export function DynamicBackground({ className = "", intensity = 15, children }: DynamicBackgroundProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()

      // 计算鼠标在元素内的相对位置 (-1 到 1)
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1

      setPosition({ x, y })
    }

    const element = ref.current
    if (element) {
      element.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      if (element) {
        element.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [])

  const transformStyle = {
    transform: `perspective(1000px) rotateX(${position.y * intensity * -1}deg) rotateY(${position.x * intensity}deg) scale3d(1.05, 1.05, 1.05)`,
    transition: "transform 0.1s ease",
  }

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} style={transformStyle}>
      {children}
    </div>
  )
}
