import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { WalletStatus } from '@/components/shared/WalletStatus';
import { useInvestmentStore } from '@/store/investmentStore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const BADGE_LEVELS = ['Bronze', 'Silver', 'Gold', 'Diamond'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { 
    walletAddress,
    totalInvested,
    currentValue,
    investments,
    transactions,
    badgeLevel
  } = useInvestmentStore();

  const totalChange = ((currentValue - totalInvested) / totalInvested) * 100;

  // Transform transactions for chart data
  const chartData = transactions.reduce((acc: any[], transaction) => {
    const date = new Date(transaction.timestamp);
    const month = date.toLocaleString('default', { month: 'short' });
    const existingEntry = acc.find(entry => entry.month === month);
    
    if (existingEntry) {
      existingEntry.value += transaction.type === 'deposit' ? transaction.amount : -transaction.amount;
    } else {
      acc.push({
        month,
        value: transaction.type === 'deposit' ? transaction.amount : -transaction.amount
      });
    }
    
    return acc;
  }, []);

  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <WalletStatus />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Button
            onClick={() => navigate('/manage-funds')}
            className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
          >
            Manage Funds
          </Button>
          <WalletStatus />
        </div>

        <Card className="backdrop-blur-sm bg-white/80 border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">
                  {BADGE_LEVELS[badgeLevel]} Investor
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
                <p className="text-gray-600">Total Invested</p>
                <p className="text-2xl font-bold">${totalInvested.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Current Value</p>
                <p className="text-2xl font-bold">${currentValue.toLocaleString()}</p>
              </div>
            </div>

            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(investments).map(([category, data]) => (
                <Card key={category} className="bg-white shadow-sm border">
                  <CardHeader>
                    <CardTitle className="text-sm capitalize">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current</span>
                        <span>${data.currentValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Change</span>
                        <div className="flex items-center gap-1">
                          {data.change >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-400" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-400" />
                          )}
                          <span className={data.change >= 0 ? "text-green-400" : "text-red-400"}>
                            {data.change}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}