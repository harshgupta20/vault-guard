import React from "react";
import { Link } from "react-router";
import { Menu, Wallet, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useWallet } from "../hooks/useWallet";

const Navbar = () => {
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
    <nav className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border border-border rounded-lg shadow-transparent shadow-2xl">
      {/* Hamburger Menu */}
      <Sheet className="rounded-sm">
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="top" className="w-[150px] sm:w-[300px]">
          <div className="flex flex-col space-y-4 mt-6">
            <Link
              to="/dashboard"
              className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/friends-secret"
              className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Friends Secret
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      {/* Connect Wallet Button */}
      {isConnected ? (
        <div className="flex items-center gap-3">
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
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleConnectWallet}
          disabled={isConnecting}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-50"
        >
          <Wallet className="h-4 w-4 mr-2" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-20 right-4 z-50 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-3 max-w-sm">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
