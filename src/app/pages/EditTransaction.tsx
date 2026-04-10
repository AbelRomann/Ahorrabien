import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Calendar, DollarSign, FileText, CreditCard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { CategoryChip } from '../components/CategoryChip';
import { categories } from '../data/categories';
import { toast } from 'sonner';
import { useFinanceStore } from '../store/useFinanceStore';

export function EditTransaction() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const updateTransaction = useFinanceStore((state) => state.updateTransaction);
  const transactions = useFinanceStore((state) => state.transactions);
  
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Tarjeta');

  useEffect(() => {
    const tx = transactions.find(t => t.id === id);
    if (tx) {
      setType(tx.type);
      setAmount(tx.amount.toString());
      setSelectedCategory(tx.category);
      setDescription(tx.description || '');
      setDate(tx.date);
      setPaymentMethod(tx.paymentMethod);
    } else {
      toast.error('Movimiento no encontrado');
      navigate(-1);
    }
  }, [id, transactions, navigate]);

  const filteredCategories = categories.filter(
    c => c.type === type || c.type === 'both'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !selectedCategory || !date) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }
    
    if (id) {
      await updateTransaction({
        id,
        type,
        amount: parseFloat(amount),
        category: selectedCategory,
        description,
        date,
        paymentMethod
      });
      toast.success('Movimiento actualizado');
      setTimeout(() => navigate(-1), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-foreground">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Editar Movimiento</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 pt-6">
        {/* Type Toggle */}
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => setType('expense')}
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
            onClick={() => setType('income')}
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
                onClick={() => setSelectedCategory(category.id)}
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
              required
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

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl mb-4"
        >
          Guardar cambios
        </Button>
      </form>
    </div>
  );
}
