import { useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LogInPage'

import './index.css'
function App() {
  const [count, setCount] = useState(0)
  const path = window.location.pathname

  if (path === "/login") {
    return <LoginPage />
  }

  return (
    <>
      <HomePage />
      

    </>
  )
}

export default App
