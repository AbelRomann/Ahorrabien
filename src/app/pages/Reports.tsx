import React, { useState } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { useFinanceStore } from '../store/useFinanceStore';
import { getCategoryById } from '../data/categories';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export function Reports() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const transactions = useFinanceStore((state) => state.transactions);
  const categoryColors = useFinanceStore((state) => state.categoryColors);
  // Filter transactions based on period selection
  const nowTime = new Date().getTime();
  const currentYear = new Date().getFullYear();
  
  const filteredTransactions = transactions.filter(t => {
    const txTime = new Date(t.date).getTime();
    if (period === 'week') return nowTime - txTime <= 7 * 24 * 60 * 60 * 1000;
    if (period === 'month') return nowTime - txTime <= 30 * 24 * 60 * 60 * 1000;
    if (period === 'year') return new Date(t.date).getFullYear() === currentYear;
    return true;
  });

  // Expense by category
  const expenseByCategory = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const category = getCategoryById(t.category);
      if (category) {
        const existing = acc.find(item => item.name === category.name);
        if (existing) {
          existing.value += t.amount;
        } else {
          acc.push({
            name: category.name,
            value: t.amount,
            color: categoryColors ? categoryColors[category.id] || category.color : category.color
          });
        }
      }
      return acc;
    }, [] as Array<{ name: string; value: number; color: string }>);

  // Sort by value
  expenseByCategory.sort((a, b) => b.value - a.value);

  // Monthly expenses or Weekly depending on period... wait, keeping it simple: just show last 4 months for comparison always, or last 4 weeks if weekly.
  // Actually, keeping the comparison consistent to what was requested: "la parte donde se filtra... no funciona" so the charts respond.
  // Let's filter the bar chart conditionally.
  
  const getComparisonData = () => {
    const result = [];
    const now = new Date();
    
    if (period === 'week') {
      // Last 7 days comparison (Day by Day)
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        const startOfDay = d.getTime();
        const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime();
        
        const dayLabel = d.toLocaleString('es-DO', { weekday: 'short' });
        const dayTx = transactions.filter(t => {
          const txTime = new Date(t.date).getTime();
          return txTime >= startOfDay && txTime <= endOfDay;
        });

        const gastos = dayTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const ingresos = dayTx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

        result.push({ month: dayLabel, gastos, ingresos });
      }
    } else {
      // Monthly Comparison
      for (let i = 3; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const startOfMonth = d.getTime();
        const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999).getTime();

        const monthLabel = d.toLocaleString('es-DO', { month: 'short' });
        const monthTx = transactions.filter(t => {
          const txTime = new Date(t.date).getTime();
          return txTime >= startOfMonth && txTime <= endOfMonth;
        });

        const gastos = monthTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const ingresos = monthTx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

        result.push({ month: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1), gastos, ingresos });
      }
    }
    return result;
  };

  const comparisonData = getComparisonData();

  const totalExpenses = expenseByCategory.reduce((sum, cat) => sum + cat.value, 0);
  const topCategory = expenseByCategory.length > 0 ? expenseByCategory[0] : null;
  const avgWeekly = period === 'week' ? totalExpenses : period === 'year' ? totalExpenses / 52 : totalExpenses / 4;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-6">
        <h1 className="text-2xl font-bold mb-4">Reportes</h1>
        
        {/* Period Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('week')}
            className={`px-4 py-2 rounded-full text-sm ${
              period === 'week'
                ? 'bg-primary text-white'
                : 'bg-background border border-border text-muted-foreground'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 rounded-full text-sm ${
              period === 'month'
                ? 'bg-primary text-white'
                : 'bg-background border border-border text-muted-foreground'
            }`}
          >
            Mes
          </button>
          <button
            onClick={() => setPeriod('year')}
            className={`px-4 py-2 rounded-full text-sm ${
              period === 'year'
                ? 'bg-primary text-white'
                : 'bg-background border border-border text-muted-foreground'
            }`}
          >
            Año
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Key Indicators */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-2xl p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Total gastado</p>
            <p className="text-lg font-bold">${totalExpenses.toLocaleString()}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Promedio/sem</p>
            <p className="text-lg font-bold">${avgWeekly.toFixed(0)}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Mayor gasto</p>
            <p className="text-lg font-bold truncate text-xs">{topCategory?.name}</p>
          </div>
        </div>

        {/* Expense by Category - Pie Chart */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h3 className="font-semibold mb-4">Gastos por categoría</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }) => percent > 0 ? `${(percent * 100).toFixed(0)}%` : ""}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E1E1E', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }}
                  labelStyle={{ color: '#FFFFFF' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category List */}
          <div className="space-y-2 mt-4">
            {expenseByCategory.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm font-semibold">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Comparison - Bar Chart */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h3 className="font-semibold mb-4">Comparación</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E1E1E', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }}
                  labelStyle={{ color: '#FFFFFF' }}
                />
                <Bar dataKey="gastos" fill="#EF4444" radius={[8, 8, 0, 0]} />
                <Bar dataKey="ingresos" fill="#22C55E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-6 border border-primary/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
              <TrendingUp size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Insight del mes</h3>
              <p className="text-sm text-muted-foreground">
                Tus gastos en {topCategory?.name} representan el {((topCategory?.value / totalExpenses) * 100).toFixed(0)}% 
                de tus gastos totales. Considera establecer un presupuesto para esta categoría.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
