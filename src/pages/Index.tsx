import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AptosClient } from "aptos";

const MODULE_ADDRESS = "YOUR_MODULE_ADDRESS"; // Replace with your deployed contract address

export default function EnhancedFundTracker() {
  const [account, setAccount] = useState(null);
  const [isManager, setIsManager] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [investorDetails, setInvestorDetails] = useState(null);
  const [categoryValues, setCategoryValues] = useState({
    crypto: '0',
    stocks: '0',
    realEstate: '0'
  });

  const client = new AptosClient('https://fullnode.devnet.aptoslabs.com/v1');

  const BadgeCard = ({ level, amount }) => {
    const getBadgeColor = () => {
      switch (level) {
        case 'Diamond': return 'bg-blue-500';
        case 'Gold': return 'bg-yellow-500';
        case 'Silver': return 'bg-gray-400';
        default: return 'bg-gray-200';
      }
    };

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge className={`${getBadgeColor()} text-white`}>{level}</Badge>
            <span>Investor</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">Investment: {amount} APT</p>
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
    if (!window.aptos) {
      alert('Please install Petra Wallet');
      return;
    }
    
    setLoading(true);
    try {
      const response = await window.aptos.connect();
      const account = await window.aptos.account();
      setAccount(account.address);
      
      const resource = await client.getAccountResource(
        account.address,
        `${MODULE_ADDRESS}::tracker::FundTrackerState`
      );
      setIsManager(resource.data.manager === account.address);
      
      loadInvestorDetails(account.address);
    } catch (error) {
      console.error('Error connecting:', error);
    } finally {
      setLoading(false);
    }
  };

  const deposit = async () => {
    if (!window.aptos || !depositAmount) return;
    
    setLoading(true);
    try {
      const transaction = {
        arguments: [depositAmount],
        function: `${MODULE_ADDRESS}::tracker::deposit`,
        type: 'entry_function_payload',
        type_arguments: [],
      };
      
      const pendingTransaction = await window.aptos.signAndSubmitTransaction(transaction);
      await client.waitForTransaction(pendingTransaction.hash);
      
      handleSuccess();
      loadInvestorDetails(account);
      setDepositAmount('');
    } catch (error) {
      console.error('Error depositing:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInvestorDetails = async (address) => {
    try {
      const details = await client.view({
        function: `${MODULE_ADDRESS}::tracker::get_investor_details`,
        type_arguments: [],
        arguments: [address]
      });
      
      setInvestorDetails({
        totalInvested: details[0],
        rewardTokens: details[1],
        lastDeposit: details[2],
        badgeLevel: details[3]
      });
    } catch (error) {
      console.error('Error loading investor details:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <Alert>
              <AlertDescription>
                Transaction successful! New badge unlocked!
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Fund Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!account ? (
            <Button onClick={connectWallet} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect Wallet'
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              {investorDetails && (
                <BadgeCard
                  level={['Bronze', 'Silver', 'Gold', 'Diamond'][investorDetails.badgeLevel]}
                  amount={investorDetails.totalInvested}
                />
              )}
              
              <div className="flex gap-4">
                <Input
                  type="number"
                  placeholder="Amount in APT"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
                <Button onClick={deposit} disabled={loading || !depositAmount}>
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
  );
}