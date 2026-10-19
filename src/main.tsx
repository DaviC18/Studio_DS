import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App, { type Page } from './App.tsx'
import { syncThemeColor } from './lib/theme-color'

const root = document.getElementById('root')!
const page = (root.dataset.page ?? 'catalog') as Page

syncThemeColor()

// Build: o HTML vem pré-renderizado (scripts/prerender.mjs) e é hidratado.
// Dev: o #root chega vazio e o React renderiza do zero.
if (root.hasChildNodes()) hydrateRoot(root, <App page={page} />)
else createRoot(root).render(<App page={page} />)
