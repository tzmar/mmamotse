
import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Settings } from '../types';
import { CURRENCY_SYMBOL } from '../constants';
import { Plus, Trash2, ShieldAlert, SlidersHorizontal, Palette } from 'lucide-react';
import { ThemeSwitcher } from '../components/ThemeSwitcher';

interface SettingsProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

const SettingsPage: React.FC<SettingsProps> = ({ settings, setSettings }) => {
  const [newIn, setNewIn] = useState('');
  const [newOut, setNewOut] = useState('');
  const [tempLimits, setTempLimits] = useState<{ [key: string]: string }>(
    Object.fromEntries(Object.entries(settings.limits).map(([k, v]) => [k, v.toString()]))
  );

  const addCategory = (type: 'IN' | 'OUT') => {
    const val = type === 'IN' ? newIn : newOut;
    if (!val) return;

    setSettings(prev => ({
      ...prev,
      [type === 'IN' ? 'inCategories' : 'outCategories']: [...prev[type === 'IN' ? 'inCategories' : 'outCategories'], val]
    }));
    type === 'IN' ? setNewIn('') : setNewOut('');
  };

  const removeCategory = (type: 'IN' | 'OUT', cat: string) => {
    setSettings(prev => ({
      ...prev,
      [type === 'IN' ? 'inCategories' : 'outCategories']: prev[type === 'IN' ? 'inCategories' : 'outCategories'].filter(c => c !== cat)
    }));
  };

  const updateLimit = (cat: string, limit: string) => {
    const val = parseFloat(limit);
    setSettings(prev => ({
      ...prev,
      limits: {
        ...prev.limits,
        [cat]: isNaN(val) ? 0 : val
      }
    }));
  };

  const inputClass = "flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <h1 className="text-5xl font-black tracking-tight">Configuration</h1>
        <p className="opacity-50 font-bold uppercase tracking-widest text-sm">Personalize Your Finance Engine</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <div className="md:col-span-2">
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <Palette className="text-purple-400" />
              <h2 className="text-xl font-black uppercase tracking-wider opacity-70">Appearance</h2>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-sm opacity-60 flex-1">Choose how PulaPocket looks. 'System' will match your device's current theme.</p>
              <ThemeSwitcher />
            </div>
          </GlassCard>
        </div>

        {/* Money In Categories */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <SlidersHorizontal className="text-emerald-500" />
            <h2 className="text-xl font-black uppercase tracking-wider opacity-70">Money In Categories</h2>
          </div>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                value={newIn}
                onChange={e => setNewIn(e.target.value)}
                placeholder="New Inflow Category..."
                className={inputClass}
              />
              <button 
                onClick={() => addCategory('IN')}
                className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-500/20"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {settings.inCategories.map(cat => (
                <div key={cat} className="glass px-4 py-2 rounded-full flex items-center gap-2 group transition-all">
                  <span className="text-sm font-bold">{cat}</span>
                  <button onClick={() => removeCategory('IN', cat)} className="opacity-0 group-hover:opacity-100 text-rose-500 transition-opacity">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Money Out Categories */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <SlidersHorizontal className="text-rose-500" />
            <h2 className="text-xl font-black uppercase tracking-wider opacity-70">Money Out Categories</h2>
          </div>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                value={newOut}
                onChange={e => setNewOut(e.target.value)}
                placeholder="New Outflow Category..."
                className={inputClass}
              />
              <button 
                onClick={() => addCategory('OUT')}
                className="bg-rose-600 p-2 rounded-xl text-white shadow-lg shadow-rose-500/20"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {settings.outCategories.map(cat => (
                <div key={cat} className="glass px-4 py-2 rounded-full flex items-center gap-2 group transition-all">
                  <span className="text-sm font-bold">{cat}</span>
                  <button onClick={() => removeCategory('OUT', cat)} className="opacity-0 group-hover:opacity-100 text-rose-500 transition-opacity">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Budget Limits */}
        <div className="md:col-span-2">
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert className="text-blue-500" />
              <h2 className="text-xl font-black uppercase tracking-wider opacity-70">Safety Limits (Monthly)</h2>
            </div>
            <p className="text-sm opacity-40 mb-8 italic">Set a maximum monthly spend for your outflow categories. The system will warn you if exceeded.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {settings.outCategories.map(cat => (
                <div key={cat} className="p-6 bg-black/5 dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/5 space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-40 ml-1">{cat}</label>
                  <div className="flex items-center gap-3">
                    <span className="font-bold opacity-30">{CURRENCY_SYMBOL}</span>
                    <input
                      type="number"
                      placeholder="No limit"
                      value={tempLimits[cat] || settings.limits[cat] || ''}
                      onChange={e => {
                        setTempLimits({ ...tempLimits, [cat]: e.target.value });
                        updateLimit(cat, e.target.value);
                      }}
                      className="w-full bg-transparent border-none outline-none text-xl font-black"
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
