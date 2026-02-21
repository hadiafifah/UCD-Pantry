import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import LandingPage from './pages/LandingPage.jsx'
import DetectionPage from './pages/DetectionPage.jsx'
import RecipePage from './pages/RecipePage.jsx'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/detect" element={<DetectionPage />} />
          <Route path="/recipe/:id" element={<RecipePage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
