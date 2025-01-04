'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ApiKeysContextType {
  openrouterKey: string
  falKey: string
  setOpenrouterKey: (key: string) => void
  setFalKey: (key: string) => void
}

const ApiKeysContext = createContext<ApiKeysContextType | undefined>(undefined)

export function ApiKeysProvider({ children }: { children: ReactNode }) {
  const [openrouterKey, setOpenrouterKey] = useState('')
  const [falKey, setFalKey] = useState('')

  return (
    <ApiKeysContext.Provider value={{
      openrouterKey,
      falKey,
      setOpenrouterKey,
      setFalKey
    }}>
      {children}
    </ApiKeysContext.Provider>
  )
}

export function useApiKeys() {
  const context = useContext(ApiKeysContext)
  if (context === undefined) {
    throw new Error('useApiKeys must be used within a ApiKeysProvider')
  }
  return context
}
