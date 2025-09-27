import React, { useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Plus, UserPlus } from 'lucide-react'
import SecretsList from '../components/SecretsList'
import FriendsList from '../components/FriendsList'
import { Navigate } from 'react-router'

const Home = () => {

  const navigate = Navigate();

  useEffect(() => {
    navigate('/dashboard')
  }, [])

  return (
    <>
      <div>
        Redirecting...
      </div>
    </>
  )
}

export default Home