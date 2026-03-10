import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Layout from './components/layout/Layout'
import Login from './components/pages/Login'
import Dashboard from './components/pages/Dashboard'
import Documents from './components/pages/Documents'
import DraftGenerator from './components/pages/DraftGenerator'
import AiChat from './components/pages/AiChat'
import Constituency from './components/pages/Constituency'
import MeetingNotes from './components/pages/MeetingNotes'
import Scheduler from './components/pages/Scheduler'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("is_logged_in") === "true"
  )

  const handleLogin = (status) => {
    setIsAuthenticated(status)
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#111827', color: '#fff', border: '1px solid #1d2b45', borderRadius: '12px', padding: '16px' }
      }} />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />} />

        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="documents" element={<Documents />} />
          <Route path="draft" element={<DraftGenerator />} />
          <Route path="chat" element={<AiChat />} />
          <Route path="constituency" element={<Constituency />} />
          <Route path="meeting" element={<MeetingNotes />} />
          <Route path="scheduler" element={<Scheduler />} />
        </Route>
      </Routes>
    </>
  )
}
