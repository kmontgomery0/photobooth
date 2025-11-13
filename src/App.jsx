import { useState } from 'react'
import CameraCapture from './components/CameraCapture'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>PHOTOBOOTH</h1>
        <p>Capture your moments</p>
      </header>
      <main className="app-main">
        <CameraCapture />
      </main>
    </div>
  )
}

export default App
