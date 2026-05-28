import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { inject } from '@vercel/analytics'
import NotFound from './components/NotFound'

inject()
import '@fontsource/bebas-neue/400.css'
import '@fontsource/dm-sans/300.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/barlow-condensed/800.css'
import './index.css'
import './i18n/index.js'
import App from './App.jsx'

const is404 = window.location.pathname !== '/';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {is404 ? <NotFound /> : <App />}
  </StrictMode>,
)
