"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

const PHOTOS = [
  "/myphoto1.jpg",
  "/myphoto2.jpg",
  "/myphoto3.png",
  // "/myphoto4.png",
  // "/greengradient.png",
  // "/greenbgpic.png",
  // "/greybgpic.png",
]

export function GlassmorphismPhotoCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  const [currentIndex, setCurrentIndex] = useState(0)

  /* ------------------ AUTO ROTATE PHOTOS ------------------ */
  useEffect(() => {
    // const interval = setInterval(() => {
    //   setCurrentIndex((prev) => (prev + 1) % PHOTOS.length)
    // }, 3000) // change image every 3s

    // return () => clearInterval(interval)
    setCurrentIndex(Math.floor(Math.random() * 10) % PHOTOS.length)
  }, [])

  /* ------------------ CANVAS ANIMATION ------------------ */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 300
    canvas.height = 400

    const bubbles = Array.from({ length: 8 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 20 + 10,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.3 + 0.1,
    }))

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      bubbles.forEach((b) => {
        b.x += b.dx
        b.y += b.dy

        if (b.x <= b.radius || b.x >= canvas.width - b.radius) b.dx *= -1
        if (b.y <= b.radius || b.y >= canvas.height - b.radius) b.dy *= -1

        const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius)

        if (theme === "dark") {
          gradient.addColorStop(0, `rgba(147,197,253,${b.opacity})`)
          gradient.addColorStop(1, `rgba(59,130,246,${b.opacity * 0.3})`)
        } else {
          gradient.addColorStop(0, `rgba(59,130,246,${b.opacity})`)
          gradient.addColorStop(1, `rgba(147,197,253,${b.opacity * 0.3})`)
        }

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationId)
  }, [theme])

  return (
    <div className="relative w-72 h-96 rounded-2xl overflow-hidden group">
      {/* Glass background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 dark:from-white/5 dark:to-white/2 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl" />

      {/* Canvas bubbles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full rounded-2xl"
        style={{ mixBlendMode: theme === "dark" ? "screen" : "multiply" }}
      />

      {/* PHOTO SLIDER TODO : Add animation that it smooth change  */}
      <div className="absolute inset-4 rounded-xl overflow-hidden">
        {PHOTOS.map((src, index) => (
          <img
            key={src}
            src={src}
            alt="Suraj Bhanarkar"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out
              ${index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"}
            `}
          />
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl" />
    </div>
  )
}
