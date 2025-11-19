import './App.css'
import { RouterProvider } from 'react-router'
import { router } from './routes'
import { PrivacyCurtainProvider } from './providers/PrivacyCurtainProvider'

function App() {

  return (
      <PrivacyCurtainProvider>
      <RouterProvider router={router} />
    </PrivacyCurtainProvider>
  )
}

export default App
