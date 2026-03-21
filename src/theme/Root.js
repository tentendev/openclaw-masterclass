import React from 'react'
import CommandPalette from '@site/src/components/CommandPalette'
import ReadingProgress from '@/components/ReadingProgress'

// Docusaurus Root theme component — wraps the entire app.
// Used to inject global-level components like the Command Palette and Reading Progress bar.
export default function Root({ children }) {
  return (
    <>
      <ReadingProgress />
      {children}
      <CommandPalette />
    </>
  )
}
