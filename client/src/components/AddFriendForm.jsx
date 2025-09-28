import React, { useState } from "react";
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
import { Plus, UserPlus, Mail, Wallet, Loader2 } from "lucide-react";
import { ethers } from "ethers";

const API_BASE_URL = "http://localhost:3000";
const AddFriendForm = ({
  onAddFriend,
  setShowAddFriendForm,
  showAddFriendForm,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    friendName: "",
    friendEmail: "",
    friendWalletAddress: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ensName, setEnsName] = useState("");
  const [isResolvingEns, setIsResolvingEns] = useState(false);

  // ENS Resolution function using ethers.js
  const resolveEnsName = async () => {
    if (!ensName.trim()) return;
    
    setIsResolvingEns(true);
    try {
      // Check if we have access to a provider (MetaMask, etc.)
      let provider;
      
      if (window.ethereum) {
        // Use MetaMask provider
        provider = new ethers.BrowserProvider(window.ethereum);
      } else {
        // Fallback to a public provider for Sepolia
        provider = new ethers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
      }

      console.log('Resolving ENS name:', ensName.trim());
      
      // Resolve ENS name to address
      const resolvedAddress = await provider.resolveName(ensName.trim());
      
      if (resolvedAddress) {
        console.log('ENS resolved to address:', resolvedAddress);
        handleInputChange('walletAddress', resolvedAddress);
        setEnsName(''); // Clear ENS input after successful resolution
      } else {
        throw new Error('ENS name not found or no address set');
      }
    } catch (error) {
      console.error('ENS resolution error:', error);
      setErrors(prev => ({ ...prev, ensName: error.message }));
    } finally {
      setIsResolvingEns(false);
    }
  };
  const addFriend = async (friendData) => {
    setLoading(true);
    setError(null);

    try {
      // Transform data to match server expectations
      const serverData = {
        publicAddress: localStorage.getItem("walletAddress"),
        friendName: friendData.name,
        friendEmail: friendData.email,
        friendWalletAddress: friendData.walletAddress,
      };

      const response = await fetch(`${API_BASE_URL}/friends`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serverData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add friend");
      }

      const data = await response.json();

      if (data.success && data.data) {
        const newFriend = {
          id: data.data.id,
          name: data.data.friendName,
          email: data.data.friendEmail,
          publicAddress: data.data.publicAddress,
          walletAddress: data.data.friendWalletAddress,
          addedAt: data.data.createdAt,
          avatarColor: useFriendsAPI().generateAvatarColor(
            data.data.friendName
          ),
        };

        setFriends((prevFriends) => [...prevFriends, newFriend]);
        setFormData({
          friendName: "",
          friendEmail: "",
          friendWalletAddress: "",
        });
        setErrors({});
        setShowAddFriendForm(false);
        return { success: true, data: newFriend };
      }
    } catch (err) {
      console.error("Error adding friend:", err);
      setError(err.message);
      setShowAddFriendForm(false);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.walletAddress.trim()) {
      newErrors.walletAddress = "Wallet address or ENS name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const friendData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        walletAddress: formData.walletAddress.trim(),
      };

      const response = await onAddFriend(friendData);
      console.log("harsh 1", response);
      if (response?.success) {
        // Reset form on success
        setFormData({
          friendName: "",
          friendEmail: "",
          friendWalletAddress: "",
        });
        setErrors({});
        setShowAddFriendForm(false);
      } else {
        setSubmitError(response?.message || "Failed to add friend");
      }
    } catch (error) {
      setSubmitError(error.message || "Failed to add friend");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={showAddFriendForm} onOpenChange={setShowAddFriendForm}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Friend
          </DialogTitle>
          <DialogDescription>
            Add a new friend to your trusted circle. They'll be able to access
            your shared secrets.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="space-y-6 mt-6"
        >
          {/* Submit Error */}
          {submitError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">
                {submitError}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter friend's full name"
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

            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="friend@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={
                  errors.email
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* ENS Resolution Field */}
            <div className="space-y-2">
              <label
                htmlFor="ensName"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Wallet className="h-4 w-4" />
                ENS Name (Optional)
              </label>
              <div className="flex gap-2">
                <Input
                  id="ensName"
                  type="text"
                  placeholder="friend.eth"
                  value={ensName}
                  onChange={(e) => {
                    setEnsName(e.target.value);
                    // Clear ENS error when user types
                    if (errors.ensName) {
                      setErrors(prev => ({ ...prev, ensName: "" }));
                    }
                  }}
                  className={
                    errors.ensName
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />
                <Button
                  type="button"
                  onClick={resolveEnsName}
                  disabled={!ensName.trim() || isResolvingEns}
                  className="px-4"
                >
                  {isResolvingEns ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Resolve"
                  )}
                </Button>
              </div>
              {errors.ensName && (
                <p className="text-sm text-red-500">{errors.ensName}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Enter an ENS name and click "Resolve" to auto-fill the wallet address
              </p>
            </div>

            {/* Wallet Address Field */}
            <div className="space-y-2">
              <label
                htmlFor="walletAddress"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Wallet className="h-4 w-4" />
                Wallet Address
              </label>
              <Input
                id="walletAddress"
                type="text"
                placeholder="0x..."
                value={formData.walletAddress}
                onChange={(e) =>
                  handleInputChange("walletAddress", e.target.value)
                }
                className={
                  errors.walletAddress
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {errors.walletAddress && (
                <p className="text-sm text-red-500">{errors.walletAddress}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Enter the wallet address directly or use ENS resolution above
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddFriendForm(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => addFriend(formData)}
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
  );
};

export default AddFriendForm;
