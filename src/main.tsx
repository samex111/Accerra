import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {  StudentProvider } from './component/StudentContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <StudentProvider>
      <App />
        </StudentProvider>
  </StrictMode>,
)
