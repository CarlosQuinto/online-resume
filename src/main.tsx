import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './tokens.css'
import Home from './pages/Home'
import { LangProvider } from './i18n/lang'

const Admin = lazy(() => import('./pages/Admin'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <BrowserRouter>
        <Suspense fallback={<main className="grid min-h-screen place-items-center text-fg-muted">Cargando…</main>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </LangProvider>
  </StrictMode>,
)
