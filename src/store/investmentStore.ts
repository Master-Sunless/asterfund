import { create } from 'zustand';

export interface Investment {
  type: 'deposit' | 'withdrawal';
  amount: number;
  timestamp: string;
  status: string;
  address?: string;
}

interface InvestmentState {
  totalInvested: number;
  currentValue: number;
  walletAddress: string | null;
  badgeLevel: number; // 0: Bronze, 1: Silver, 2: Gold, 3: Diamond
  investments: {
    undeployed: { amount: number; currentValue: number; change: number };
    crypto: { amount: number; currentValue: number; change: number };
    stocks: { amount: number; currentValue: number; change: number };
    realEstate: { amount: number; currentValue: number; change: number };
  };
  transactions: Investment[];
  setWalletAddress: (address: string | null) => void;
  addTransaction: (transaction: Investment) => void;
  updateInvestments: (category: keyof InvestmentState['investments'], amount: number) => void;
  updateBadgeLevel: () => void;
}

export const useInvestmentStore = create<InvestmentState>((set) => ({
  totalInvested: 75000,
  currentValue: 82500,
  walletAddress: null,
  badgeLevel: 0,
  investments: {
    undeployed: { amount: 0, currentValue: 0, change: 0 },
    crypto: { amount: 25000, currentValue: 28000, change: 12 },
    stocks: { amount: 30000, currentValue: 31500, change: 5 },
    realEstate: { amount: 20000, currentValue: 23000, change: 15 }
  },
  transactions: [],
  setWalletAddress: (address) => set({ walletAddress: address }),
  addTransaction: (transaction) => set((state) => ({
    transactions: [transaction, ...state.transactions],
    totalInvested: transaction.type === 'deposit' 
      ? state.totalInvested + transaction.amount 
      : state.totalInvested - transaction.amount
  })),
  updateInvestments: (category, amount) => set((state) => ({
    investments: {
      ...state.investments,
      [category]: {
        ...state.investments[category],
        amount: state.investments[category].amount + amount,
        currentValue: state.investments[category].currentValue + amount,
      }
    }
  })),
  updateBadgeLevel: () => set((state) => {
    let newBadgeLevel = state.badgeLevel;
    if (state.totalInvested >= 100000) newBadgeLevel = 3; // Diamond
    else if (state.totalInvested >= 50000) newBadgeLevel = 2; // Gold
    else if (state.totalInvested >= 25000) newBadgeLevel = 1; // Silver
    return { badgeLevel: newBadgeLevel };
  })
}));