import React from 'react'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'

const FriendsList = ({ friends = [] }) => {
  return (
    <div className="flex-1 lg:w-1/3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-card-foreground">Friends List</h2>
        <Button variant="outline" size="sm" className="text-primary border-primary hover:text-primary-foreground">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      <div className="space-y-3">
        {friends.length ? friends.map((friend) => (
          <div key={friend.id} className="bg-background border border-border rounded-md p-4 hover:p-6 transition-all duration-300 ease-in-out">
            <h4 className="font-medium text-foreground">{friend.name}</h4>
            <p className="text-sm text-muted-foreground">{friend.email}</p>
          </div>
        )) : <div className="text-muted-foreground">There's no way you can have no friends 💖</div>}
      </div>
    </div>
  )
}

export default FriendsList
