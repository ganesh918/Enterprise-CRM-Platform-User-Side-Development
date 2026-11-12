import './app/clientBootstrap.js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './app/store'
import App from './App.jsx'
import './index.css'
import { APP_NAME, APP_VARIANT_LABEL } from './config/app.js'
import { RootErrorBoundary } from './components/routing/RootErrorBoundary.jsx'

document.title = `${APP_NAME} — ${APP_VARIANT_LABEL}`

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element #root not found')
}

createRoot(root).render(
  <StrictMode>
    <RootErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </RootErrorBoundary>
  </StrictMode>,
)
