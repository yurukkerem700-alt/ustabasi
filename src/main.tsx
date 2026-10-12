import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { installMockApi } from './lib/mock/server'
import './index.css'
import App from './App.tsx'

// Giriş/kayıt ve veritabanı olmadan çalışır: /api istekleri örnek veriyle yanıtlanır.
// Gerçek backend (api/ klasörü + Supabase) hazır olduğunda VITE_USE_REAL_API=1 ile devre dışı bırakılır.
if (import.meta.env.VITE_USE_REAL_API !== '1') installMockApi()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
