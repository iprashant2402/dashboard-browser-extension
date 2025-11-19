import './App.css'
import { RouterProvider } from 'react-router'
import { router } from './routes'
import { PrivacyCurtainProvider } from './providers/PrivacyCurtainProvider'
import ErrorBoundary from './components/ErrorBoundary'

function App() {

  return (
    <ErrorBoundary fallback={<div>Oops! Something went wrong.</div>}>
      <PrivacyCurtainProvider>
      <RouterProvider router={router} />
    </PrivacyCurtainProvider>
    </ErrorBoundary>
  )
}

export default App
