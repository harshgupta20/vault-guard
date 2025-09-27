import React, { useEffect } from 'react'
import { CreditCard, Lock, TrendingUp, FileText, Shield, Key } from 'lucide-react'
import { useWallet } from '../hooks/useWallet';

const SecretsList = () => {
  const { account, isConnected } = useWallet();
  const [wills, setWills] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    async function fetchWills() {
      if (account) {
        try {
          const response = await fetch(`https://eth-global-api.vercel.app/api/wills?owner=${account}`);
          const data = await response.json();
          console.log('Fetched wills:', JSON.stringify(data, null, 2));

          const structuredWills = data.data.wills.map((will, index) => ({
            id: will.id || index,
            expiration: will.deadline?.timestamp || 'Not set',
            nominees: will.nominees || [],
            encryptedData: will.encryptedHash,
          }));

          setWills(structuredWills);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching wills:', error);
          setLoading(false);
        }
      }
    }

    fetchWills();
  }, [account, isConnected]);

  const getWillIcon = () => {
    return <FileText className="h-5 w-5 text-orange-500" />
  }

  const formatCountdown = (timestamp) => {
    if (timestamp === 'Not set') return { text: 'Not set', isExpired: false };
    
    // Convert timestamp to milliseconds if it's in seconds (Unix timestamp)
    // If timestamp is less than a reasonable year (e.g., 2000), it's likely in seconds
    const timestampMs = timestamp < 946684800000 ? timestamp * 1000 : timestamp;
    
    const now = Date.now();
    const timeLeft = timestampMs - now;
    const isExpired = timeLeft < 0;
    const absoluteTime = Math.abs(timeLeft);
    
    console.log('Debug timestamp:', { 
      originalTimestamp: timestamp, 
      timestampMs, 
      now, 
      timeLeft, 
      isExpired,
      readableDate: new Date(timestampMs).toLocaleString()
    });
    
    const days = Math.floor(absoluteTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absoluteTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((absoluteTime % (1000 * 60 * 60)) / (1000 * 60));
    
    let timeString = '';
    if (days > 0) {
      timeString = `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      timeString = `${hours}h ${minutes}m`;
    } else {
      timeString = `${minutes}m`;
    }
    
    return {
      text: isExpired ? `Expired ${timeString} ago` : timeString,
      isExpired
    };
  }

  return (
    <div className="flex-1 lg:w-2/3">
      <h2 className="text-2xl font-bold text-card-foreground mb-6">Your Data</h2>
      <div className="space-y-4">
        {loading && (
          <div className="bg-background border border-border rounded-md p-4">
            <p className="text-muted-foreground">Loading your wills...</p>
          </div>
        )}
        {!loading && wills.length > 0 ? wills.map((will) => (
          <div key={will.id} className="bg-background border border-border rounded-md p-4 hover:p-6 transition-all duration-300 ease-in-out">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getWillIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-foreground truncate">{will.encryptedData}</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    <strong>Expiration In:</strong> 
                    <span 
                      className={`ml-1 ${
                        will.expiration !== 'Not set' && formatCountdown(will.expiration).isExpired 
                          ? 'text-red-500 font-semibold' 
                          : ''
                      }`}
                    >
                      {will.expiration === 'Not set' ? 'Not set' : formatCountdown(will.expiration).text}
                    </span>
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Nominees:</strong> <span className="break-words">{will.nominees.length > 0 ? will.nominees.join(', ') : 'None specified'}</span>
                  </p>
                  <p className="text-muted-foreground text-sm">
                    <strong>Encrypted Data:</strong> {will.encryptedData ? 'Available' : 'Not available'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )) : !loading && (
          <div className="text-muted-foreground">No wills found. Create your first will to get started! 📄</div>
        )}
      </div>
    </div>
  )
}

export default SecretsList
