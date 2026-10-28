import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import ProblemStatements from './pages/ProblemStatements'

// Same reveal start-state switch as the main page
document.documentElement.classList.add('js')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProblemStatements />
  </React.StrictMode>,
)
