import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Plus, UserPlus, Mail, Wallet, Loader2 } from 'lucide-react'

const AddFriendForm = ({ onAddFriend, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    walletAddress: ''
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.walletAddress.trim()) {
      newErrors.walletAddress = 'Wallet address or ENS name is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    setSubmitError('')
    
    try {
      const friendData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        walletAddress: formData.walletAddress.trim()
      }
      
      await onAddFriend(friendData)
      
      // Reset form on success
      setFormData({ name: '', email: '', walletAddress: '' })
      setErrors({})
      setIsOpen(false)
    } catch (error) {
      setSubmitError(error.message || 'Failed to add friend')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-primary border-primary hover:text-primary-foreground"
          disabled={disabled}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Friend
          </DialogTitle>
          <DialogDescription>
            Add a new friend to your trusted circle. They'll be able to access your shared secrets.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Submit Error */}
          {submitError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
            </div>
          )}
          
          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter friend's full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="friend@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Wallet Address Field */}
            <div className="space-y-2">
              <label htmlFor="walletAddress" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Wallet Address or ENS Name
              </label>
              <Input
                id="walletAddress"
                type="text"
                placeholder="0x... or friend.eth"
                value={formData.walletAddress}
                onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                className={errors.walletAddress ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.walletAddress && (
                <p className="text-sm text-red-500">{errors.walletAddress}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Enter either a wallet address (0x...) or an ENS name (name.eth)
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Friend
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddFriendForm
