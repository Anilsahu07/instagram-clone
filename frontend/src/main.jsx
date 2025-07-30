import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import Maincontext from './context/Maincontext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Maincontext>
    <App/>
  </Maincontext>
  </BrowserRouter>
)
