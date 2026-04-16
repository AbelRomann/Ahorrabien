import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, CalendarClock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useFinanceStore } from '../store/useFinanceStore';
import { getCategoryById } from '../data/categories';
import { RecurringTransaction } from '../data/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { categories as defaultCategories } from '../data/categories';

export function AutoTransactions() {
  const navigate = useNavigate();
  const recurring = useFinanceStore((state) => state.recurring);
  const addRecurring = useFinanceStore((state) => state.addRecurring);
  const deleteRecurring = useFinanceStore((state) => state.deleteRecurring);

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly'>('monthly');

  const handleSave = () => {
    if (!amount || !categoryId || !frequency) return;
    Haptics.impact({ style: ImpactStyle.Light });

    const now = new Date();
    let nextDate = new Date();
    
    // Set next date based on frequency
    if (frequency === 'daily') nextDate.setDate(now.getDate() + 1);
    else if (frequency === 'weekly') nextDate.setDate(now.getDate() + 7);
    else if (frequency === 'biweekly') nextDate.setDate(now.getDate() + 14);
    else if (frequency === 'monthly') nextDate.setMonth(now.getMonth() + 1);
    else if (frequency === 'yearly') nextDate.setFullYear(now.getFullYear() + 1);

    const newRt: RecurringTransaction = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      type,
      amount: parseFloat(amount),
      category: categoryId,
      description: description || 'Pago automático',
      frequency,
      next_date: nextDate.toISOString(),
      paymentMethod: 'auto'
    };

    addRecurring(newRt);
    setIsModalOpen(false);
    setAmount('');
    setDescription('');
    setFrequency('monthly');
  };

  const getFreqLabel = (freq: string) => {
    switch (freq) {
      case 'daily': return 'Diario';
      case 'weekly': return 'Semanal';
      case 'biweekly': return 'Quincenal';
      case 'monthly': return 'Mensual';
      case 'yearly': return 'Anual';
      default: return freq;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card px-6 py-4 flex items-center gap-4 sticky top-0 z-10 border-b border-border">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full flex items-center justify-center bg-muted/20 text-foreground"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold flex-1">Pagos Automáticos</h1>
      </div>

      <div className="p-6">
        <p className="text-muted-foreground text-sm mb-6">
          Los pagos registrados aquí se añadirán silenciosamente a tu historial el día que corresponda aunque no abras la aplicación en esa fecha exacta.
        </p>

        <div className="space-y-3 mb-24">
          {recurring.length === 0 ? (
            <div className="text-center py-10 bg-card rounded-2xl border border-border">
              <CalendarClock className="mx-auto text-muted-foreground/30 mb-3" size={48} />
              <p className="text-muted-foreground font-medium">No tienes pagos automáticos</p>
              <p className="text-sm text-muted-foreground/60 w-3/4 mx-auto mt-2">
                Agrega facturas fijas como el internet, alquiler o tu salario mensual.
              </p>
            </div>
          ) : (
            recurring.map((rt) => {
              const category = getCategoryById(rt.category);
              const nextDateStr = new Date(rt.next_date).toLocaleDateString('es-DO', { month: 'short', day: 'numeric', year: 'numeric' });
              
              return (
                <div key={rt.id} className="bg-card border border-border rounded-2xl p-4 flex gap-4 items-center">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${category?.color}20` || '#33333320' }}
                  >
                    <span className="text-2xl">{category?.icon || '📦'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate text-[15px]">{rt.description}</h3>
                    <div className="flex gap-2 items-center text-xs text-muted-foreground mt-0.5">
                      <span className="bg-muted/30 px-2 py-0.5 rounded-sm">{getFreqLabel(rt.frequency)}</span>
                      <span>Próximo: {nextDateStr}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${rt.type === 'expense' ? 'text-destructive' : 'text-primary'}`}>
                      {rt.type === 'expense' ? '-' : '+'}${rt.amount.toLocaleString()}
                    </p>
                    <button 
                      onClick={() => deleteRecurring(rt.id)}
                      className="mt-2 text-destructive/80 hover:text-destructive text-xs italic"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-primary to-[#06B6D4] rounded-full flex items-center justify-center shadow-lg shadow-primary/50"
      >
        <Plus size={28} className="text-white" />
      </button>

      {/* Add Recurring Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[340px] sm:max-w-md rounded-[24px]">
          <DialogHeader>
            <DialogTitle>Nueva Suscripción FIja</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            
            <div className="flex bg-muted/30 p-1 rounded-xl">
              <button
                className={`flex-1 py-2 text-sm rounded-lg font-medium ${type === 'expense' ? 'bg-background shadow text-foreground' : 'text-muted-foreground'}`}
                onClick={() => setType('expense')}
              >
                Gasto recurrente
              </button>
              <button
                className={`flex-1 py-2 text-sm rounded-lg font-medium ${type === 'income' ? 'bg-background shadow text-foreground' : 'text-muted-foreground'}`}
                onClick={() => setType('income')}
              >
                Ingreso fijo
              </button>
            </div>

            <Input 
              type="number" 
              placeholder="Monto" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-xl py-6"
            />
            
            <Input 
              type="text" 
              placeholder="Descripción (EJ: Factura Luz)" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Select value={frequency} onValueChange={(v: any) => setFrequency(v)}>
              <SelectTrigger>
                 <SelectValue placeholder="Frecuencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diariamente</SelectItem>
                <SelectItem value="weekly">Semanalmente</SelectItem>
                <SelectItem value="biweekly">Quincenalmente</SelectItem>
                <SelectItem value="monthly">Mensualmente</SelectItem>
                <SelectItem value="yearly">Anualmente</SelectItem>
              </SelectContent>
            </Select>

            <div className="pt-2">
              <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase">Categoría</label>
              <div className="grid grid-cols-4 gap-2">
                {defaultCategories.filter(c => c.type === type || c.type === 'both').map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setCategoryId(category.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl gap-1 border-2 transition-all ${
                      categoryId === category.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-transparent bg-muted/20 hover:bg-muted/40'
                    }`}
                  >
                    <span className="text-2xl">{category.icon}</span>
                    <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
          <DialogFooter>
            <Button onClick={handleSave} className="w-full py-6 rounded-xl text-md">
              Iniciar Automatización
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
