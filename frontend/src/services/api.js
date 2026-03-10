import axios from 'axios'
const baseURL = import.meta.env.VITE_API_URL || '/api'
const api = axios.create({ baseURL, timeout: 30000 })

// Auth token
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  me:       ()     => api.get('/auth/me'),
}

// ── Documents ─────────────────────────────────────────────────────────────────
export const docsAPI = {
  upload:    (file) => { const fd = new FormData(); fd.append('file', file); return api.post('/documents/upload', fd) },
  summarize: (data) => api.post('/documents/summarize', data),
  draft:     (data) => api.post('/documents/draft', data),
  translate: (data) => api.post('/documents/translate', data),
  list:      ()     => api.get('/documents/'),
}

// ── Chat ──────────────────────────────────────────────────────────────────────
export const chatAPI = {
  send: (data) => api.post('/chat/message', data),
}

// ── Speech ────────────────────────────────────────────────────────────────────
export const speechAPI = {
  transcribe: (file, language, generateSummary = true) => {
    const fd = new FormData()
    fd.append('file', file)
    if (language) fd.append('language', language)
    fd.append('generate_summary', generateSummary)
    return api.post('/speech/transcribe', fd)
  }
}

// ── Constituency ──────────────────────────────────────────────────────────────
export const constituencyAPI = {
  overview: ()    => api.get('/constituency/overview'),
  wards:    ()    => api.get('/constituency/wards'),
  schemes:  ()    => api.get('/constituency/schemes'),
  query:    (q)   => api.post('/constituency/query', { question: q }),
}

// ── Scheduler ─────────────────────────────────────────────────────────────────
export const schedulerAPI = {
  addEvent:    (data)           => api.post('/scheduler/events', data),
  getEvents:   ()               => api.get('/scheduler/events'),
  deleteEvent: (id)             => api.delete(`/scheduler/events/${id}`),
  addTask:     (data)           => api.post('/scheduler/tasks', data),
  getTasks:    ()               => api.get('/scheduler/tasks'),
  updateTask:  (id, status)     => api.patch(`/scheduler/tasks/${id}?status=${status}`),
}

export default api
