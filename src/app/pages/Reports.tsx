import React, { useState } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { useFinanceStore } from '../store/useFinanceStore';
import { getCategoryById } from '../data/categories';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export function Reports() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const transactions = useFinanceStore((state) => state.transactions);

  // Expense by category
  const expenseByCategory = transactions
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
            color: category.color
          });
        }
      }
      return acc;
    }, [] as Array<{ name: string; value: number; color: string }>);

  // Sort by value
  expenseByCategory.sort((a, b) => b.value - a.value);

  // Monthly expenses (mock data for demo)
  const monthlyData = [
    { month: 'Ene', gastos: 4200, ingresos: 35000 },
    { month: 'Feb', gastos: 3800, ingresos: 35000 },
    { month: 'Mar', gastos: 5100, ingresos: 35000 },
    { month: 'Abr', gastos: 3880, ingresos: 35000 },
  ];

  const totalExpenses = expenseByCategory.reduce((sum, cat) => sum + cat.value, 0);
  const topCategory = expenseByCategory[0];
  const avgWeekly = totalExpenses / 4;

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
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
          <h3 className="font-semibold mb-4">Comparación mensual</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
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
