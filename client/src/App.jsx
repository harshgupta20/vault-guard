import React from 'react'
import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Team from './pages/Team'
import ErrorPage from './pages/ErrorPage'
import Navbar from './components/Navbar'
import FriendSecrets from './pages/FriendSecrets'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  return (
    <>
      <div className='h-[100dvh]'>
        <Navbar />

        <div className='pt-20 h-[100dvh] flex flex-col justify-between'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/friends-secret" element={<ProtectedRoute><FriendSecrets /></ProtectedRoute>} />
            <Route path="/team" element={<Team />} />
            <Route path="/*" element={<ErrorPage />} />
          </Routes>

          <Footer />
        </div>
      </div>
    </>
  )
}

export default App