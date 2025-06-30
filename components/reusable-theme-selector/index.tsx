'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'

import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Moon, Sun } from 'lucide-react'
import themes from './registry.json'

export interface Theme {
  name: string
  label: string
  colors: {
    light: Record<string, string>
    dark: Record<string, string>
  }
}

interface ReusableThemeSelectorProps {
  onThemeSelect?: (theme: Theme) => void
}

export const ReusableThemeSelector: React.FC<ReusableThemeSelectorProps> = ({
  onThemeSelect,
}) => {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeChange = (themeName: string) => {
    const selectedTheme = themes.find(
      (theme) => theme.name === themeName
    )
    if (selectedTheme) {
      const themeColors =
        resolvedTheme === 'dark'
          ? selectedTheme.colors.dark
          : selectedTheme.colors.light

      const root = document.documentElement
      Object.entries(themeColors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value)
      })

      if (onThemeSelect) {
        onThemeSelect(selectedTheme)
      }
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.name}
            onClick={() => handleThemeChange(theme.name)}
          >
            {theme.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 