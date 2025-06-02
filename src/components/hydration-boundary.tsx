"use client"

import { useEffect, useState } from 'react'

export default function HydrationBoundary({
  children
}: {
  children: React.ReactNode
}) {
  // Add client-side only state to prevent hydration mismatch from browser extensions
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return <>{children}</>
}
