import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { SavingsGoal } from '../types';
import { CURRENCY_SYMBOL } from '../constants';
import { Target, TrendingUp, Plus, Trash2 } from 'lucide-react';

interface SavingsProps {
  goals: SavingsGoal[];
  setGoals: React.Dispatch<React.SetStateAction<SavingsGoal[]>>;
}

const Savings: React.FC<SavingsProps> = ({ goals, setGoals }) => {
  const [newGoal, setNewGoal] = useState({ name: '', target: '' });
  const [injection, setInjection] = useState<{ [key: string]: string }>({});

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(newGoal.target);
    if (!newGoal.name || isNaN(target) || target <= 0) return;

    const goal: SavingsGoal = {
      id: crypto.randomUUID(),
      name: newGoal.name,
      target,
      current: 0
    };
    setGoals(prev => [...prev, goal]);
    setNewGoal({ name: '', target: '' });
  };

  const handleInjection = (id: string) => {
    const amount = parseFloat(injection[id]);
    if (isNaN(amount) || amount <= 0) return;

    setGoals(prev => prev.map(g => 
      g.id === id ? { ...g, current: Math.min(g.target, g.current + amount) } : g
    ));
    setInjection(prev => ({ ...prev, [id]: '' }));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const inputClass = "w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out pb-20">
      <header className="space-y-1 sm:space-y-2">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Savings Goals</h1>
        <p className="opacity-50 font-bold uppercase tracking-widest text-xs sm:text-sm">Target Your Future Investments</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
        {/* Creation Form */}
        <div className="md:col-span-1">
          <GlassCard>
            <h2 className="text-lg sm:text-xl font-black mb-6 uppercase tracking-wider opacity-70">New Target</h2>
            <form onSubmit={addGoal} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase opacity-40 ml-2">Goal Name</label>
                <input
                  required
                  value={newGoal.name}
                  onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder="e.g. New Truck"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase opacity-40 ml-2">Target Amount ({CURRENCY_SYMBOL})</label>
                <input
                  type="number"
                  required
                  value={newGoal.target}
                  onChange={e => setNewGoal({ ...newGoal, target: e.target.value })}
                  placeholder="0.00"
                  className={`${inputClass} font-bold`}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs active:scale-95"
              >
                <Plus size={18} /> Create Goal
              </button>
            </form>
          </GlassCard>
        </div>

        {/* Goals Grid */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {goals.length === 0 ? (
            <div className="col-span-full py-20 glass flex flex-col items-center justify-center gap-4 rounded-[2rem] opacity-30">
              <Target size={48} />
              <p className="font-bold italic">No active goals yet. Start small!</p>
            </div>
          ) : (
            goals.map(goal => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <GlassCard key={goal.id} className="relative overflow-hidden group">
                  <button 
                    onClick={() => deleteGoal(goal.id)}
                    className="absolute top-4 right-4 text-rose-500/30 hover:text-rose-500 transition-colors active:scale-90"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="mb-6">
                    <h3 className="text-xl sm:text-2xl font-black mb-1 truncate pr-8">{goal.name}</h3>
                    <p className="text-xs font-bold opacity-40 tracking-widest uppercase">Target: {CURRENCY_SYMBOL}{goal.target.toLocaleString()}</p>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm font-black">
                      <span>{progress.toFixed(0)}% Complete</span>
                      <span>{CURRENCY_SYMBOL}{goal.current.toLocaleString()}</span>
                    </div>
                    <div className="h-4 bg-black/10 dark:bg-black/20 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Add..."
                      value={injection[goal.id] || ''}
                      onChange={e => setInjection({ ...injection, [goal.id]: e.target.value })}
                      className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold w-full min-w-0"
                    />
                    <button
                      onClick={() => handleInjection(goal.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex-shrink-0"
                    >
                      <TrendingUp size={20} />
                    </button>
                  </div>
                </GlassCard>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Savings;