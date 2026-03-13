import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import T_AppContextProvider from './Context/T_AppContex.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <T_AppContextProvider>
      <App />
    </T_AppContextProvider>
  </BrowserRouter>

)
