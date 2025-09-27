import React from "react";
import { Button } from "../components/ui/button";
import { Wallet } from "lucide-react";
import { useWallet } from "../hooks/useWallet";

const Home = () => {
  const {
    account,
    isConnected,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    isMetaMaskInstalled,
  } = useWallet();

  const handleConnectWallet = async () => {
    if (!isMetaMaskInstalled) {
      alert("MetaMask is not installed. Please install MetaMask to continue.");
      return;
    }
    await connectWallet();
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section: Meet VaultGuard */}
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-8 py-16">
        <div className="max-w-7xl w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Section: Logo and Content */}
            <div className="flex-1 flex flex-col lg:flex-row items-center gap-8">
              {/* Logo Section */}
              <div className="flex-shrink-0">
                <img
                  src="/vaultguard.png"
                  alt="VaultGuard Logo"
                  width={400}
                  height={400}
                  className="w-80 h-80 lg:w-96 lg:h-96"
                />
              </div>

              {/* Content Section */}
              <div className="flex-1 max-w-2xl">
                <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                  Meet VaultGuard
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed mb-8">
                  Store your final wishes and distribute access using up to 3
                  private keys. Add friends as nominees, split the keys, and
                  ensure only the right combination can claim their share safely
                  and privately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works Section */}
      <div className="max-w-6xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How it works
          </h2>
          <p className="text-xl text-muted-foreground">
            Four simple steps from will creation to inheritance claim.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Step 1: Create Will */}
          <div className="bg-card p-8 rounded-lg border border-border">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-primary-foreground"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Create Will
              </h3>
            </div>
            <p className="text-muted-foreground">
              Connect wallet and set your will details securely in the vault.
            </p>
          </div>

          {/* Step 2: Add Friends */}
          <div className="bg-card p-8 rounded-lg border border-border">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-primary-foreground"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Add Friends
              </h3>
            </div>
            <p className="text-muted-foreground">
              Add up to 3 nominees and assign how the inheritance should be
              split.
            </p>
          </div>

          {/* Step 3: Distribute Keys */}
          <div className="bg-card p-8 rounded-lg border border-border">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-primary-foreground"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Distribute Keys
              </h3>
            </div>
            <p className="text-muted-foreground">
              We generate and split the secret across up to 3 keys tied to
              nominees.
            </p>
          </div>

          {/* Step 4: Claim Inheritance */}
          <div className="bg-card p-8 rounded-lg border border-border">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-primary-foreground"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  <path d="M8 12a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Claim Inheritance
              </h3>
            </div>
            <p className="text-muted-foreground">
              When conditions are met, nominees combine their keys to unlock and
              claim.
            </p>
          </div>
        </div>
      </div>

      {/* Thumbs Up GIF Section */}
      <div className="max-w-6xl mx-auto px-8 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          <div className="text-center lg:text-left mb-[150px] space-x-5">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              So, what are you waiting for?
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Connect your wallet and create your will now.
            </p>

            {/* Connect Wallet Button */}
            {isConnected ? (
              <div className="flex flex-col items-center lg:items-start gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    {formatAddress(account)}
                  </span>
                </div>
                <Button
                  onClick={disconnectWallet}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-3 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-50"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>
          <div className="flex-shrink-0">
            <img
              src="/thumbs-up-nice.gif"
              alt="Thumbs up animation"
              className="w-64 h-64 lg:w-80 lg:h-80"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
