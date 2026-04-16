import React, { useState } from 'react';
import { Plus, TrendingUp, PiggyBank } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { BottomNav } from '../components/BottomNav';
import { useFinanceStore } from '../store/useFinanceStore';
import { getCategoryById, categories as defaultCategories } from '../data/categories';
import { Budget } from '../data/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

type ThresholdLevel = 'safe' | 'warning' | 'danger' | 'over';

const getThreshold = (pct: number): ThresholdLevel => {
  if (pct >= 100) return 'over';
  if (pct >= 90) return 'danger';
  if (pct >= 70) return 'warning';
  return 'safe';
};

const thresholdStyles: Record<ThresholdLevel, { bar: string; text: string; badge: string }> = {
  safe:    { bar: 'bg-primary',          text: 'text-primary',       badge: '' },
  warning: { bar: 'bg-amber-400',        text: 'text-amber-400',     badge: 'bg-amber-400/15 text-amber-400' },
  danger:  { bar: 'bg-orange-500',       text: 'text-orange-500',    badge: 'bg-orange-500/15 text-orange-500' },
  over:    { bar: 'bg-destructive',      text: 'text-destructive',   badge: 'bg-destructive/15 text-destructive' },
};

const thresholdLabel: Record<ThresholdLevel, string | null> = {
  safe:    null,
  warning: '70% usado',
  danger:  '90% usado',
  over:    '¡Límite superado!',
};

export function Budgets() {
  const budgets = useFinanceStore((state) => state.budgets);
  const addBudget = useFinanceStore((state) => state.addBudget);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [limit, setLimit] = useState('');

  const handleSave = async () => {
    if (!categoryId || !limit || parseFloat(limit) <= 0) return;
    Haptics.impact({ style: ImpactStyle.Light });

    // Avoid duplicate categories
    if (budgets.some(b => b.category === categoryId)) return;

    const newBudget: Budget = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      category: categoryId,
      limit: parseFloat(limit),
      spent: 0,
    };

    await addBudget(newBudget);
    setIsModalOpen(false);
    setCategoryId('');
    setLimit('');
  };

  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalLimit - totalSpent;

  // Only expense categories can have budgets
  const availableCategories = defaultCategories.filter(
    c => c.type === 'expense' && !budgets.some(b => b.category === c.id)
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-6">
        <h1 className="text-2xl font-bold mb-2">Presupuestos</h1>
        <p className="text-sm text-muted-foreground">Controla tus límites mensuales</p>
      </div>

      <div className="px-6 py-4">
        {/* Monthly Summary */}
        {budgets.length > 0 && (
          <div className="bg-gradient-to-br from-primary to-[#06B6D4] rounded-3xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={20} className="text-white" />
              <p className="text-white/80 text-sm">Total presupuestado</p>
            </div>
            <h2 className="text-white text-3xl font-bold mb-4">
              ${totalLimit.toLocaleString()}
            </h2>
            <div className="flex items-center gap-4 text-sm text-white/90">
              <div>
                <span className="text-white/60">Gastado: </span>
                ${totalSpent.toLocaleString()}
              </div>
              <div>
                <span className="text-white/60">Restante: </span>
                ${totalRemaining.toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {budgets.length === 0 && (
          <div className="text-center py-12 bg-card rounded-2xl border border-border mb-6">
            <PiggyBank className="mx-auto text-muted-foreground/30 mb-3" size={52} />
            <p className="font-semibold text-foreground">Sin presupuestos activos</p>
            <p className="text-sm text-muted-foreground/60 w-3/4 mx-auto mt-2 mb-6">
              Define límites por categoría para controlar tus gastos.
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl px-6"
            >
              <Plus size={16} className="mr-2" />
              Crear primer presupuesto
            </Button>
          </div>
        )}

        {/* Budget Cards */}
        <div className="space-y-4">
          {budgets.map(budget => {
            const category = getCategoryById(budget.category);
            const Icon = category?.icon;
            const percentage = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
            const remaining = budget.limit - budget.spent;
            const level = getThreshold(percentage);
            const styles = thresholdStyles[level];
            const label = thresholdLabel[level];

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
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{category?.name}</h3>
                      {label && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${styles.badge}`}>
                          {label}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ${budget.spent.toLocaleString()} de ${budget.limit.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${styles.text}`}>
                      {percentage.toFixed(0)}%
                    </p>
                  </div>
                </div>

                <Progress
                  value={Math.min(percentage, 100)}
                  className={`h-2 mb-2 [&>div]:${styles.bar}`}
                />

                <p className={`text-xs ${level === 'over' ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {level === 'over'
                    ? `Excedido por $${Math.abs(remaining).toLocaleString()}`
                    : `Quedan $${remaining.toLocaleString()}`
                  }
                </p>
              </div>
            );
          })}
        </div>

        {/* Add Budget Button (when there are already some) */}
        {budgets.length > 0 && (
          <Button
            onClick={() => setIsModalOpen(true)}
            disabled={availableCategories.length === 0}
            className="w-full h-14 bg-card hover:bg-muted border-2 border-dashed border-border text-foreground rounded-2xl mt-6"
          >
            <Plus size={20} className="mr-2" />
            {availableCategories.length === 0 ? 'Todas las categorías tienen presupuesto' : 'Crear nuevo presupuesto'}
          </Button>
        )}
      </div>

      {/* Add Budget Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[340px] sm:max-w-md rounded-[24px]">
          <DialogHeader>
            <DialogTitle>Nuevo presupuesto</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              type="number"
              placeholder="Límite mensual (ej. 5000)"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="text-xl py-6"
            />

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase">
                Categoría
              </label>
              {availableCategories.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Todas las categorías ya tienen presupuesto.
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {availableCategories.map((category) => {
                    const CatIcon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setCategoryId(category.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl gap-1 border-2 transition-all ${
                          categoryId === category.id
                            ? 'border-primary bg-primary/10'
                            : 'border-transparent bg-muted/20 hover:bg-muted/40'
                        }`}
                      >
                        <CatIcon size={22} style={{ color: category.color }} />
                        <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                          {category.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSave}
              disabled={!categoryId || !limit || parseFloat(limit) <= 0}
              className="w-full py-6 rounded-xl text-md"
            >
              Crear presupuesto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}