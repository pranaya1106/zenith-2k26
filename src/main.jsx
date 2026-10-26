import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

// Enables the reveal start-state only when JS is available.
document.documentElement.classList.add('js')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
