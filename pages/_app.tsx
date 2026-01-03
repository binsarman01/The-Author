import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { createContext, useState } from 'react'

export const AppContext = createContext({})

export default function App({ Component, pageProps }: AppProps) {
  const [state, setState] = useState({})
  return (
    <AppContext.Provider value={{ state, setState }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  )
}
