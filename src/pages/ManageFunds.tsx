import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, WalletIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FundsForm } from '@/components/funds/FundsForm';
import { WithdrawalHistory } from '@/components/funds/WithdrawalHistory';
import { useToast } from '@/components/ui/use-toast';

export default function ManageFunds() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    setLoading(true);
    // TODO: Implement Petra wallet connection
    setTimeout(() => {
      setAccount('0x123...abc');
      setLoading(false);
    }, 1000);
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md backdrop-blur-sm bg-white/10 border-none">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={connectWallet} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <WalletIcon className="mr-2 h-4 w-4" />
                  Connect Wallet
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          ← Back to Dashboard
        </Button>
        
        <FundsForm />
        <WithdrawalHistory />
      </div>
    </div>
  );
}