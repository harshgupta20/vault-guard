import React from 'react'
import { Button } from '../components/ui/button'
import { Plus, UserPlus } from 'lucide-react'

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
    }
  ]

  // Dummy friends data
  const dummyFriends = [
    // { id: 1, name: "Alice Johnson", email: "alice@example.com" },
    // { id: 2, name: "Bob Smith", email: "bob@example.com" },
    // { id: 3, name: "Carol Davis", email: "carol@example.com" }
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Your Secrets Section */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-card-foreground mb-6">Your Secrets</h2>
              <div className="space-y-4">
                {dummySecrets.length ? dummySecrets.map((secret) => (
                  <div key={secret.id} className="bg-background border border-border rounded-md p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{secret.title}</h3>
                      <span className="text-sm text-muted-foreground">{secret.date}</span>
                    </div>
                    <p className="text-muted-foreground">{secret.description}</p>
                  </div>
                )) : <div className="text-muted-foreground">We know you got some secrets 😉</div>}
              </div>
            </div>
          </div>

          {/* Friends List Section */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-card-foreground">Friend List</h2>
                <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-3">
                {dummyFriends.length ? dummyFriends.map((friend) => (
                  <div key={friend.id} className="bg-background border border-border rounded-md p-3 hover:bg-accent/50 transition-colors">
                    <h4 className="font-medium text-foreground">{friend.name}</h4>
                    <p className="text-sm text-muted-foreground">{friend.email}</p>
                  </div>
                )) : <div className="text-muted-foreground">There's no way you can have no friends 💖</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home