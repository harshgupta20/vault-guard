import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Plus, FileText, Upload, Image, Users, X } from "lucide-react";
import { useWallet } from "../hooks/useWallet";

const API_BASE_URL = "http://localhost:3000";

// Get transaction from api
async function submitStep1(params) {
  try {
    console.log('🔄 Preparing will transaction...', params);
    
    const response = await fetch(`https://eth-global-api.vercel.app/api/will/prepare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userAddress: params.userAddress,
        nominees: params.nominees,
        deadlineSeconds: params.deadlineSeconds,
        encryptedData: params.encryptedData
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to prepare transaction');
    }

    console.log('✅ Transaction prepared successfully:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Error preparing transaction:', error);
    throw error;
  }
}

// Sign transaction using signer
async function submitStep2(unSignedTx) {
  const { signer } = useWallet();

  try {
    console.log('🔄 Signing will transaction...', unSignedTx);
    if (signer == null) {
      throw new Error('No signer available');
    }

    const tx = await signer.signTransaction(unSignedTx);

    console.log('✅ Transaction signed successfully:', tx);
    return tx;

  } catch (error) {
    console.error('❌ Error signing transaction:', error);
    throw error;
  }
}

// submit signed transaction to api
async function submitStep3(signedTx) {
  try {
    console.log('🔄 Submitting signed will transaction...', signedTx);

    const response = await fetch(`https://eth-global-api.vercel.app/api/will/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        signedTransaction: signedTx,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to submit transaction');
    }

    console.log('✅ Transaction submitted successfully:', data);
    return data;

  } catch (error) {
    console.error('❌ Error submitting transaction:', error);
    throw error;
  }
}



const CreateSecretForm = ({
  showCreateSecretForm,
  setShowCreateSecretForm,
  onAddSecret,
}) => {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const getFriendsList = async () => {
    try {
      console.log("harsh 11");
      setLoading(true);
      const account = localStorage.getItem("walletAddress");
      console.log("harsh 22", account);
      const response = await fetch(`${API_BASE_URL}/friends/${account}`);
      const data = await response.json();
      setFriends(data?.data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    thumbnailImage: null,
    documentFile: null,
    selectedFriends: [],
    interval: "", // NEW FIELD
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Secret name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.thumbnailImage) {
      newErrors.thumbnailImage = "Thumbnail image is required";
    }

    if (!formData.documentFile) {
      newErrors.documentFile = "Document file is required";
    }

    if (formData.selectedFriends.length === 0) {
      newErrors.selectedFriends = "Please select at least one friend";
    }

    if (!formData.interval) {
      newErrors.interval = "Please select an interval";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const newSecret = {
        id: Date.now(),
        title: formData.name.trim(),
        description: formData.description.trim(),
        date: new Date().toISOString().split("T")[0],
        thumbnailImage: formData.thumbnailImage,
        documentFile: formData.documentFile,
        sharedWith: formData.selectedFriends,
        interval: formData.interval, // INCLUDE INTERVAL
      };

      onAddSecret(newSecret);

      // Reset form
      setFormData({
        name: "",
        description: "",
        thumbnailImage: null,
        documentFile: null,
        selectedFriends: [],
        interval: "",
      });
      setErrors({});
      setImagePreview(null);
      setShowCreateSecretForm(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, thumbnailImage: file }));

      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);

      if (errors.thumbnailImage) {
        setErrors((prev) => ({ ...prev, thumbnailImage: "" }));
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, documentFile: file }));
      if (errors.documentFile) {
        setErrors((prev) => ({ ...prev, documentFile: "" }));
      }
    }
  };

  const handleFriendSelect = (friendId) => {
    const friend = friends.find((f) => f.id === parseInt(friendId));
    if (
      friend &&
      formData.selectedFriends.length < 3 &&
      !formData.selectedFriends.find((f) => f.id === friend.id)
    ) {
      setFormData((prev) => ({
        ...prev,
        selectedFriends: [...prev.selectedFriends, friend],
      }));
      if (errors.selectedFriends) {
        setErrors((prev) => ({ ...prev, selectedFriends: "" }));
      }
    }
  };

  const removeFriend = (friendId) => {
    setFormData((prev) => ({
      ...prev,
      selectedFriends: prev.selectedFriends.filter((f) => f.id !== friendId),
    }));
  };

  useEffect(() => {
    getFriendsList();
  }, []);

  return (
    <Dialog open={showCreateSecretForm} onOpenChange={setShowCreateSecretForm}>
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
            {/* Secret Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Name of the Secret
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter secret name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={
                  errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
                }
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-foreground"
              >
                Description
              </label>
              <textarea
                id="description"
                placeholder="Describe what this secret contains..."
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.description
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Thumbnail Upload */}
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
                  className={`${
                    errors.thumbnailImage
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
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
                        setImagePreview(null);
                        setFormData((prev) => ({
                          ...prev,
                          thumbnailImage: null,
                        }));
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

            {/* Document Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload File
              </label>
              <Input
                type="file"
                onChange={handleFileUpload}
                className={`${
                  errors.documentFile
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
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
              {formData.selectedFriends.length < 3 && (
                <Select onValueChange={handleFriendSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select friends to share with..." />
                  </SelectTrigger>
                  <SelectContent>
                    {friends
                      .filter(
                        (friend) =>
                          !formData.selectedFriends.find(
                            (f) =>
                              f.friendWalletAddress ===
                              friend.friendWalletAddress
                          )
                      )
                      .map((friend) => (
                        <SelectItem
                          key={friend.friendWalletAddress}
                          value={friend.friendWalletAddress.toString()}
                        >
                          {friend.friendName}
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

            {/* Interval Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Interval
              </label>
              <Select
                onValueChange={(value) => handleInputChange("interval", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interval..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10s">10 seconds</SelectItem>
                  <SelectItem value="30s">30 seconds</SelectItem>
                  <SelectItem value="1m">1 minute</SelectItem>
                  <SelectItem value="30m">30 minutes</SelectItem>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="1w">1 week</SelectItem>
                  <SelectItem value="1mo">1 month</SelectItem>
                </SelectContent>
              </Select>
              {errors.interval && (
                <p className="text-sm text-red-500">{errors.interval}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Set how frequently this secret should trigger an event or
                action.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateSecretForm(false)}
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
  );
};

export default CreateSecretForm;
