"use client"

import { useEffect, useRef } from "react"

export default function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight

    const resizeCanvas = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    // 像素网格参数
    const gridSize = 30 // 像素大小
    const cols = Math.ceil(width / gridSize)
    const rows = Math.ceil(height / gridSize)
    const pixels = []

    // 颜色参数
    const baseColor = { r: 65, g: 105, b: 225 } // 蓝色基调
    const accentColor = { r: 147, g: 112, b: 219 } // 紫色点缀

    // 初始化像素网格
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        pixels.push({
          x: x * gridSize,
          y: y * gridSize,
          opacity: Math.random() * 0.2, // 初始透明度
          targetOpacity: Math.random() * 0.2,
          size: gridSize - 2, // 留出1px边距
          color: Math.random() > 0.8 ? accentColor : baseColor, // 80%使用基础色，20%使用强调色
          pulse: 0,
          pulseSpeed: 0.01 + Math.random() * 0.02,
        })
      }
    }

    // 鼠标位置
    let mouseX = -100
    let mouseY = -100
    let isMouseMoving = false
    let mouseTimer

    // 鼠标移动事件
    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      isMouseMoving = true

      // 5秒后重置鼠标移动状态
      clearTimeout(mouseTimer)
      mouseTimer = setTimeout(() => {
        isMouseMoving = false
      }, 5000)
    }

    window.addEventListener("mousemove", handleMouseMove)

    // 动画循环
    const animate = () => {
      // 清除画布，使用渐变背景
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, "#f0f8ff") // 顶部颜色
      gradient.addColorStop(1, "#e6f0ff") // 底部颜色
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // 更新和绘制像素
      pixels.forEach((pixel) => {
        // 计算像素与鼠标的距离
        const dx = pixel.x + pixel.size / 2 - mouseX
        const dy = pixel.y + pixel.size / 2 - mouseY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 150 // 鼠标影响的最大距离

        // 更新像素脉动
        pixel.pulse += pixel.pulseSpeed
        if (pixel.pulse > Math.PI * 2) {
          pixel.pulse = 0
        }

        // 更新目标透明度
        if (Math.random() < 0.01) {
          pixel.targetOpacity = Math.random() * 0.2
        }

        // 平滑过渡到目标透明度
        pixel.opacity += (pixel.targetOpacity - pixel.opacity) * 0.05

        // 如果鼠标靠近，增加亮度
        let finalOpacity = pixel.opacity
        if (isMouseMoving && distance < maxDistance) {
          const influence = 1 - distance / maxDistance
          finalOpacity += influence * 0.3 // 增加透明度，使其更亮
        }

        // 添加脉动效果
        finalOpacity += Math.sin(pixel.pulse) * 0.03

        // 绘制像素
        const { r, g, b } = pixel.color
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalOpacity})`
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size)
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(mouseTimer)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" aria-hidden="true" />
  )
}
