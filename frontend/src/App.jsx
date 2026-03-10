import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './components/pages/Dashboard'
import Documents from './components/pages/Documents'
import DraftGenerator from './components/pages/DraftGenerator'
import AiChat from './components/pages/AiChat'
import Constituency from './components/pages/Constituency'
import MeetingNotes from './components/pages/MeetingNotes'
import Scheduler from './components/pages/Scheduler'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"    element={<Dashboard />} />
        <Route path="documents"    element={<Documents />} />
        <Route path="draft"        element={<DraftGenerator />} />
        <Route path="chat"         element={<AiChat />} />
        <Route path="constituency" element={<Constituency />} />
        <Route path="meeting"      element={<MeetingNotes />} />
        <Route path="scheduler"    element={<Scheduler />} />
      </Route>
    </Routes>
  )
}
