import React, { useState, useCallback } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Transaction, Settings, TransactionType } from '../types';
import { CURRENCY_SYMBOL } from '../constants';
import { Plus, Trash2, Download, AlertTriangle } from 'lucide-react';

interface TransactionDeskProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  settings: Settings;
}

// Optimization: Memoized Row Component to prevent full list re-render on input change
const TransactionRow = React.memo(({ t, onDelete }: { t: Transaction, onDelete: (id: string) => void }) => (
  <tr className="group hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
    <td className="py-4 text-sm opacity-60 font-mono">{new Date(t.date).toLocaleDateString()}</td>
    <td className="py-4">
      <p className="font-bold">{t.category}</p>
      <p className="text-xs opacity-40 truncate max-w-[150px]">{t.note || 'No note'}</p>
    </td>
    <td className={`py-4 text-right font-black ${t.type === 'IN' ? 'text-emerald-500' : 'text-rose-500'}`}>
      {t.type === 'IN' ? '+' : '-'}{CURRENCY_SYMBOL}{t.amount.toLocaleString()}
    </td>
    <td className="py-4 text-center">
      <button
        onClick={() => onDelete(t.id)}
        className="p-2 text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all active:scale-95"
      >
        <Trash2 size={16} />
      </button>
    </td>
  </tr>
));

const TransactionDesk: React.FC<TransactionDeskProps> = ({ transactions, setTransactions, settings }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'OUT' as TransactionType,
    category: '',
    note: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [warning, setWarning] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const amount = parseFloat(formData.amount);

    if (isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Please enter a positive amount.';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category.';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date.';
    } else {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (new Date(formData.date) > today) {
        newErrors.date = 'Future dates are not allowed.';
      }
    }
    
    if (formData.note.length > 100) {
      newErrors.note = 'Note must be 100 characters or less.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const amount = parseFloat(formData.amount);
    
    // Budget Limit Logic
    if (formData.type === 'OUT') {
      const limit = settings.limits[formData.category];
      if (limit && limit > 0) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyTotal = transactions
          .filter(t => {
            const d = new Date(t.date);
            return t.type === 'OUT' && 
                   t.category === formData.category && 
                   d.getMonth() === currentMonth && 
                   d.getFullYear() === currentYear;
          })
          .reduce((sum, t) => sum + t.amount, 0);

        if (monthlyTotal + amount > limit) {
          setWarning(`Heed the Warning: This ${formData.category} expense exceeds your set limit of ${CURRENCY_SYMBOL}${limit}!`);
          setTimeout(() => setWarning(null), 5000);
        }
      }
    }

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount,
      type: formData.type,
      category: formData.category,
      note: formData.note,
      date: formData.date
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setFormData(prev => ({
      ...prev,
      amount: '',
      note: '',
      category: ''
    }));
    setErrors({});
  };

  // Memoized callback to ensure row stability
  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, [setTransactions]);

  const exportCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Note'];
    const rows = transactions.map(t => [t.date, t.type, t.category, t.amount, `"${t.note.replace(/"/g, '""')}"`]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pulapocket_statement_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const inputClass = "w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-4 py-4 focus:ring-2 outline-none transition-all";
  const errorClass = "border-rose-500 focus:ring-rose-500";
  const normalClass = "focus:ring-blue-500";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out">
      <header className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Transaction Desk</h1>
          <p className="opacity-50 font-bold uppercase tracking-widest text-sm">Post Your Inflow & Outflow</p>
        </div>
        <button 
          onClick={exportCSV}
          className="glass hover:bg-black/5 dark:hover:bg-white/10 px-6 py-3 rounded-2xl flex items-center justify-center sm:justify-start gap-3 font-bold transition-all text-sm uppercase tracking-widest flex-shrink-0 active:scale-95"
        >
          <Download size={18} /> Export Report
        </button>
      </header>

      {warning && (
        <div className="bg-amber-500/20 border border-amber-500/50 p-4 rounded-3xl flex items-center gap-4 text-amber-500 font-bold animate-pulse">
          <AlertTriangle />
          {warning}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <GlassCard className="sticky top-6">
            <h2 className="text-xl font-black mb-6 uppercase tracking-wider opacity-70">New Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-black/5 dark:bg-black/20 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'IN', category: '' })}
                  className={`py-2 rounded-xl text-xs font-black uppercase transition-all active:scale-95 ${formData.type === 'IN' ? 'bg-emerald-600 text-white shadow-lg' : 'opacity-40'}`}
                >
                  Money In
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'OUT', category: '' })}
                  className={`py-2 rounded-xl text-xs font-black uppercase transition-all active:scale-95 ${formData.type === 'OUT' ? 'bg-rose-600 text-white shadow-lg' : 'opacity-40'}`}
                >
                  Money Out
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase opacity-40 ml-2">Amount ({CURRENCY_SYMBOL})</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className={`${inputClass} text-xl font-bold ${errors.amount ? errorClass : normalClass}`}
                />
                {errors.amount && <p className="text-xs text-rose-500 font-bold ml-2 mt-1">{errors.amount}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase opacity-40 ml-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`${inputClass} appearance-none truncate ${errors.category ? errorClass : normalClass}`}
                >
                  <option value="" disabled className="dark:bg-slate-800 bg-white dark:text-white/60">Select a category...</option>
                  {(formData.type === 'IN' ? settings.inCategories : settings.outCategories).map(cat => (
                    <option key={cat} value={cat} title={cat} className="dark:bg-slate-900 bg-white dark:text-white text-black">{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-xs text-rose-500 font-bold ml-2 mt-1">{errors.category}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase opacity-40 ml-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`${inputClass} ${errors.date ? errorClass : normalClass}`}
                />
                {errors.date && <p className="text-xs text-rose-500 font-bold ml-2 mt-1">{errors.date}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase opacity-40 ml-2">Note (Optional)</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="Max 100 characters..."
                  className={`${inputClass} h-24 resize-none ${errors.note ? errorClass : normalClass}`}
                />
                {errors.note && <p className="text-xs text-rose-500 font-bold ml-2 mt-1">{errors.note}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm active:scale-95"
              >
                <Plus size={20} /> Post Transaction
              </button>
            </form>
          </GlassCard>
        </div>

        {/* Statement Table */}
        <div className="lg:col-span-2">
          <GlassCard className="overflow-hidden">
            <h2 className="text-xl font-black mb-6 uppercase tracking-wider opacity-70">Recent Statement</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-black/5 dark:border-white/10">
                    <th className="pb-4 text-[10px] font-black uppercase opacity-40">Date</th>
                    <th className="pb-4 text-[10px] font-black uppercase opacity-40">Detail</th>
                    <th className="pb-4 text-[10px] font-black uppercase opacity-40 text-right">Amount</th>
                    <th className="pb-4 text-[10px] font-black uppercase opacity-40 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center opacity-30 italic font-bold">No transactions found</td>
                    </tr>
                  ) : (
                    transactions.map(t => (
                      <TransactionRow key={t.id} t={t} onDelete={deleteTransaction} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default TransactionDesk;