import React, { useEffect } from 'react'
import { CreditCard, Lock, TrendingUp, FileText, Shield, Key } from 'lucide-react'
import { useWallet } from '../hooks/useWallet';

const Wills = () => {

  const {account,isConnected} = useWallet();
  const [wills, setWills] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    console.log(account)
    async function fetchWills() {
      if (account) {
        try {
          const response = await fetch(`https://eth-global-api.vercel.app/api/wills?owner=${account}`);
          const data = await response.json();
          console.log('Fetched wills:', data);
          setWills(data.data.wills);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching wills:', error);
        }
      }
    }

    fetchWills();
  }, [account, isConnected])

  return (
    <div className="bg-primary text-primary-foreground p-4 rounded-md mb-6">
    {loading && (<li>Loading wills...</li>)}
    {wills.length > 0 && (
      <div className="mt-4">
        <h4 className="font-semibold">Your Wills:</h4>
        <ul className="list-disc list-inside">
          <div>
            <pre>
              {JSON.stringify(wills, null, 4)}
            </pre>
            </div>
        </ul>
      </div>
    )}
  </div>
  )
}

const SecretsList = ({ secrets = [] }) => {
  const getSecretIcon = (title) => {
    const titleLower = title.toLowerCase()
    if (titleLower.includes('bank') || titleLower.includes('account') || titleLower.includes('financial')) {
      return <CreditCard className="h-5 w-5 text-blue-500" />
    } else if (titleLower.includes('password') || titleLower.includes('social') || titleLower.includes('media')) {
      return <Lock className="h-5 w-5 text-green-500" />
    } else if (titleLower.includes('investment') || titleLower.includes('portfolio') || titleLower.includes('crypto') || titleLower.includes('stock')) {
      return <TrendingUp className="h-5 w-5 text-purple-500" />
    } else if (titleLower.includes('document') || titleLower.includes('file') || titleLower.includes('legal')) {
      return <FileText className="h-5 w-5 text-orange-500" />
    } else if (titleLower.includes('security') || titleLower.includes('private') || titleLower.includes('personal')) {
      return <Shield className="h-5 w-5 text-red-500" />
    } else {
      return <Key className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="flex-1 lg:w-2/3">
      <h2 className="text-2xl font-bold text-card-foreground mb-6">Your Secrets</h2>
      <div className="space-y-4">
        <div>
          <Wills />
        </div>
        {secrets.length ? secrets.map((secret) => (
          <div key={secret.id} className="bg-background border border-border rounded-md p-4 hover:p-6 transition-all duration-300 ease-in-out">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getSecretIcon(secret.title)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{secret.title}</h3>
                  <span className="text-sm text-muted-foreground">{secret.date}</span>
                </div>
                <p className="text-muted-foreground">{secret.description}</p>
              </div>
            </div>
          </div>
        )) : <div className="text-muted-foreground">We know you got some secrets 😉</div>}
      </div>
    </div>
  )
}

export default SecretsList
