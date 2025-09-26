import React from 'react'
import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Team from './pages/Team'
import ErrorPage from './pages/ErrorPage'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import FriendSecrets from './pages/FriendSecrets'
import Footer from './components/Footer'

const App = () => {
  return (
    <>
      <div className='h-[100dvh]'>
        <div className='h-[10dvh]'>
          <Navbar />
        </div>

        <div className='flex h-[90dvh]'>

          <div className='w-1/6 h-full'>
            <Sidebar />
          </div>

          <div className='w-5/6 h-full flex flex-col justify-between'>
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
      </div>
    </>
  )
}

export default App