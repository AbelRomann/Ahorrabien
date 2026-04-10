import React from 'react';
import { Plus, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { BottomNav } from '../components/BottomNav';
import { useFinanceStore } from '../store/useFinanceStore';
import { getCategoryById } from '../data/categories';

export function Budgets() {
  const mockBudgets = useFinanceStore((state) => state.budgets); // Using the same variable name to avoid editing multiple lines
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-6">
        <h1 className="text-2xl font-bold mb-2">Presupuestos</h1>
        <p className="text-sm text-muted-foreground">Controla tus límites mensuales</p>
      </div>

      {/* Monthly Summary */}
      <div className="px-6 py-4">
        <div className="bg-gradient-to-br from-primary to-[#06B6D4] rounded-3xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-white" />
            <p className="text-white/80 text-sm">Total presupuestado</p>
          </div>
          <h2 className="text-white text-3xl font-bold mb-4">
            ${mockBudgets.reduce((sum, b) => sum + b.limit, 0).toLocaleString()}
          </h2>
          <div className="flex items-center gap-4 text-sm text-white/90">
            <div>
              <span className="text-white/60">Gastado: </span>
              ${mockBudgets.reduce((sum, b) => sum + b.spent, 0).toLocaleString()}
            </div>
            <div>
              <span className="text-white/60">Restante: </span>
              ${mockBudgets.reduce((sum, b) => sum + (b.limit - b.spent), 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Budget Cards */}
        <div className="space-y-4">
          {mockBudgets.map(budget => {
            const category = getCategoryById(budget.category);
            const Icon = category?.icon;
            const percentage = (budget.spent / budget.limit) * 100;
            const remaining = budget.limit - budget.spent;
            const isOverBudget = percentage > 100;

            return (
              <div key={budget.id} className="bg-card rounded-2xl p-5 border border-border">
                <div className="flex items-start gap-4 mb-4">
                  {Icon && (
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${category?.color}20` }}
                    >
                      <Icon size={24} style={{ color: category?.color }} />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{category?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${budget.spent.toLocaleString()} de ${budget.limit.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      isOverBudget ? 'text-[#EF4444]' : 'text-primary'
                    }`}>
                      {percentage.toFixed(0)}%
                    </p>
                  </div>
                </div>

                <Progress 
                  value={Math.min(percentage, 100)} 
                  className="h-2 mb-2"
                />

                <p className={`text-xs ${
                  isOverBudget ? 'text-[#EF4444]' : 'text-muted-foreground'
                }`}>
                  {isOverBudget 
                    ? `Excedido por $${Math.abs(remaining).toLocaleString()}`
                    : `Quedan $${remaining.toLocaleString()}`
                  }
                </p>
              </div>
            );
          })}
        </div>

        {/* Add Budget Button */}
        <Button
          className="w-full h-14 bg-card hover:bg-muted border-2 border-dashed border-border text-foreground rounded-2xl mt-6"
        >
          <Plus size={20} className="mr-2" />
          Crear nuevo presupuesto
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}