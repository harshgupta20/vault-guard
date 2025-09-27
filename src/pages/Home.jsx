import React from 'react'
import { Button } from '../components/ui/button'
import { Plus, UserPlus } from 'lucide-react'
import SecretsList from '../components/SecretsList'
import FriendsList from '../components/FriendsList'

const Home = () => {
  // Dummy secrets data
  const dummySecrets = [
    {
      id: 1,
      title: "Bank Account Details",
      description: "Main checking account information",
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "Social Media Passwords",
      description: "Instagram, Twitter, LinkedIn credentials",
      date: "2024-01-10"
    },
    {
      id: 3,
      title: "Investment Portfolio",
      description: "Stock holdings and crypto wallets",
      date: "2024-01-05"
    },
    {
      id: 4,
      title: "Legal Documents",
      description: "Will, power of attorney, and contracts",
      date: "2024-01-03"
    },
    {
      id: 5,
      title: "Personal Security Codes",
      description: "Safe combinations and security system codes",
      date: "2024-01-01"
    }
  ]

  // Dummy friends data
  const dummyFriends = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", avatarColor: "from-blue-400 to-purple-500" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", avatarColor: "from-green-400 to-blue-500" },
    { id: 3, name: "Carol Davis", email: "carol@example.com", avatarColor: "from-pink-400 to-red-500" }
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">
            <Plus className="h-4 w-4 mr-2" />
            Create New Secret
          </Button>
          <Button className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-6 py-3 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">
            <UserPlus className="h-4 w-4 mr-2" />
            Add a Nominee/Will
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Your Secrets Section */}
          <SecretsList secrets={dummySecrets} />

          {/* Divider */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="h-full w-px bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"></div>
          </div>

          {/* Friends List Section */}
          <FriendsList friends={dummyFriends} />
        </div>
      </div>
    </div>
  )
}

export default Home