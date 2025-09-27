import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Plus, UserPlus } from "lucide-react";
import SecretsList from "../components/SecretsList";
import FriendsList from "../components/FriendsList";
import CreateSecretForm from "../components/CreateSecretForm";
import { useWallet } from "../hooks/useWallet";
const API_BASE_URL = "http://localhost:3000";
const Home = () => {
  // Wallet connection
  const { account, isConnected } = useWallet();
  const [showCreateSecretForm, setShowCreateSecretForm] = useState(false);

  // Secrets state management
  const [secrets, setSecrets] = useState([
    {
      id: 1,
      title: "Bank Account Details",
      description: "Main checking account information",
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "Social Media Passwords",
      description: "Instagram, Twitter, LinkedIn credentials",
      date: "2024-01-10",
    },
    {
      id: 3,
      title: "Investment Portfolio",
      description: "Stock holdings and crypto wallets",
      date: "2024-01-05",
    },
    {
      id: 4,
      title: "Legal Documents",
      description: "Will, power of attorney, and contracts",
      date: "2024-01-03",
    },
    {
      id: 5,
      title: "Personal Security Codes",
      description: "Safe combinations and security system codes",
      date: "2024-01-01",
    },
  ]);

  const handleAddSecret = (newSecret) => {
    setSecrets((prevSecrets) => [...prevSecrets, newSecret]);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Action Buttons */}
        <div className="flex gap-4 mb-8">
          {showCreateSecretForm && (
            <CreateSecretForm
              setShowCreateSecretForm={setShowCreateSecretForm}
              showCreateSecretForm={showCreateSecretForm}
              onAddSecret={handleAddSecret}
            />
          )}
          <Button
            onClick={() => setShowCreateSecretForm(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Secret
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Your Secrets Section */}
          <SecretsList secrets={secrets} />

          {/* Divider */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="h-full w-px bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"></div>
          </div>

          {/* Friends List Section */}
          <FriendsList isConnected={isConnected} account={account} />
        </div>
      </div>
    </div>
  );
};

export default Home;
