import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { ForexRates } from '../types';
import { CURRENCY_SYMBOL } from '../constants';
import { RefreshCcw, Save, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Branding } from '../components/Branding';

interface ForexProps {
  forex: ForexRates;
  setForex: React.Dispatch<React.SetStateAction<ForexRates>>;
}

const Forex: React.FC<ForexProps> = ({ forex, setForex }) => {
  const [pulaAmount, setPulaAmount] = useState('100');
  const [editRates, setEditRates] = useState<ForexRates>(forex);
  const [isEditing, setIsEditing] = useState(false);
  
  // New Currency State
  const [newCurrencyCode, setNewCurrencyCode] = useState('');
  const [newCurrencyRate, setNewCurrencyRate] = useState('');

  const handleSaveRates = () => {
    setForex(editRates);
    setIsEditing(false);
  };

  const handleDeleteCurrency = (code: string) => {
    const updated = { ...editRates };
    delete updated[code];
    setEditRates(updated);
  };

  const handleAddCurrency = () => {
    if (!newCurrencyCode || !newCurrencyRate) return;
    const code = newCurrencyCode.toUpperCase().trim();
    const rate = parseFloat(newCurrencyRate);

    if (code && !isNaN(rate) && rate > 0) {
      setEditRates(prev => ({
        [code]: rate,
        ...prev
      }));
      setNewCurrencyCode('');
      setNewCurrencyRate('');
    }
  };

  const inputClass = "w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-bold";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out pb-20">
      <header className="sticky top-6 z-30 mb-8 glass rounded-3xl px-4 sm:px-6 py-4 flex justify-between items-center shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3 sm:gap-6">
            <Branding size="sm" />
            <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">Forex Desk</h1>
                <p className="hidden sm:block opacity-50 font-bold uppercase tracking-widest text-xs">Cross-Rate Converter</p>
            </div>
        </div>
        <button 
          onClick={isEditing ? handleSaveRates : () => setIsEditing(true)}
          className={`glass px-3 sm:px-6 py-3 rounded-2xl flex items-center gap-3 font-bold transition-all text-sm uppercase tracking-widest flex-shrink-0 active:scale-95 ${isEditing ? 'bg-blue-600 text-white border-blue-400' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
        >
          {isEditing ? <Save size={18} /> : <RefreshCcw size={18} />}
          <span className="hidden sm:inline">{isEditing ? 'Save Rates' : 'Update Rates'}</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard>
          <h2 className="text-xl font-black mb-8 uppercase tracking-wider opacity-70">Convert Pula</h2>
          <div className="space-y-6">
            <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-[1.5rem] space-y-2">
              <label className="text-[10px] font-black uppercase opacity-40 ml-1">Base Currency (Botswana Pula)</label>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-black">{CURRENCY_SYMBOL}</span>
                <input
                  type="number"
                  value={pulaAmount}
                  onChange={e => setPulaAmount(e.target.value)}
                  className="bg-transparent border-none outline-none text-4xl font-black w-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              {Object.keys(forex).length === 0 && (
                <div className="text-center py-10 opacity-50">
                    <p className="italic font-bold mb-2">No currencies configured.</p>
                    <button onClick={() => setIsEditing(true)} className="text-blue-500 font-black uppercase text-xs tracking-widest flex items-center justify-center gap-1 hover:gap-2 transition-all">
                        Tap to Add <ArrowRight size={12} />
                    </button>
                </div>
              )}
              {Object.entries(forex).map(([currency, rate]) => (
                <div key={currency} className="flex items-center justify-between p-6 bg-black/5 dark:bg-white/5 rounded-[1.5rem] border border-black/5 dark:border-white/5 transform-gpu transition-all hover:scale-[1.02]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black/5 dark:bg-black/20 rounded-full flex items-center justify-center font-black text-xs">
                      {currency}
                    </div>
                    <span className="font-bold opacity-60">Converted Amount</span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black">{currency} {(parseFloat(pulaAmount || '0') * Number(rate)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <p className="text-[10px] opacity-30 font-bold">RATE: 1 P = {rate} {currency}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {isEditing ? (
          <GlassCard className="animate-in fade-in duration-300">
            <h2 className="text-xl font-black mb-8 uppercase tracking-wider opacity-70">Configure Rates</h2>
            <div className="space-y-6">
              
              {/* Add New Section - MOVED TO TOP */}
              <div className="p-4 bg-blue-600/5 dark:bg-blue-600/10 border border-blue-500/20 rounded-3xl">
                <label className="text-[10px] font-black uppercase opacity-60 ml-2 mb-2 block text-blue-600 dark:text-blue-400">Add New Currency</label>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        placeholder="Code (e.g. GBP)"
                        value={newCurrencyCode}
                        onChange={e => setNewCurrencyCode(e.target.value.toUpperCase())}
                        maxLength={4}
                        className={`${inputClass} sm:w-1/3 uppercase bg-white dark:bg-black/40`}
                    />
                    <input
                        type="number"
                        placeholder="Rate (e.g. 0.05)"
                        value={newCurrencyRate}
                        step="0.0001"
                        onChange={e => setNewCurrencyRate(e.target.value)}
                        className={`${inputClass} sm:w-1/3 bg-white dark:bg-black/40`}
                    />
                    <button 
                        onClick={handleAddCurrency}
                        disabled={!newCurrencyCode || !newCurrencyRate}
                        className="bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 sm:flex-1 flex items-center justify-center gap-2"
                    >
                        <Plus size={20} /> <span className="sm:hidden">Add</span>
                    </button>
                </div>
              </div>

              {/* Existing List */}
              <div className="space-y-4">
                {Object.entries(editRates).length === 0 && (
                    <p className="text-center opacity-40 text-sm py-4">List is empty. Add a currency above.</p>
                )}
                {Object.entries(editRates).map(([currency, rate]) => (
                  <div key={currency} className="space-y-1 animate-in slide-in-from-left-2 duration-300">
                    <label className="text-[10px] font-black uppercase opacity-40 ml-2">1 Pula to {currency}</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            step="0.0001"
                            value={rate}
                            onChange={e => setEditRates({ ...editRates, [currency]: parseFloat(e.target.value) || 0 })}
                            className={`${inputClass} text-xl`}
                        />
                        <button 
                            onClick={() => handleDeleteCurrency(currency)}
                            className="bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white px-4 rounded-2xl transition-all active:scale-95 flex-shrink-0"
                            aria-label={`Delete ${currency}`}
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-black/10 dark:border-white/10 space-y-4">
                <p className="text-xs italic opacity-40">These rates are saved locally and will persist between sessions. Use current market data for precision.</p>
              </div>
            </div>
          </GlassCard>
        ) : (
          <div className="hidden lg:flex flex-col items-center justify-center relative p-12 opacity-90">
            {/* Custom Pula Visualization */}
            <div className="relative w-72 h-72 flex items-center justify-center">
              {/* Animated Rings */}
              <svg className="absolute inset-0 w-full h-full animate-[spin_30s_linear_infinite]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="url(#pulaGrad)" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
                <defs>
                  <linearGradient id="pulaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              
              <svg className="absolute inset-0 w-full h-full animate-[spin_20s_linear_infinite_reverse]" viewBox="0 0 100 100" style={{ opacity: 0.2 }}>
                <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 6" />
              </svg>

              {/* Pulsing P Symbol */}
              <div className="relative z-10 flex flex-col items-center animate-pulse-slow">
                 <span className="text-[10rem] font-black bg-gradient-to-b from-blue-600 to-cyan-400 bg-clip-text text-transparent filter drop-shadow-xl select-none">P</span>
              </div>
              
              {/* Floating Diamonds (Botswana theme) */}
               <div className="absolute top-10 right-16 w-3 h-3 bg-cyan-400 rotate-45 opacity-40 animate-bounce" style={{ animationDuration: '3s' }} />
               <div className="absolute bottom-12 left-16 w-2 h-2 bg-blue-500 rotate-45 opacity-40 animate-bounce" style={{ animationDuration: '4s' }} />
            </div>
            <p className="mt-4 text-xs font-bold tracking-[0.5em] uppercase opacity-30 animate-pulse">Live Exchange</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forex;