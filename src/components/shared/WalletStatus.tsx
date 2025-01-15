import { useInvestmentStore } from '@/store/investmentStore';
import { Button } from '@/components/ui/button';
import { Wallet, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function WalletStatus() {
  const [loading, setLoading] = useState(false);
  const { walletAddress, setWalletAddress } = useInvestmentStore();

  const connectWallet = async () => {
    setLoading(true);
    // TODO: Integrate with Petra wallet
    setTimeout(() => {
      setWalletAddress('0x123...abc');
      setLoading(false);
    }, 1000);
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
  };

  if (!walletAddress) {
    return (
      <Button 
        onClick={connectWallet} 
        disabled={loading}
        className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </>
        )}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-400">Connected: {walletAddress}</span>
      <Button variant="outline" onClick={disconnectWallet}>
        Disconnect
      </Button>
    </div>
  );
}