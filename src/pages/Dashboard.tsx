import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Mock data with undeployed funds
const MOCK_INVESTOR_DETAILS = {
  totalInvested: 75000,
  currentValue: 82500,
  rewardTokens: 500,
  lastDeposit: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
  badgeLevel: 2, // 0: Bronze, 1: Silver, 2: Gold, 3: Diamond
  investments: {
    undeployed: { amount: 0, currentValue: 0, change: 0 },
    crypto: { amount: 25000, currentValue: 28000, change: 12 },
    stocks: { amount: 30000, currentValue: 31500, change: 5 },
    realEstate: { amount: 20000, currentValue: 23000, change: 15 },
  },
  history: Array.from({ length: 6 }, (_, i) => ({
    month: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'short' }),
    value: 75000 + Math.random() * 10000,
  })),
  transactions: [],
};

export default function Dashboard() {
  const [account, setAccount] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [investorDetails, setInvestorDetails] = useState(MOCK_INVESTOR_DETAILS);

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
    
    // Mock deposit logic
    const amount = parseFloat(depositAmount);
    const newTransaction = {
      type: 'Deposit',
      amount,
      timestamp: new Date().toISOString(),
      status: 'Completed'
    };

    setInvestorDetails(prev => ({
      ...prev,
      totalInvested: prev.totalInvested + amount,
      currentValue: prev.currentValue + amount,
      investments: {
        ...prev.investments,
        undeployed: {
          ...prev.investments.undeployed,
          amount: prev.investments.undeployed.amount + amount,
          currentValue: prev.investments.undeployed.currentValue + amount,
          change: 0
        }
      },
      history: [
        ...prev.history,
        {
          month: new Date().toLocaleString('default', { month: 'short' }),
          value: prev.currentValue + amount
        }
      ],
      transactions: [newTransaction, ...prev.transactions]
    }));

    setTimeout(() => {
      handleSuccess();
      setDepositAmount('');
      setLoading(false);
    }, 1500);
  };

  const totalChange = ((investorDetails.currentValue - investorDetails.totalInvested) / investorDetails.totalInvested) * 100;

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
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
                  <Wallet className="mr-2 h-4 w-4" />
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              <Alert className="bg-green-500/20 border-green-500/50">
                <AlertDescription className="text-green-300">
                  Transaction successful! 🎉
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overview Card */}
        <Card className="backdrop-blur-sm bg-white/10 border-none">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">
                  Gold Investor
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {totalChange >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-400" />
                )}
                <span className={totalChange >= 0 ? "text-green-400" : "text-red-400"}>
                  {totalChange.toFixed(2)}%
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Total Invested</p>
                <p className="text-2xl font-bold">${investorDetails.totalInvested.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Current Value</p>
                <p className="text-2xl font-bold">${investorDetails.currentValue.toLocaleString()}</p>
              </div>
            </div>

            {/* Investment Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={investorDetails.history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#60A5FA"
                    strokeWidth={2}
                    dot={{ fill: '#60A5FA' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Investment Categories */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(investorDetails.investments).map(([category, data]) => (
                <Card key={category} className="bg-gray-800/50 border-none">
                  <CardHeader>
                    <CardTitle className="text-sm capitalize">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current</span>
                        <span>${data.currentValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Change</span>
                        <span className={data.change >= 0 ? "text-green-400" : "text-red-400"}>
                          {data.change}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Deposit Section */}
            <div className="flex gap-4">
              <Input
                type="number"
                placeholder="Amount to deposit"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="bg-gray-800/50 border-gray-700"
              />
              <Button 
                onClick={deposit} 
                disabled={loading || !depositAmount}
                className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Deposit'
                )}
              </Button>
            </div>

            {/* Transaction History */}
            <Card className="bg-gray-800/50 border-none">
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investorDetails.transactions.map((tx, index) => (
                    <div key={index} className="flex justify-between items-center border-b border-gray-700 pb-2">
                      <div>
                        <p className="font-medium">{tx.type}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(tx.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${tx.amount.toLocaleString()}</p>
                        <p className="text-sm text-green-400">{tx.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}