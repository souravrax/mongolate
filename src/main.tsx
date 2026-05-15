import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import { VoiceProvider } from './components/voice-provider.tsx'
import { initAnalytics } from './lib/analytics.ts'

initAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <VoiceProvider>
        <App />
      </VoiceProvider>
    </ThemeProvider>
  </StrictMode>,
)
