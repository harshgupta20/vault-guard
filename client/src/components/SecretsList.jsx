import React, { useEffect } from "react";
import {
  CreditCard,
  Lock,
  TrendingUp,
  FileText,
  Shield,
  Key,
} from "lucide-react";
import { useWallet } from "../hooks/useWallet";

const SecretsList = () => {
  const { account, signer, isConnected } = useWallet();
  const [wills, setWills] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [pingingWills, setPingingWills] = React.useState(new Set());

  useEffect(() => {
    async function fetchWills() {
      if (account) {
        try {
          const response = await fetch(
            `https://eth-global-api.vercel.app/api/wills?owner=${account}`
          );
          const data = await response.json();
          console.log("Fetched wills:", JSON.stringify(data, null, 2));

          const structuredWills = data.data.wills.map((will, index) => ({
            tokenId: will.tokenId,
            id: will.id || index,
            expiration: will.deadline?.timestamp || "Not set",
            nominees: will.nominees || [],
            encryptedData: will.encryptedHash,
          }));

          setWills(structuredWills);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching wills:", error);
          setLoading(false);
        }
      }
    }

    fetchWills();
  }, [account, isConnected]);

  const getWillIcon = () => {
    return <FileText className="h-5 w-5 text-orange-500" />;
  };

  const formatCountdown = (timestamp) => {
    if (timestamp === "Not set") return { text: "Not set", isExpired: false };

    // Convert timestamp to milliseconds if it's in seconds (Unix timestamp)
    // If timestamp is less than a reasonable year (e.g., 2000), it's likely in seconds
    const timestampMs = timestamp < 946684800000 ? timestamp * 1000 : timestamp;

    const now = Date.now();
    const timeLeft = timestampMs - now;
    const isExpired = timeLeft < 0;
    const absoluteTime = Math.abs(timeLeft);

    console.log("Debug timestamp:", {
      originalTimestamp: timestamp,
      timestampMs,
      now,
      timeLeft,
      isExpired,
      readableDate: new Date(timestampMs).toLocaleString(),
    });

    const days = Math.floor(absoluteTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (absoluteTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((absoluteTime % (1000 * 60 * 60)) / (1000 * 60));

    let timeString = "";
    if (days > 0) {
      timeString = `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      timeString = `${hours}h ${minutes}m`;
    } else {
      timeString = `${minutes}m`;
    }

    return {
      text: isExpired ? `Expired ${timeString} ago` : timeString,
      isExpired,
    };
  };

  const handlePing = async (will) => {
    if (!account || !window.ethereum) {
      alert("Please connect your wallet first");
      return;
    }

    setPingingWills((prev) => new Set([...prev, will.tokenId]));

    try {
      // Prepare the ping transaction
      const response = await fetch(
        "https://eth-global-api.vercel.app/api/ping",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userAddress: account,
            tokenId: will.tokenId,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to prepare ping transaction");
      }

      // Sign and send the transaction using signer (MetaMask approach)
      console.log(
        "🔄 Signing and sending ping transaction...",
        result.data.unsignedTransaction
      );

      if (!signer) {
        throw new Error("No signer available");
      }

      // Use sendTransaction for MetaMask compatibility
      const txResponse = await signer.sendTransaction(
        result.data.unsignedTransaction
      );

      console.log("✅ Ping transaction sent successfully:", txResponse.hash);

      // Wait for confirmation
      console.log("⏳ Waiting for transaction confirmation...");
      const receipt = await txResponse.wait();

      console.log("✅ Ping transaction confirmed:", receipt);

      alert(
        `Ping successful! Transaction: ${txResponse.hash}\nYour will deadline has been extended.`
      );

      // Refresh the wills list after successful ping
      setTimeout(() => {
        window.location.reload(); // Simple refresh - in production you'd want to refetch data
      }, 2000);
    } catch (error) {
      console.error("Error pinging will:", error);

      let errorMessage = "Failed to ping will. ";
      if (error.message.includes("You do not own this will")) {
        errorMessage = "You do not own this will.";
      } else if (error.message.includes("Cannot ping a triggered will")) {
        errorMessage = "Cannot ping a triggered will.";
      } else if (error.message.includes("Cannot ping an executed will")) {
        errorMessage = "Cannot ping an executed will.";
      } else if (error.message.includes("User rejected")) {
        errorMessage = "Transaction was cancelled.";
      } else {
        errorMessage += error.message;
      }

      alert(errorMessage);
    } finally {
      setPingingWills((prev) => {
        const newSet = new Set(prev);
        newSet.delete(will.tokenId);
        return newSet;
      });
    }
  };

  return (
    <div className="flex-1 lg:w-2/3">
      <h2 className="text-2xl font-bold text-card-foreground mb-6">
        Your Data
      </h2>
      <div className="space-y-4">
        {loading && (
          <div className="bg-background border border-border rounded-md p-4">
            <p className="text-muted-foreground">Loading your wills...</p>
          </div>
        )}
        {!loading && wills.length > 0
          ? wills.map((will) => (
              <div
                key={will.id}
                className="bg-background border border-border rounded-md p-4 hover:p-6 transition-all duration-300 ease-in-out"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">{getWillIcon()}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-foreground truncate">
                        {will.encryptedData}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground">
                        <strong>Expiration In:</strong>
                        <span
                          className={`ml-1 ${
                            will.expiration !== "Not set" &&
                            formatCountdown(will.expiration).isExpired
                              ? "text-red-500 font-semibold"
                              : ""
                          }`}
                        >
                          {will.expiration === "Not set"
                            ? "Not set"
                            : formatCountdown(will.expiration).text}
                        </span>
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Nominees:</strong>{" "}
                        <span className="break-words">
                          {will.nominees.length > 0
                            ? will.nominees.join(", ")
                            : "None specified"}
                        </span>
                      </p>
                      <div className="mt-3 pt-2 border-t border-border">
                        <button
                          onClick={() => handlePing(will)}
                          disabled={
                            pingingWills.has(will.tokenId) ||
                            will.expiration === "Not set"
                          }
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            will.expiration === "Not set"
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : pingingWills.has(will.tokenId)
                              ? "bg-blue-300 text-blue-700 cursor-not-allowed"
                              : "bg-blue-500 hover:bg-blue-600 text-white"
                          }`}
                        >
                          {pingingWills.has(will.tokenId)
                            ? "Pinging..."
                            : "Ping Will 📡"}
                        </button>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ping to extend deadline and prove you're alive
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : !loading && (
              <div className="text-muted-foreground">
                No wills found. Create your first will to get started! 📄
              </div>
            )}
      </div>
    </div>
  );
};

export default SecretsList;
