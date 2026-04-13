import React from 'react';
import { Plus, TrendingUp, TrendingDown, Wallet, MoreVertical } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { TransactionCard } from '../components/TransactionCard';
import { BottomNav } from '../components/BottomNav';
import { BalanceCard } from '../components/BalanceCard';
import { StatCard } from '../components/StatCard';
import { useFinanceStore } from '../store/useFinanceStore';
import { useAuthStore } from '../store/useAuthStore';
import { getCategoryById } from '../data/categories';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';

export function Home() {
  const navigate = useNavigate();
  const transactions = useFinanceStore((state) => state.transactions);
  const displayName = useAuthStore((state) => state.displayName);
  const savingsGoal = useFinanceStore((state) => state.savingsGoal);
  const categoryColors = useFinanceStore((state) => state.categoryColors);
  const updateSavingsGoal = useFinanceStore((state) => state.updateSavingsGoal);
  const updateCategoryColor = useFinanceStore((state) => state.updateCategoryColor);

  const [showGoalModal, setShowGoalModal] = React.useState(false);
  const [tempGoal, setTempGoal] = React.useState('');
  const [showColorModal, setShowColorModal] = React.useState(false);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const recentTransactions = transactions.slice(0, 5);

  // Expense by category for mini chart
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const category = getCategoryById(t.category);
      if (category) {
        acc[category.name] = (acc[category.name] || 0) + t.amount;
      }
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.entries(expenseByCategory).map(([name, value]) => {
    const defaultColor = getCategoryById(
      transactions.find(t => getCategoryById(t.category)?.name === name)?.category || ''
    )?.color || '#10B981';
    
    const categoryId = transactions.find(t => getCategoryById(t.category)?.name === name)?.category || '';
    return {
      name,
      value,
      categoryId,
      color: categoryColors[categoryId] || defaultColor
    };
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-[#06B6D4] px-6 pt-12 pb-8 rounded-b-[2rem]">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-white/80 text-sm">Buenos días,</p>
            <h1 className="text-white text-2xl font-bold">{displayName}</h1>
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
          <button 
            onClick={() => {
              Haptics.impact({ style: ImpactStyle.Light });
              setShowGoalModal(true);
            }} 
            className="text-left w-full"
          >
            <StatCard
              icon={TrendingDown}
              label={`Ahorro${savingsGoal > 0 ? ` (Meta: $${savingsGoal.toLocaleString()})` : ''}`}
              value={`$${balance.toLocaleString()}`}
              iconColor="#8B5CF6"
              iconBgColor="#8B5CF620"
            />
          </button>
        </div>
      </div>

      {/* Gastos por categoría */}
      <div className="px-6 mb-6">
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Gastos por categoría</h3>
            <button 
              onClick={() => {
                Haptics.impact({ style: ImpactStyle.Light });
                setShowColorModal(true);
              }} 
              className="p-1 rounded-full hover:bg-black/5 text-muted-foreground"
            >
              <MoreVertical size={16} />
            </button>
          </div>
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
                  labelLine={false}
                  label={({ percent }) => percent > 0 ? `${(percent * 100).toFixed(0)}%` : ""}
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
            onClick={() => {
              Haptics.impact({ style: ImpactStyle.Light });
              navigate('/history');
            }}
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
        onClick={() => {
          Haptics.impact({ style: ImpactStyle.Medium });
          navigate('/add-transaction');
        }}
        className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-primary to-[#06B6D4] rounded-full flex items-center justify-center shadow-lg shadow-primary/50 hover:scale-110 transition-transform z-40"
      >
        <Plus size={28} className="text-white" />
      </button>

      <BottomNav />

      {/* Modals */}
      <Dialog open={showGoalModal} onOpenChange={setShowGoalModal}>
        <DialogContent className="max-w-xs sm:max-w-sm rounded-[24px]">
          <DialogHeader>
            <DialogTitle>Establecer meta de ahorro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input 
              type="number" 
              value={tempGoal} 
              onChange={e => setTempGoal(e.target.value)} 
              placeholder="Ej. 10000" 
              className="text-lg"
            />
            <Button 
              className="w-full text-base py-5 rounded-xl"
              onClick={() => { 
                updateSavingsGoal(Number(tempGoal)); 
                setShowGoalModal(false); 
              }}
            >
              Guardar Meta
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showColorModal} onOpenChange={setShowColorModal}>
        <DialogContent className="max-w-xs sm:max-w-sm rounded-[24px]">
          <DialogHeader>
            <DialogTitle>Editar Colores de Categoría</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 pt-4 max-h-[60vh] overflow-y-auto pr-2">
            {Array.from(new Set(transactions.filter(t => t.type === 'expense').map(t => t.category))).map(catId => {
              const category = getCategoryById(catId);
              if (!category) return null;
              const currentColor = categoryColors[catId] || category.color;
              return (
                <div key={catId} className="flex items-center justify-between p-2 rounded-lg bg-black/5">
                  <span className="font-medium">{category.name}</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={currentColor} 
                      onChange={e => updateCategoryColor(catId, e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                    />
                  </div>
                </div>
              );
            })}
            {transactions.filter(t => t.type === 'expense').length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">No tienes gastos registrados.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}