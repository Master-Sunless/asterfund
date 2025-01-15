import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useInvestmentStore } from '@/store/investmentStore';
import confetti from 'canvas-confetti';

export function FundsForm() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [operation, setOperation] = useState<'deposit' | 'withdraw'>('deposit');
  const { toast } = useToast();
  const { addTransaction, updateInvestments, updateBadgeLevel, walletAddress } = useInvestmentStore();

  const handleSuccess = (message: string) => {
    toast({
      title: "Success!",
      description: message,
    });
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleTransaction = async () => {
    if (!amount || !walletAddress) return;
    setLoading(true);
    
    const parsedAmount = parseFloat(amount);
    
    if (operation === 'withdraw') {
      // TODO: Integrate with Aptos smart contract for withdrawal
      const lastDepositTime = localStorage.getItem('lastDepositTime');
      const mockWithdrawalDelay = 5 * 60 * 1000; // 5 minutes in milliseconds
      
      if (lastDepositTime && Date.now() - parseInt(lastDepositTime) < mockWithdrawalDelay) {
        toast({
          variant: "destructive",
          title: "Withdrawal not allowed",
          description: "Please wait 5 minutes after your last deposit before withdrawing.",
        });
        setLoading(false);
        return;
      }

      // TODO: Verify sufficient balance in smart contract
      addTransaction({
        type: 'withdrawal',
        amount: parsedAmount,
        timestamp: new Date().toISOString(),
        status: 'Completed',
        address: walletAddress
      });
      updateInvestments('undeployed', -parsedAmount);
    } else {
      // TODO: Integrate with Aptos smart contract for deposit
      localStorage.setItem('lastDepositTime', Date.now().toString());
      addTransaction({
        type: 'deposit',
        amount: parsedAmount,
        timestamp: new Date().toISOString(),
        status: 'Completed',
        address: walletAddress
      });
      updateInvestments('undeployed', parsedAmount);
      updateBadgeLevel();
    }

    setTimeout(() => {
      handleSuccess(`${operation === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`);
      setAmount('');
      setLoading(false);
    }, 1500);
  };

  return (
    <Card className="backdrop-blur-sm bg-white/10 border-none">
      <CardHeader>
        <CardTitle>Manage Funds</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant={operation === 'deposit' ? 'default' : 'outline'}
            onClick={() => setOperation('deposit')}
            className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
          >
            <ArrowUp className="mr-2 h-4 w-4" />
            Deposit
          </Button>
          <Button
            variant={operation === 'withdraw' ? 'default' : 'outline'}
            onClick={() => setOperation('withdraw')}
            className="flex-1"
          >
            <ArrowDown className="mr-2 h-4 w-4" />
            Withdraw
          </Button>
        </div>

        <div className="space-y-2">
          <Input
            type="number"
            placeholder={`Amount to ${operation}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-gray-800/50 border-gray-700"
          />
          {operation === 'withdraw' && (
            <Input
              placeholder="APT Token Address"
              className="bg-gray-800/50 border-gray-700"
            />
          )}
          <Button 
            onClick={handleTransaction} 
            disabled={loading || !amount || !walletAddress}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              operation === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}