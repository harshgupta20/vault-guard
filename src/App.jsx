import React from 'react'
import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Team from './pages/Team'
import ErrorPage from './pages/ErrorPage'
import Navbar from './components/Navbar'
import FriendSecrets from './pages/FriendSecrets'
import Footer from './components/Footer'

const App = () => {
  return (
    <>
      <div className='h-[100dvh]'>
        <div className='h-[10dvh]'>
          <Navbar />
        </div>

        <div className='h-[90dvh] flex flex-col justify-between'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/team" element={<Team />} />
            <Route path="/friends-secret" element={<FriendSecrets />} />
            <Route path="/*" element={<ErrorPage />} />
          </Routes>

          <Footer />
        </div>
      </div>
    </>
  )
}

export default App