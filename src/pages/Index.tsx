import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Wallet, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for firm statistics
const firmStats = {
  totalFunds: 2500000,
  currentValue: 2750000,
  investors: 156,
  fees: 0.02, // 2%
  categoryInvestments: {
    crypto: 850000,
    stocks: 1200000,
    realEstate: 700000,
  },
};

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto p-6 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            FundFusion Capital
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Your trusted partner in diversified investment management across Crypto, Stocks, and Real Estate
          </p>
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
          >
            Access Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="backdrop-blur-sm bg-white/10 border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <TrendingUp className="h-5 w-5" />
                Total Assets Under Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${firmStats.totalFunds.toLocaleString()}</p>
              <p className="text-green-400 text-sm">
                +10% growth this quarter
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/10 border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-400">
                <Users className="h-5 w-5" />
                Active Investors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{firmStats.investors}</p>
              <p className="text-gray-400 text-sm">
                Across 15 countries
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/10 border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Wallet className="h-5 w-5" />
                Management Fee
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{(firmStats.fees * 100).toFixed(1)}%</p>
              <p className="text-gray-400 text-sm">
                Industry-leading rates
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Investment Categories */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Investment Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(firmStats.categoryInvestments).map(([category, amount]) => (
              <Card key={category} className="backdrop-blur-sm bg-white/10 border-none">
                <CardHeader>
                  <CardTitle className="capitalize">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">${amount.toLocaleString()}</p>
                  <div className="h-2 bg-gray-700 rounded-full mt-2">
                    <div 
                      className={`h-full rounded-full ${
                        category === 'crypto' ? 'bg-blue-500' :
                        category === 'stocks' ? 'bg-green-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${(amount / firmStats.totalFunds) * 100}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}