import { useState, useEffect } from "react";
import { ethers } from "ethers";

export const useWallet = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return (
      typeof window !== "undefined" &&
      window.ethereum &&
      window.ethereum.isMetaMask
    );
  };

  // Connect to MetaMask wallet
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setError(
        "MetaMask is not installed. Please install MetaMask to continue."
      );
      return false;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setAccount(address);
        setProvider(provider);
        setSigner(signer);
        setIsConnected(true);

        // Store connection state in localStorage
        localStorage.setItem("walletConnected", "true");
        localStorage.setItem("walletAddress", address);

        return true;
      }
    } catch (err) {
      console.error("Error connecting to wallet:", err);
      if (err.code === 4001) {
        setError("User rejected the connection request.");
      } else {
        setError("Failed to connect to wallet. Please try again.");
      }
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setIsConnected(false);
    setError(null);

    // Clear localStorage
    localStorage.removeItem("walletConnected");
    localStorage.removeItem("walletAddress");
  };

  // Get account balance
  const getBalance = async () => {
    if (!provider || !account) return null;

    try {
      const balance = await provider.getBalance(account);
      return ethers.formatEther(balance);
    } catch (err) {
      console.error("Error getting balance:", err);
      return null;
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        // Account changed, reconnect
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      // Reload the page when chain changes
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [account]);

  // Check for existing connection on mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      if (!isMetaMaskInstalled()) return;

      const isConnected = localStorage.getItem("walletConnected") === "true";
      if (isConnected) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });

          if (accounts.length > 0) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            setAccount(address);
            setProvider(provider);
            setSigner(signer);
            setIsConnected(true);
          } else {
            // Clear invalid connection state
            localStorage.removeItem("walletConnected");
            localStorage.removeItem("walletAddress");
          }
        } catch (err) {
          console.error("Error checking existing connection:", err);
          localStorage.removeItem("walletConnected");
          localStorage.removeItem("walletAddress");
        }
      }
    };

    checkExistingConnection();
  }, []);

  return {
    account,
    provider,
    signer,
    isConnected,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    getBalance,
    isMetaMaskInstalled: isMetaMaskInstalled(),
  };
};
