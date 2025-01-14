import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function WithdrawalHistory() {
  // Mock withdrawal history
  const withdrawals = [
    {
      amount: 1000,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'Completed',
      address: '0x123...abc'
    },
    {
      amount: 500,
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      status: 'Completed',
      address: '0x123...abc'
    }
  ];

  return (
    <Card className="backdrop-blur-sm bg-white/10 border-none">
      <CardHeader>
        <CardTitle>Withdrawal History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {withdrawals.map((withdrawal, index) => (
            <div key={index} className="flex justify-between items-center border-b border-gray-700 pb-2">
              <div>
                <p className="font-medium">${withdrawal.amount.toLocaleString()}</p>
                <p className="text-sm text-gray-400">
                  {new Date(withdrawal.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">{withdrawal.address}</p>
                <p className="text-sm text-green-400">{withdrawal.status}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}