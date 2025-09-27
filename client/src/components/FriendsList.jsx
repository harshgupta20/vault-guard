import React from 'react'
import AddFriendForm from './AddFriendForm'

const FriendsList = ({ friends = [], onAddFriend }) => {
  return (
    <div className="flex-1 lg:w-1/3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-card-foreground">Friends List</h2>
        <AddFriendForm onAddFriend={onAddFriend} />
      </div>
      <div className="space-y-3">
        {friends.length ? friends.map((friend) => (
          <div key={friend.id} className="bg-background border border-border rounded-md p-4 hover:p-6 transition-all duration-300 ease-in-out">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${friend.avatarColor || 'from-blue-400 to-purple-500'} flex items-center justify-center text-white font-semibold text-sm`}>
                {friend.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{friend.name}</h4>
                <p className="text-sm text-muted-foreground">{friend.email}</p>
              </div>
            </div>
          </div>
        )) : <div className="text-muted-foreground">There's no way you can have no friends 💖</div>}
      </div>
    </div>
  )
}

export default FriendsList
