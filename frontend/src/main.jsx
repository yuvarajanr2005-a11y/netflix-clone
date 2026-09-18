import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import './catalogue.css'
import './dashboard.css'
import './buttons.css'
import './video-nav.css'
import './typography-preview.css'
import './movie-cards.css'
import './navbar-theme.css'

createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>
)
