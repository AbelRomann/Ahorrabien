import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Calendar, DollarSign, FileText, CreditCard, RefreshCw, Clock } from 'lucide-react';
import { Switch } from '../components/ui/switch';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { CategoryChip } from '../components/CategoryChip';
import { categories } from '../data/categories';
import { toast } from 'sonner';
import { useFinanceStore } from '../store/useFinanceStore';

export function AddTransaction() {
  const navigate = useNavigate();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Tarjeta');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const addRecurring = useFinanceStore((state) => state.addRecurring);

  const filteredCategories = categories.filter(
    c => c.type === type || c.type === 'both'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    Haptics.impact({ style: ImpactStyle.Medium });
    if (!amount || !selectedCategory) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }
    
    await addTransaction({
      id: crypto.randomUUID(),
      type,
      amount: parseFloat(amount),
      category: selectedCategory,
      description,
      date,
      paymentMethod
    });

    if (isRecurring) {
       // Also add as a template for the future
       const nextDate = new Date(date);
       if (frequency === 'daily') nextDate.setDate(nextDate.getDate() + 1);
       else if (frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
       else if (frequency === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
       else if (frequency === 'yearly') nextDate.setFullYear(nextDate.getFullYear() + 1);

       await addRecurring({
          id: crypto.randomUUID(),
          type,
          amount: parseFloat(amount),
          category: selectedCategory,
          description: description || `Auto: ${type === 'expense' ? 'Gasto' : 'Ingreso'}`,
          frequency,
          next_date: nextDate.toISOString(),
          paymentMethod
       });
       toast.info('Automatización programada correctamente');
    }

    toast.success('Movimiento guardado exitosamente');
    setTimeout(() => navigate('/home'), 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-foreground">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Agregar Movimiento</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 pt-6">
        {/* Type Toggle */}
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => {
              Haptics.impact({ style: ImpactStyle.Light });
              setType('expense');
            }}
            className={`flex-1 py-3 rounded-2xl font-semibold transition-all ${
              type === 'expense'
                ? 'bg-[#EF4444] text-white'
                : 'bg-card border border-border text-muted-foreground'
            }`}
          >
            Gasto
          </button>
          <button
            type="button"
            onClick={() => {
              Haptics.impact({ style: ImpactStyle.Light });
              setType('income');
            }}
            className={`flex-1 py-3 rounded-2xl font-semibold transition-all ${
              type === 'income'
                ? 'bg-[#22C55E] text-white'
                : 'bg-card border border-border text-muted-foreground'
            }`}
          >
            Ingreso
          </button>
        </div>

        {/* Amount */}
        <div className="mb-6">
          <label className="text-sm text-muted-foreground mb-2 block">Monto</label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-12 h-14 bg-card border-border rounded-2xl text-2xl font-bold"
              required
            />
          </div>
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="text-sm text-muted-foreground mb-3 block">Categoría</label>
          <div className="grid grid-cols-4 gap-3">
            {filteredCategories.map(category => (
              <CategoryChip
                key={category.id}
                name={category.name}
                icon={category.icon}
                color={category.color}
                selected={selectedCategory === category.id}
                onClick={() => {
                  Haptics.impact({ style: ImpactStyle.Light });
                  setSelectedCategory(category.id);
                }}
              />
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="mb-6">
          <label className="text-sm text-muted-foreground mb-2 block">Fecha</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-12 h-14 bg-card border-border rounded-2xl"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <label className="text-sm text-muted-foreground mb-2 block">Método de pago</label>
          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full pl-12 h-14 bg-card border border-border rounded-2xl text-foreground appearance-none"
            >
              <option>Tarjeta</option>
              <option>Efectivo</option>
              <option>Transferencia</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="text-sm text-muted-foreground mb-2 block">Descripción (opcional)</label>
          <div className="relative">
            <FileText className="absolute left-4 top-4 text-muted-foreground" size={20} />
            <textarea
              placeholder="Añade una nota..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-2xl text-foreground resize-none h-24"
            />
          </div>
        </div>

        {/* Recurring Toggle */}
        <div className="mb-6 bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3 text-foreground">
              <RefreshCw size={20} className={isRecurring ? "text-primary animate-spin-slow" : "text-muted-foreground"} />
              <div>
                <p className="font-semibold text-sm">Hacer recurrente</p>
                <p className="text-xs text-muted-foreground">Se cobrará automáticamente en el futuro</p>
              </div>
            </div>
            <Switch 
              checked={isRecurring} 
              onCheckedChange={(checked) => {
                Haptics.impact({ style: ImpactStyle.Light });
                setIsRecurring(checked);
              }}
            />
          </div>

          {isRecurring && (
            <div className="mt-4 pt-4 border-t border-border space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-2 block uppercase">¿Cada cuánto tiempo?</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'daily', label: 'Diario' },
                    { id: 'weekly', label: 'Semanal' },
                    { id: 'monthly', label: 'Mensual' },
                    { id: 'yearly', label: 'Anual' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFrequency(f.id as any)}
                      className={`py-2 px-3 rounded-xl text-sm font-medium border transition-all ${
                        frequency === f.id 
                          ? 'bg-primary/10 border-primary text-primary' 
                          : 'bg-background border-border text-muted-foreground'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-primary/70 bg-primary/5 p-2 rounded-lg">
                <Clock size={12} />
                <span>El primer cobro automático será el próximo periodo después de la fecha elegida.</span>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl"
        >
          Guardar movimiento
        </Button>
      </form>
    </div>
  );
}
