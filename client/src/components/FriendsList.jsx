import React from 'react'
import AddFriendForm from './AddFriendForm'
import { Loader2, AlertCircle } from 'lucide-react'

const FriendsList = ({ friends = [], onAddFriend, loading = false, error = null, isConnected = false }) => {
  return (
    <div className="flex-1 lg:w-1/3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-card-foreground">Friends List</h2>
        <AddFriendForm onAddFriend={onAddFriend} disabled={!isConnected} />
      </div>
      
      {/* Error State */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Error loading friends</span>
          </div>
          <p className="text-sm text-red-500 dark:text-red-400 mt-1">{error}</p>
        </div>
      )}
      
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading friends...</span>
        </div>
      )}
      
      {/* Not Connected State */}
      {!isConnected && !loading && (
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-2">Connect your wallet to view friends</div>
          <p className="text-sm text-muted-foreground">Your friends list will appear here once you connect your wallet.</p>
        </div>
      )}
      
      {/* Friends List */}
      {!loading && isConnected && (
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
                  {friend.walletAddress && (
                    <p className="text-xs text-muted-foreground font-mono">
                      {friend.walletAddress.slice(0, 6)}...{friend.walletAddress.slice(-4)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-8">
              <div className="text-muted-foreground">No friends yet</div>
              <p className="text-sm text-muted-foreground mt-1">Add your first friend to get started!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FriendsList
