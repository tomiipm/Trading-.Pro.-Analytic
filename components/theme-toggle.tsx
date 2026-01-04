"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { clientLogger } from "@/lib/logger-client"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle theme change with animation
  const handleThemeChange = (newTheme: string) => {
    clientLogger.debug("Theme changed", { theme: newTheme })

    // Set animating state
    setIsAnimating(true)

    // Change theme
    setTheme(newTheme)

    // Force immediate theme change in DOM
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Save to localStorage directly as well
    localStorage.setItem("theme", newTheme)

    // Reset animation state after transition completes
    setTimeout(() => {
      setIsAnimating(false)
    }, 500) // Match this with the CSS transition duration
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
        {theme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`h-8 w-8 transition-all duration-500 ${isAnimating ? "animate-pulse" : ""}`}
          disabled={isAnimating}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleThemeChange("light")}
          className="transition-colors duration-300 hover:bg-slate-100"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange("dark")}
          className="transition-colors duration-300 hover:bg-slate-100"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange("system")}
          className="transition-colors duration-300 hover:bg-slate-100"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
