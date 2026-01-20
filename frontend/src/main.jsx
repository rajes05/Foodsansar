import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  {/* BrowserRouter to enable routing in the app */}
   <Provider store={store}> 
    {/* provider from react-redux to connect redux with react */}

    <App />

   </Provider>

  </BrowserRouter>
  
)
