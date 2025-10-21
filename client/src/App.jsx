import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { Editor } from './pages/Editor.jsx'
import { Home } from './pages/Home.jsx'
import { Login } from './pages/Login.jsx'
import { Post } from './pages/Post.jsx'
import { NotFound } from './pages/NotFound.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:slug" element={<Post />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/editor/:slug" element={<Editor />} />
        </Route>
      </Route>
      <Route element={<Layout withContact={false} />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<Layout withContact={false} />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
