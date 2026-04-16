import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Calendar, X } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Input } from '../components/ui/input';
import { TransactionCard } from '../components/TransactionCard';
import { BottomNav } from '../components/BottomNav';
import { useFinanceStore } from '../store/useFinanceStore';
import { Transaction } from '../data/types';

type FilterType = 'all' | 'income' | 'expense';
type DateMode = 'all' | 'single' | 'range';

export function History() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [dateMode, setDateMode] = useState<DateMode>('all');
  const [singleDate, setSingleDate] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const transactions = useFinanceStore((state) => state.transactions);

  const hasActiveFilters = filterType !== 'all' || dateMode !== 'all';

  const clearAllFilters = () => {
    setFilterType('all');
    setDateMode('all');
    setSingleDate('');
    setDateFrom('');
    setDateTo('');
    Haptics.impact({ style: ImpactStyle.Light });
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Search filter
      const matchesSearch = !searchTerm ||
        transaction.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      const matchesType = filterType === 'all' || transaction.type === filterType;

      // Date filter
      const txDate = transaction.date.split('T')[0];
      let matchesDate = true;
      if (dateMode === 'single' && singleDate) {
        matchesDate = txDate === singleDate;
      } else if (dateMode === 'range') {
        if (dateFrom) matchesDate = matchesDate && txDate >= dateFrom;
        if (dateTo)   matchesDate = matchesDate && txDate <= dateTo;
      }

      return matchesSearch && matchesType && matchesDate;
    });
  }, [transactions, searchTerm, filterType, dateMode, singleDate, dateFrom, dateTo]);

  // Group by date (descending)
  const groupedTransactions = useMemo(() => {
    return filteredTransactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const key = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
      if (!acc[key]) acc[key] = [];
      acc[key].push(transaction);
      return acc;
    }, {} as Record<string, Transaction[]>);
  }, [filteredTransactions]);

  const typeBtn = (id: FilterType, label: string, activeClass: string) => (
    <button
      key={id}
      onClick={() => { Haptics.impact({ style: ImpactStyle.Light }); setFilterType(id); }}
      className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap font-medium transition-all ${
        filterType === id ? activeClass : 'bg-background border border-border text-muted-foreground'
      }`}
    >
      {label}
    </button>
  );

  const dateModeBtn = (id: DateMode, label: string) => (
    <button
      key={id}
      onClick={() => { Haptics.impact({ style: ImpactStyle.Light }); setDateMode(id); }}
      className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
        dateMode === id
          ? 'bg-primary text-white shadow'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-5 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Historial</h1>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 text-xs text-primary font-medium"
            >
              <X size={14} />
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            placeholder="Buscar transacciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 pr-12 h-11 bg-background border-border rounded-2xl text-sm"
          />
          <button
            onClick={() => {
              Haptics.impact({ style: ImpactStyle.Light });
              setShowFilters(!showFilters);
            }}
            className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
              showFilters || hasActiveFilters ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <div className="relative">
              <SlidersHorizontal size={20} />
              {hasActiveFilters && (
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-primary rounded-full text-[8px] text-white flex items-center justify-center font-bold">
                  !
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="space-y-4 pt-1 pb-2 animate-in slide-in-from-top-2 duration-200">

            {/* Type chips */}
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Tipo</p>
              <div className="flex gap-2">
                {typeBtn('all',     'Todos',    'bg-primary text-white')}
                {typeBtn('income',  'Ingresos', 'bg-[#22C55E] text-white')}
                {typeBtn('expense', 'Gastos',   'bg-[#EF4444] text-white')}
              </div>
            </div>

            {/* Date mode selector */}
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Fecha</p>
              <div className="flex bg-muted/30 p-1 rounded-xl gap-1 mb-3">
                {dateModeBtn('all',    'Todas')}
                {dateModeBtn('single', 'Exacta')}
                {dateModeBtn('range',  'Rango')}
              </div>

              {dateMode === 'single' && (
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    type="date"
                    value={singleDate}
                    onChange={(e) => setSingleDate(e.target.value)}
                    className="pl-10 h-10 bg-background border-border rounded-xl text-sm"
                  />
                </div>
              )}

              {dateMode === 'range' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1 ml-1">Desde</p>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                      <Input
                        type="date"
                        value={dateFrom}
                        max={dateTo || undefined}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="pl-9 h-10 bg-background border-border rounded-xl text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1 ml-1">Hasta</p>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                      <Input
                        type="date"
                        value={dateTo}
                        min={dateFrom || undefined}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="pl-9 h-10 bg-background border-border rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results count */}
        {(searchTerm || hasActiveFilters) && (
          <p className="text-xs text-muted-foreground mt-2">
            {filteredTransactions.length} resultado{filteredTransactions.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Transactions List */}
      <div className="px-6 pt-4">
        {Object.entries(groupedTransactions).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar size={40} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No hay transacciones</h3>
            <p className="text-sm text-muted-foreground text-center">
              {hasActiveFilters || searchTerm
                ? 'Ninguna transacción coincide con los filtros aplicados.'
                : 'Tus transacciones aparecerán aquí.'}
            </p>
          </div>
        ) : (
          Object.entries(groupedTransactions).map(([date, txns]) => (
            <div key={date} className="mb-6">
              <h3 className="text-sm text-muted-foreground mb-3 font-semibold">{date}</h3>
              <div className="space-y-3">
                {txns.map(transaction => (
                  <TransactionCard key={transaction.id} transaction={transaction} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
