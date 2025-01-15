import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FundsForm } from '@/components/funds/FundsForm';
import { WithdrawalHistory } from '@/components/funds/WithdrawalHistory';
import { WalletStatus } from '@/components/shared/WalletStatus';
import { useInvestmentStore } from '@/store/investmentStore';

export default function ManageFunds() {
  const navigate = useNavigate();
  const { walletAddress } = useInvestmentStore();

  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <WalletStatus />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Dashboard
          </Button>
          <WalletStatus />
        </div>
        
        <FundsForm />
        <WithdrawalHistory />
      </div>
    </div>
  );
}