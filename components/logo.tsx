"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface LogoProps {
  showText?: boolean
  size?: "sm" | "md" | "lg" | number
  href?: string
  className?: string
}

export function Logo({ showText = false, size = "md", href, className = "" }: LogoProps) {
  const [logoSrc, setLogoSrc] = useState("/logo.png")

  // Definiujemy konkretne wartości liczbowe dla rozmiarów
  const getImageSize = () => {
    if (typeof size === "number") {
      return {
        width: size * 3,
        height: size,
      }
    }

    const sizeMap = {
      sm: { width: 160, height: 53 },
      md: { width: 200, height: 66 },
      lg: { width: 260, height: 86 },
    }

    return sizeMap[size] || sizeMap.md
  }

  const imageSize = getImageSize()

  const content = (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center">
        <Image
          src={logoSrc}
          alt="Trading Pro Analytic Logo"
          width={imageSize.width}
          height={imageSize.height}
          priority
          className="h-auto max-h-full object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
          style={{ maxHeight: `${imageSize.height}px` }}
          onError={() => {
            // Fallback to placeholder if logo doesn't exist
            setLogoSrc("/placeholder-logo.png")
          }}
        />
      </div>
      {showText && (
        <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
          TradingPro
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    )
  }

  return content
}
