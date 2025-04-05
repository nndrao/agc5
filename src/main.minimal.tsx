/**
 * main.minimal.tsx
 * A completely stripped-down version of the main entry point
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.minimal.tsx'
import './index.css'

// Import AG-Grid styles
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
