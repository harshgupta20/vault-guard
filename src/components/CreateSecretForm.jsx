import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Plus, FileText, Upload, Image, Users, X } from 'lucide-react'

const CreateSecretForm = ({ friends = [], onAddSecret }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    thumbnailImage: null,
    documentFile: null,
    selectedFriends: []
  })
  const [errors, setErrors] = useState({})
  const [imagePreview, setImagePreview] = useState(null)

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Secret name is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    if (!formData.thumbnailImage) {
      newErrors.thumbnailImage = 'Thumbnail image is required'
    }
    
    if (!formData.documentFile) {
      newErrors.documentFile = 'Document file is required'
    }
    
    if (formData.selectedFriends.length === 0) {
      newErrors.selectedFriends = 'Please select at least one friend'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      const newSecret = {
        id: Date.now(),
        title: formData.name.trim(),
        description: formData.description.trim(),
        date: new Date().toISOString().split('T')[0],
        thumbnailImage: formData.thumbnailImage,
        documentFile: formData.documentFile,
        sharedWith: formData.selectedFriends
      }
      
      onAddSecret(newSecret)
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        thumbnailImage: null,
        documentFile: null,
        selectedFriends: []
      })
      setErrors({})
      setImagePreview(null)
      setIsOpen(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, thumbnailImage: file }))
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
      
      if (errors.thumbnailImage) {
        setErrors(prev => ({ ...prev, thumbnailImage: '' }))
      }
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, documentFile: file }))
      if (errors.documentFile) {
        setErrors(prev => ({ ...prev, documentFile: '' }))
      }
    }
  }

  const handleFriendSelect = (friendId) => {
    const friend = friends.find(f => f.id === parseInt(friendId))
    if (friend && formData.selectedFriends.length < 3 && !formData.selectedFriends.find(f => f.id === friend.id)) {
      setFormData(prev => ({
        ...prev,
        selectedFriends: [...prev.selectedFriends, friend]
      }))
      if (errors.selectedFriends) {
        setErrors(prev => ({ ...prev, selectedFriends: '' }))
      }
    }
  }

  const removeFriend = (friendId) => {
    setFormData(prev => ({
      ...prev,
      selectedFriends: prev.selectedFriends.filter(f => f.id !== friendId)
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">
          <Plus className="h-4 w-4 mr-2" />
          Create New Secret
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create New Secret
          </DialogTitle>
          <DialogDescription>
            Create a new secret document and share it with your trusted friends.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-4">
            {/* Secret Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Name of the Secret
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter secret name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Describe what this secret contains..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Thumbnail Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Image className="h-4 w-4" />
                Thumbnail Image
              </label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={`${errors.thumbnailImage ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null)
                        setFormData(prev => ({ ...prev, thumbnailImage: null }))
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
              {errors.thumbnailImage && (
                <p className="text-sm text-red-500">{errors.thumbnailImage}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Upload an image to use as thumbnail on the dashboard
              </p>
            </div>

            {/* Document File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload File
              </label>
              <Input
                type="file"
                onChange={handleFileUpload}
                className={`${errors.documentFile ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {formData.documentFile && (
                <p className="text-sm text-green-600 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {formData.documentFile.name}
                </p>
              )}
              {errors.documentFile && (
                <p className="text-sm text-red-500">{errors.documentFile}</p>
              )}
            </div>

            {/* Friends Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Share with Friends (Max 3)
              </label>
              
              {/* Selected Friends Display */}
              {formData.selectedFriends.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.selectedFriends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      <span>{friend.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFriend(friend.id)}
                        className="hover:bg-primary/20 rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Friends Dropdown */}
              {formData.selectedFriends.length < 3 && (
                <Select onValueChange={handleFriendSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select friends to share with..." />
                  </SelectTrigger>
                  <SelectContent>
                    {friends
                      .filter(friend => !formData.selectedFriends.find(f => f.id === friend.id))
                      .map((friend) => (
                        <SelectItem key={friend.id} value={friend.id.toString()}>
                          {friend.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
              
              {errors.selectedFriends && (
                <p className="text-sm text-red-500">{errors.selectedFriends}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Select up to 3 friends to share this secret with
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
            >
              <FileText className="h-4 w-4 mr-2" />
              Create Secret
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateSecretForm
