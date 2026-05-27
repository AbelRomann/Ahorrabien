import React from 'react';
import { Plus, TrendingDown, Target, Wallet, MoreVertical } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { TransactionCard } from '../components/TransactionCard';
import { BottomNav } from '../components/BottomNav';
import { BalanceCard } from '../components/BalanceCard';
import { StatCard } from '../components/StatCard';
import { SyncIndicator } from '../components/SyncIndicator';
import { useFinanceStore } from '../store/useFinanceStore';
import { useAuthStore } from '../store/useAuthStore';
import { getCategoryById } from '../data/categories';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { motion } from 'motion/react';

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
  const totalCategorizedExpenses = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="relative overflow-hidden rounded-b-[2.35rem] bg-[linear-gradient(180deg,#0b1518_0%,#0e2428_38%,#10272b_100%)] px-6 safe-top pb-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(26,224,181,0.28),transparent_34%),radial-gradient(circle_at_88%_16%,rgba(32,194,224,0.18),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_42%)]" />
        <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-white/10" />
        <div className="relative flex justify-between items-start mb-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pr-4">
            <p className="text-white/62 text-[13px] font-medium tracking-[0.02em]">Buenos días,</p>
            <h1 className="mt-1 text-white text-[2rem] font-semibold leading-none tracking-tight">{displayName}</h1>
          </motion.div>
          <div className="flex items-center gap-2">
            <SyncIndicator />
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/8 text-white/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition-colors hover:bg-white/12"
              aria-label="Wallet"
            >
              <Wallet size={19} />
            </button>
          </div>
        </div>

        {/* Balance Card */}
        <div className="relative mb-1">
          <BalanceCard 
            balance={balance} 
            income={totalIncome} 
            expenses={totalExpenses} 
          />
        </div>
      </div>

      {/* Quick Stats */}
      <motion.div className="px-6 mt-6 mb-6" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={TrendingDown}
            label="Este mes"
            value={`$${totalExpenses.toLocaleString()}`}
            iconColor="#EF4444"
            iconBgColor="#EF444420"
          />
          <button 
            onClick={() => {
              Haptics.impact({ style: ImpactStyle.Light });
              setShowGoalModal(true);
            }} 
            className="text-left w-full"
          >
            <StatCard
              icon={Target}
              label={savingsGoal > 0 ? `Meta: $${savingsGoal.toLocaleString()}` : 'Ahorro'}
              value={`$${balance.toLocaleString()}`}
              iconColor="#8B5CF6"
              iconBgColor="#8B5CF620"
              progress={savingsGoal > 0 ? (balance / savingsGoal) * 100 : undefined}
              progressLabel={savingsGoal > 0 ? `${Math.min(100, Math.max(0, Math.round((balance / savingsGoal) * 100)))}% de la meta` : undefined}
            />
          </button>
        </div>
      </motion.div>

      {/* Gastos por categoría */}
      <motion.div className="px-6 mb-6" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
        <div className="bg-surface-elevated/90 rounded-3xl p-6 ring-1 ring-white/8 shadow-[0_18px_45px_rgba(0,0,0,0.2)]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Gastos por categoría</h3>
            <button 
              onClick={() => {
                Haptics.impact({ style: ImpactStyle.Light });
                setShowColorModal(true);
              }} 
              className="p-2 rounded-full hover:bg-white/5 text-muted-foreground"
            >
              <MoreVertical size={16} />
            </button>
          </div>
          <div className="relative h-48">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="text-lg font-extrabold">${totalCategorizedExpenses.toLocaleString()}</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={76}
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
          <div className="mt-4 max-h-40 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {chartData.map((item) => {
                const percentage = totalCategorizedExpenses > 0
                  ? Math.round((item.value / totalCategorizedExpenses) * 100)
                  : 0;

                return (
                  <div key={item.categoryId || item.name} className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.03] px-3 py-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_12px_currentColor]" style={{ backgroundColor: item.color, color: item.color }} />
                      <span className="truncate text-xs text-muted-foreground">{item.name}</span>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-semibold">${item.value.toLocaleString()}</p>
                      <p className="text-[11px] text-muted-foreground">{percentage}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div className="px-6 mb-6" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Últimos movimientos</h3>
          <button 
            onClick={() => {
              Haptics.impact({ style: ImpactStyle.Light });
              navigate('/history');
            }}
            className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary ring-1 ring-primary/20"
          >
            Ver todos
          </button>
        </div>
        <div className="space-y-3">
          {recentTransactions.map(transaction => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </motion.div>

      {/* Floating Action Button */}
      <button
        onClick={() => {
          Haptics.impact({ style: ImpactStyle.Medium });
          navigate('/add-transaction');
        }}
        className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-primary via-glow-primary to-[#06B6D4] rounded-full flex items-center justify-center animate-glow-pulse hover:scale-105 transition-transform z-40"
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
