import React from 'react';
import { Plus, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { TransactionCard } from '../components/TransactionCard';
import { BottomNav } from '../components/BottomNav';
import { BalanceCard } from '../components/BalanceCard';
import { StatCard } from '../components/StatCard';
import { mockTransactions } from '../data/mockData';
import { getCategoryById } from '../data/categories';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export function Home() {
  const navigate = useNavigate();

  const totalIncome = mockTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = mockTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const recentTransactions = mockTransactions.slice(0, 5);

  // Expense by category for mini chart
  const expenseByCategory = mockTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const category = getCategoryById(t.category);
      if (category) {
        acc[category.name] = (acc[category.name] || 0) + t.amount;
      }
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.entries(expenseByCategory).map(([name, value]) => ({
    name,
    value,
    color: getCategoryById(
      mockTransactions.find(t => getCategoryById(t.category)?.name === name)?.category || ''
    )?.color || '#10B981'
  }));

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-[#06B6D4] px-6 pt-12 pb-8 rounded-b-[2rem]">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-white/80 text-sm">Buenos días,</p>
            <h1 className="text-white text-2xl font-bold">Usuario</h1>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Wallet size={24} className="text-white" />
          </div>
        </div>

        {/* Balance Card */}
        <BalanceCard 
          balance={balance} 
          income={totalIncome} 
          expenses={totalExpenses} 
        />
      </div>

      {/* Quick Stats */}
      <div className="px-6 -mt-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={TrendingUp}
            label="Este mes"
            value={`$${totalExpenses.toLocaleString()}`}
            iconColor="#10B981"
            iconBgColor="#10B98120"
          />
          <StatCard
            icon={TrendingDown}
            label="Ahorro"
            value={`$${balance.toLocaleString()}`}
            iconColor="#8B5CF6"
            iconBgColor="#8B5CF620"
          />
        </div>
      </div>

      {/* Gastos por categoría */}
      <div className="px-6 mb-6">
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h3 className="font-semibold mb-4">Gastos por categoría</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {chartData.slice(0, 4).map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Últimos movimientos</h3>
          <button 
            onClick={() => navigate('/history')}
            className="text-sm text-primary hover:underline"
          >
            Ver todos
          </button>
        </div>
        <div className="space-y-3">
          {recentTransactions.map(transaction => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/add-transaction')}
        className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-primary to-[#06B6D4] rounded-full flex items-center justify-center shadow-lg shadow-primary/50 hover:scale-110 transition-transform z-40"
      >
        <Plus size={28} className="text-white" />
      </button>

      <BottomNav />
    </div>
  );
}