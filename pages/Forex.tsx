
import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { ForexRates } from '../types';
import { CURRENCY_SYMBOL } from '../constants';
import { RefreshCcw, Save, Coins } from 'lucide-react';
import { Branding } from '../components/Branding';

interface ForexProps {
  forex: ForexRates;
  setForex: React.Dispatch<React.SetStateAction<ForexRates>>;
}

const Forex: React.FC<ForexProps> = ({ forex, setForex }) => {
  const [pulaAmount, setPulaAmount] = useState('100');
  const [editRates, setEditRates] = useState<ForexRates>(forex);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveRates = () => {
    setForex(editRates);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
          className={`glass px-3 sm:px-6 py-3 rounded-2xl flex items-center gap-3 font-bold transition-all text-sm uppercase tracking-widest flex-shrink-0 ${isEditing ? 'bg-blue-600 text-white border-blue-400' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
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
              {Object.entries(forex).map(([currency, rate]) => (
                <div key={currency} className="flex items-center justify-between p-6 bg-black/5 dark:bg-white/5 rounded-[1.5rem] border border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black/5 dark:bg-black/20 rounded-full flex items-center justify-center font-black text-xs">
                      {currency}
                    </div>
                    <span className="font-bold opacity-60">Converted Amount</span>
                  </div>
                  <div className="text-right">
                    {/* FIX: Explicitly convert `rate` to a number before multiplication to prevent type errors. */}
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
            <h2 className="text-xl font-black mb-8 uppercase tracking-wider opacity-70">Configure Cross Rates</h2>
            <div className="space-y-4">
              {Object.entries(editRates).map(([currency, rate]) => (
                <div key={currency} className="space-y-1">
                  <label className="text-[10px] font-black uppercase opacity-40 ml-2">1 Pula to {currency}</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={rate}
                    onChange={e => setEditRates({ ...editRates, [currency]: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 outline-none text-xl font-bold"
                  />
                </div>
              ))}
              <div className="pt-4 border-t border-black/10 dark:border-white/10 space-y-4">
                <p className="text-xs italic opacity-40">These rates are saved locally and will persist between sessions. Use current market data for precision.</p>
              </div>
            </div>
          </GlassCard>
        ) : (
          <div className="hidden lg:flex items-center justify-center opacity-10">
            <Coins size={200} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Forex;
