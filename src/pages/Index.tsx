import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Wallet, TrendingUp, History } from 'lucide-react';
import confetti from 'canvas-confetti';

// Mock data - Replace with actual contract integration later
const MOCK_INVESTOR_DETAILS = {
  totalInvested: 750,
  rewardTokens: 50,
  lastDeposit: Date.now(),
  badgeLevel: 2 // 0: Bronze, 1: Silver, 2: Gold, 3: Diamond
};

export default function EnhancedFundTracker() {
  const [account, setAccount] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [investorDetails, setInvestorDetails] = useState(MOCK_INVESTOR_DETAILS);

  const BadgeCard = ({ level, amount }: { level: string; amount: number }) => {
    const getBadgeStyle = () => {
      switch (level) {
        case 'Diamond':
          return 'bg-gradient-to-r from-blue-400 to-purple-500';
        case 'Gold':
          return 'bg-gradient-to-r from-yellow-400 to-orange-500';
        case 'Silver':
          return 'bg-gradient-to-r from-gray-400 to-gray-500';
        default:
          return 'bg-gradient-to-r from-gray-300 to-gray-400';
      }
    };

    return (
      <Card className="w-full backdrop-blur-sm bg-white/10 border-none shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge className={`${getBadgeStyle()} text-white px-4 py-1`}>
              {level}
            </Badge>
            <span className="text-xl">Investor Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Investment</span>
              <span className="text-2xl font-bold">{amount} APT</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Reward Tokens</span>
              <span className="text-lg">{investorDetails.rewardTokens} RT</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Last Deposit</span>
              <span className="text-sm">
                {new Date(investorDetails.lastDeposit).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const handleSuccess = () => {
    setShowAlert(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => setShowAlert(false), 5000);
  };

  const connectWallet = async () => {
    setLoading(true);
    // TODO: Implement actual wallet connection
    setTimeout(() => {
      setAccount('0x123...abc');
      setLoading(false);
    }, 1000);
  };

  const deposit = async () => {
    if (!depositAmount) return;
    
    setLoading(true);
    // TODO: Implement actual deposit functionality
    setTimeout(() => {
      setInvestorDetails(prev => ({
        ...prev,
        totalInvested: prev.totalInvested + Number(depositAmount),
        lastDeposit: Date.now()
      }));
      handleSuccess();
      setDepositAmount('');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              <Alert className="bg-green-500/20 border-green-500/50">
                <AlertDescription className="text-green-300">
                  Transaction successful! New badge unlocked! 🎉
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="backdrop-blur-sm bg-white/5 border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Fund Tracker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!account ? (
              <Button 
                onClick={connectWallet} 
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
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
            ) : (
              <div className="space-y-6">
                <BadgeCard
                  level={['Bronze', 'Silver', 'Gold', 'Diamond'][investorDetails.badgeLevel]}
                  amount={investorDetails.totalInvested}
                />
                
                <div className="flex gap-4">
                  <Input
                    type="number"
                    placeholder="Amount in APT"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="bg-white/10 border-white/20"
                  />
                  <Button 
                    onClick={deposit} 
                    disabled={loading || !depositAmount}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Depositing...
                      </>
                    ) : (
                      'Deposit'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}